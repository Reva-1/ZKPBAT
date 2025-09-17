import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware } from '../middleware/auth';
import { roleCheck } from '../middleware/roleCheck';
import { validateRequest } from '../middleware/validation';
import { createPolicySchema, updatePolicySchema } from '../validators/policy';

const router = Router();
const prisma = new PrismaClient();

/**
 * @route   GET /api/policies
 * @desc    Get all policies (with filtering, sorting, pagination)
 * @access  Private
 */
router.get('/', authMiddleware, async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      status,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);

    // Build where clause
    const where: any = {};
    
    if (category) {
      where.category = category;
    }
    
    if (status) {
      where.status = status;
    }
    
    if (search) {
      where.OR = [
        { title: { contains: search as string, mode: 'insensitive' } },
        { description: { contains: search as string, mode: 'insensitive' } },
        { content: { contains: search as string, mode: 'insensitive' } }
      ];
    }

    // Get policies with pagination
    const [policies, total] = await Promise.all([
      prisma.policy.findMany({
        where,
        skip,
        take,
        orderBy: {
          [sortBy as string]: sortOrder === 'desc' ? 'desc' : 'asc'
        },
        include: {
          author: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true
            }
          },
          _count: {
            select: {
              auditLogs: true
            }
          }
        }
      }),
      prisma.policy.count({ where })
    ]);

    const totalPages = Math.ceil(total / take);

    res.json({
      policies,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages,
        hasNext: Number(page) < totalPages,
        hasPrev: Number(page) > 1
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   GET /api/policies/:id
 * @desc    Get policy by ID
 * @access  Private
 */
router.get('/:id', authMiddleware, async (req, res, next) => {
  try {
    const { id } = req.params;

    const policy = await prisma.policy.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        },
        auditLogs: {
          orderBy: { createdAt: 'desc' },
          take: 10,
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true
              }
            }
          }
        }
      }
    });

    if (!policy) {
      return res.status(404).json({ error: 'Policy not found' });
    }

    res.json({ policy });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   POST /api/policies
 * @desc    Create new policy
 * @access  Private (Admin, Policy_Manager)
 */
router.post('/', 
  authMiddleware, 
  roleCheck(['ADMIN', 'POLICY_MANAGER']), 
  validateRequest(createPolicySchema),
  async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const {
      title,
      description,
      content,
      category,
      effectiveDate,
      expirationDate,
      tags = []
    } = req.body;

    const policy = await prisma.policy.create({
      data: {
        title,
        description,
        content,
        category,
        effectiveDate: new Date(effectiveDate),
        expirationDate: expirationDate ? new Date(expirationDate) : null,
        authorId: req.user.userId,
        status: 'DRAFT',
        version: 1
      },
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        action: 'CREATE_POLICY',
        entityType: 'POLICY',
        entityId: policy.id,
        userId: req.user.userId,
        details: {
          title: policy.title,
          category: policy.category,
          status: policy.status
        }
      }
    });

    res.status(201).json({
      message: 'Policy created successfully',
      policy
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   PUT /api/policies/:id
 * @desc    Update policy
 * @access  Private (Admin, Policy_Manager, or Author)
 */
router.put('/:id', 
  authMiddleware, 
  validateRequest(updatePolicySchema),
  async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const { id } = req.params;
    const {
      title,
      description,
      content,
      category,
      effectiveDate,
      expirationDate,
      status,
      tags = []
    } = req.body;

    // Check if policy exists and user has permission
    const existingPolicy = await prisma.policy.findUnique({
      where: { id }
    });

    if (!existingPolicy) {
      return res.status(404).json({ error: 'Policy not found' });
    }

    // Check permissions: Admin, Policy_Manager, or Author can update
    if (req.user.role !== 'ADMIN' && 
        req.user.role !== 'POLICY_MANAGER' && 
        existingPolicy.authorId !== req.user.userId) {
      return res.status(403).json({ error: 'Insufficient permissions to update this policy' });
    }

    const policy = await prisma.policy.update({
      where: { id },
      data: {
        title,
        description,
        content,
        category,
        effectiveDate: effectiveDate ? new Date(effectiveDate) : undefined,
        expirationDate: expirationDate ? new Date(expirationDate) : null,
        status,
        updatedAt: new Date(),
        version: { increment: 1 }
      },
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        action: 'UPDATE_POLICY',
        entityType: 'POLICY',
        entityId: policy.id,
        userId: req.user.userId,
        details: {
          title: policy.title,
          category: policy.category,
          status: policy.status,
          version: policy.version
        }
      }
    });

    res.json({
      message: 'Policy updated successfully',
      policy
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   DELETE /api/policies/:id
 * @desc    Delete policy (soft delete)
 * @access  Private (Admin only)
 */
router.delete('/:id', authMiddleware, roleCheck(['ADMIN']), async (req, res, next) => {
  try {
    const { id } = req.params;

    const policy = await prisma.policy.findUnique({
      where: { id }
    });

    if (!policy) {
      return res.status(404).json({ error: 'Policy not found' });
    }

    // Soft delete by updating status
    await prisma.policy.update({
      where: { id },
      data: {
        status: 'ARCHIVED',
        updatedAt: new Date()
      }
    });

    // Create audit log
    if (req.user) {
      await prisma.auditLog.create({
        data: {
          action: 'DELETE_POLICY',
          entityType: 'POLICY',
          entityId: policy.id,
          userId: req.user.userId,
          details: {
            title: policy.title,
            category: policy.category,
            previousStatus: policy.status
          }
        }
      });
    }

    res.json({ message: 'Policy deleted successfully' });
  } catch (error) {
    next(error);
  }
});

export default router;
