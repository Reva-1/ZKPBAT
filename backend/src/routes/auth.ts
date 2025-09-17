import { Router, Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { validateRequest } from '../middleware/validation';
import { authMiddleware } from '../middleware/auth';
import { loginSchema, registerSchema } from '../validators/auth';

const router = Router();
const prisma = new PrismaClient();

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register', validateRequest(registerSchema), async (req, res, next) => {
  try {
    const { email, password, firstName, lastName, role = 'USER', organization } = req.body;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(409).json({
        error: 'User already exists with this email'
      });
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        role,
        organization,
        isActive: true
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        organization: true,
        isActive: true,
        createdAt: true
      }
    });

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      user,
      token
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 * @access  Public
 */
router.post('/login', validateRequest(loginSchema), async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user || !user.isActive) {
      return res.status(401).json({
        error: 'Invalid credentials'
      });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({
        error: 'Invalid credentials'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '24h' }
    );

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() }
    });

    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      },
      token
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   GET /api/auth/me
 * @desc    Get current user profile
 * @access  Private
 */
router.get('/me', authMiddleware, async (req: Request, res, next) => {
  try {
    const authReq = req as any;
    if (!authReq.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    const user = await prisma.user.findUnique({
      where: { id: authReq.user.userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
        lastLogin: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!user) {
      return res.status(404).json({
        error: 'User not found'
      });
    }

    res.json({
      user
    });
  } catch (error) {
    next(error);
  }
});

export default router;
