import request from 'supertest';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import authRouter from '../../src/routes/auth';
import express from 'express';

// Mock Prisma Client
const mockPrismaClient = {
  user: {
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
  auditLog: {
    create: jest.fn(),
  },
};

jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => mockPrismaClient),
}));

jest.mock('../../src/utils/logger', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
  },
}));

describe('Auth Routes', () => {
  let app: express.Application;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use('/api/auth', authRouter);
    jest.clearAllMocks();
  });

  describe('POST /api/auth/register', () => {
    test('should register a new user successfully', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'Password123!',
        firstName: 'John',
        lastName: 'Doe',
        organization: 'Test Corp'
      };

      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const mockUser = {
        id: 'user-123',
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        role: 'USER',
        organization: userData.organization,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      mockPrismaClient.user.findUnique.mockResolvedValue(null); // User doesn't exist
      mockPrismaClient.user.create.mockResolvedValue(mockUser);
      mockPrismaClient.auditLog.create.mockResolvedValue({});

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('token');
      expect(response.body.user).toEqual({
        id: mockUser.id,
        email: mockUser.email,
        firstName: mockUser.firstName,
        lastName: mockUser.lastName,
        role: mockUser.role,
        organization: mockUser.organization
      });
      expect(mockPrismaClient.user.create).toHaveBeenCalled();
    });

    test('should reject registration with existing email', async () => {
      const userData = {
        email: 'existing@example.com',
        password: 'Password123!',
        firstName: 'John',
        lastName: 'Doe'
      };

      mockPrismaClient.user.findUnique.mockResolvedValue({ id: 'existing-user' });

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData);

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('User already exists');
      expect(mockPrismaClient.user.create).not.toHaveBeenCalled();
    });

    test('should validate required fields', async () => {
      const incompleteData = {
        email: 'test@example.com',
        // missing password, firstName, lastName
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(incompleteData);

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });

    test('should validate email format', async () => {
      const userData = {
        email: 'invalid-email',
        password: 'Password123!',
        firstName: 'John',
        lastName: 'Doe'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData);

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });

    test('should validate password strength', async () => {
      const userData = {
        email: 'test@example.com',
        password: '123', // weak password
        firstName: 'John',
        lastName: 'Doe'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData);

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });
  });

  describe('POST /api/auth/login', () => {
    test('should login user with valid credentials', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'Password123!'
      };

      const hashedPassword = await bcrypt.hash(loginData.password, 10);
      const mockUser = {
        id: 'user-123',
        email: loginData.email,
        password: hashedPassword,
        firstName: 'John',
        lastName: 'Doe',
        role: 'USER',
        organization: 'Test Corp',
        isActive: true
      };

      mockPrismaClient.user.findUnique.mockResolvedValue(mockUser);
      mockPrismaClient.user.update.mockResolvedValue(mockUser);
      mockPrismaClient.auditLog.create.mockResolvedValue({});

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(response.body.user).toEqual({
        id: mockUser.id,
        email: mockUser.email,
        firstName: mockUser.firstName,
        lastName: mockUser.lastName,
        role: mockUser.role,
        organization: mockUser.organization
      });
      expect(mockPrismaClient.user.update).toHaveBeenCalledWith({
        where: { id: mockUser.id },
        data: { lastLogin: expect.any(Date) }
      });
    });

    test('should reject login with invalid email', async () => {
      const loginData = {
        email: 'nonexistent@example.com',
        password: 'Password123!'
      };

      mockPrismaClient.user.findUnique.mockResolvedValue(null);

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData);

      expect(response.status).toBe(401);
      expect(response.body.error).toBe('Invalid credentials');
    });

    test('should reject login with invalid password', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'WrongPassword!'
      };

      const hashedPassword = await bcrypt.hash('CorrectPassword123!', 10);
      const mockUser = {
        id: 'user-123',
        email: loginData.email,
        password: hashedPassword,
        isActive: true
      };

      mockPrismaClient.user.findUnique.mockResolvedValue(mockUser);

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData);

      expect(response.status).toBe(401);
      expect(response.body.error).toBe('Invalid credentials');
    });

    test('should reject login for inactive user', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'Password123!'
      };

      const hashedPassword = await bcrypt.hash(loginData.password, 10);
      const mockUser = {
        id: 'user-123',
        email: loginData.email,
        password: hashedPassword,
        isActive: false // Inactive user
      };

      mockPrismaClient.user.findUnique.mockResolvedValue(mockUser);

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData);

      expect(response.status).toBe(401);
      expect(response.body.error).toBe('Account is deactivated');
    });

    test('should validate required login fields', async () => {
      const incompleteData = {
        email: 'test@example.com'
        // missing password
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(incompleteData);

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });
  });

  describe('JWT Token Generation', () => {
    test('should generate valid JWT token', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'Password123!'
      };

      const hashedPassword = await bcrypt.hash(loginData.password, 10);
      const mockUser = {
        id: 'user-123',
        email: loginData.email,
        password: hashedPassword,
        firstName: 'John',
        lastName: 'Doe',
        role: 'USER',
        organization: 'Test Corp',
        isActive: true
      };

      mockPrismaClient.user.findUnique.mockResolvedValue(mockUser);
      mockPrismaClient.user.update.mockResolvedValue(mockUser);
      mockPrismaClient.auditLog.create.mockResolvedValue({});

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData);

      expect(response.status).toBe(200);
      expect(response.body.token).toBeDefined();

      // Verify token can be decoded
      const decoded = jwt.verify(response.body.token, process.env.JWT_SECRET || 'fallback-secret') as any;
      expect(decoded.userId).toBe(mockUser.id);
      expect(decoded.email).toBe(mockUser.email);
      expect(decoded.role).toBe(mockUser.role);
    });

    test('should include proper token expiration', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'Password123!'
      };

      const hashedPassword = await bcrypt.hash(loginData.password, 10);
      const mockUser = {
        id: 'user-123',
        email: loginData.email,
        password: hashedPassword,
        firstName: 'John',
        lastName: 'Doe',
        role: 'USER',
        isActive: true
      };

      mockPrismaClient.user.findUnique.mockResolvedValue(mockUser);
      mockPrismaClient.user.update.mockResolvedValue(mockUser);
      mockPrismaClient.auditLog.create.mockResolvedValue({});

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData);

      const decoded = jwt.verify(response.body.token, process.env.JWT_SECRET || 'fallback-secret') as any;
      expect(decoded.exp).toBeGreaterThan(Date.now() / 1000); // Should expire in the future
    });
  });

  describe('Audit Logging', () => {
    test('should create audit log for successful registration', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'Password123!',
        firstName: 'John',
        lastName: 'Doe'
      };

      const mockUser = {
        id: 'user-123',
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        role: 'USER',
        isActive: true
      };

      mockPrismaClient.user.findUnique.mockResolvedValue(null);
      mockPrismaClient.user.create.mockResolvedValue(mockUser);
      mockPrismaClient.auditLog.create.mockResolvedValue({});

      await request(app)
        .post('/api/auth/register')
        .send(userData);

      expect(mockPrismaClient.auditLog.create).toHaveBeenCalledWith({
        data: {
          action: 'REGISTER',
          entityType: 'USER',
          entityId: mockUser.id,
          userId: mockUser.id,
          details: {
            email: userData.email,
            firstName: userData.firstName,
            lastName: userData.lastName
          }
        }
      });
    });

    test('should create audit log for successful login', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'Password123!'
      };

      const hashedPassword = await bcrypt.hash(loginData.password, 10);
      const mockUser = {
        id: 'user-123',
        email: loginData.email,
        password: hashedPassword,
        isActive: true
      };

      mockPrismaClient.user.findUnique.mockResolvedValue(mockUser);
      mockPrismaClient.user.update.mockResolvedValue(mockUser);
      mockPrismaClient.auditLog.create.mockResolvedValue({});

      await request(app)
        .post('/api/auth/login')
        .send(loginData);

      expect(mockPrismaClient.auditLog.create).toHaveBeenCalledWith({
        data: {
          action: 'LOGIN',
          entityType: 'USER',
          entityId: mockUser.id,
          userId: mockUser.id,
          details: {
            email: loginData.email
          }
        }
      });
    });
  });

  describe('Error Handling', () => {
    test('should handle database errors during registration', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'Password123!',
        firstName: 'John',
        lastName: 'Doe'
      };

      mockPrismaClient.user.findUnique.mockRejectedValue(new Error('Database connection failed'));

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData);

      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Internal server error');
    });

    test('should handle database errors during login', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'Password123!'
      };

      mockPrismaClient.user.findUnique.mockRejectedValue(new Error('Database connection failed'));

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData);

      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Internal server error');
    });

    test('should handle bcrypt errors', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'Password123!',
        firstName: 'John',
        lastName: 'Doe'
      };

      mockPrismaClient.user.findUnique.mockResolvedValue(null);
      
      // Mock bcrypt to throw an error
      jest.doMock('bcryptjs', () => ({
        hash: jest.fn().mockRejectedValue(new Error('Bcrypt error')),
        compare: jest.fn()
      }));

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData);

      expect(response.status).toBe(500);
    });
  });

  describe('Security Tests', () => {
    test('should not return password in response', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'Password123!',
        firstName: 'John',
        lastName: 'Doe'
      };

      const mockUser = {
        id: 'user-123',
        email: userData.email,
        password: 'hashed-password',
        firstName: userData.firstName,
        lastName: userData.lastName,
        role: 'USER',
        isActive: true
      };

      mockPrismaClient.user.findUnique.mockResolvedValue(null);
      mockPrismaClient.user.create.mockResolvedValue(mockUser);
      mockPrismaClient.auditLog.create.mockResolvedValue({});

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData);

      expect(response.body.user).not.toHaveProperty('password');
    });

    test('should hash passwords before storing', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'Password123!',
        firstName: 'John',
        lastName: 'Doe'
      };

      mockPrismaClient.user.findUnique.mockResolvedValue(null);
      mockPrismaClient.user.create.mockResolvedValue({ id: 'user-123' });
      mockPrismaClient.auditLog.create.mockResolvedValue({});

      await request(app)
        .post('/api/auth/register')
        .send(userData);

      // Check that the password passed to create is hashed
      const createCall = mockPrismaClient.user.create.mock.calls[0][0];
      expect(createCall.data.password).not.toBe(userData.password);
      expect(createCall.data.password).toMatch(/^\$2[aby]\$/); // bcrypt hash format
    });

    test('should prevent timing attacks on login', async () => {
      // This test ensures consistent response time whether user exists or not
      const loginData = {
        email: 'nonexistent@example.com',
        password: 'Password123!'
      };

      mockPrismaClient.user.findUnique.mockResolvedValue(null);

      const start = Date.now();
      await request(app)
        .post('/api/auth/login')
        .send(loginData);
      const end = Date.now();

      // Should take some time (bcrypt comparison) even for non-existent users
      expect(end - start).toBeGreaterThan(50); // At least 50ms
    });
  });
});
