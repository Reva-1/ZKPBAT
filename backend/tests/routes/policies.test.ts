import request from 'supertest';
import express from 'express';
import jwt from 'jsonwebtoken';
import policyRouter from '../../src/routes/policies';

// Mock Prisma Client
const mockPrismaClient = {
  policy: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    count: jest.fn(),
  },
  policyVersion: {
    create: jest.fn(),
    findMany: jest.fn(),
  },
  policyAssignment: {
    create: jest.fn(),
    deleteMany: jest.fn(),
    findMany: jest.fn(),
  },
  auditLog: {
    create: jest.fn(),
  },
  user: {
    findMany: jest.fn(),
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

describe('Policy Routes', () => {
  let app: express.Application;
  let authToken: string;
  let adminToken: string;
  let userToken: string;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    
    // Mock JWT authentication middleware
    app.use((req, res, next) => {
      const token = req.headers.authorization?.replace('Bearer ', '');
      if (!token) {
        return res.status(401).json({ error: 'No token provided' });
      }
      
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'test-secret') as any;
        (req as any).user = decoded;
        next();
      } catch (error) {
        return res.status(401).json({ error: 'Invalid token' });
      }
    });
    
    app.use('/api/policies', policyRouter);

    // Create test tokens
    authToken = jwt.sign(
      { userId: 'test-user', role: 'POLICY_MANAGER' },
      process.env.JWT_SECRET || 'test-secret'
    );

    adminToken = jwt.sign(
      { userId: 'admin-user', role: 'ADMIN' },
      process.env.JWT_SECRET || 'test-secret'
    );

    userToken = jwt.sign(
      { userId: 'regular-user', role: 'USER' },
      process.env.JWT_SECRET || 'test-secret'
    );

    jest.clearAllMocks();
  });

  describe('GET /api/policies', () => {
    test('should fetch all policies with pagination', async () => {
      const mockPolicies = [
        {
          id: 'policy-1',
          title: 'Data Privacy Policy',
          description: 'Comprehensive data privacy policy',
          category: 'PRIVACY',
          status: 'ACTIVE',
          version: 1,
          effectiveDate: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
          author: { firstName: 'John', lastName: 'Doe' }
        },
        {
          id: 'policy-2',
          title: 'Security Policy',
          description: 'IT security policy',
          category: 'SECURITY',
          status: 'DRAFT',
          version: 1,
          effectiveDate: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
          author: { firstName: 'Jane', lastName: 'Smith' }
        }
      ];

      mockPrismaClient.policy.findMany.mockResolvedValue(mockPolicies);
      mockPrismaClient.policy.count.mockResolvedValue(2);

      const response = await request(app)
        .get('/api/policies')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.policies).toEqual(mockPolicies);
      expect(response.body.total).toBe(2);
      expect(response.body.page).toBe(1);
      expect(response.body.limit).toBe(10);
    });

    test('should handle pagination parameters', async () => {
      mockPrismaClient.policy.findMany.mockResolvedValue([]);
      mockPrismaClient.policy.count.mockResolvedValue(0);

      const response = await request(app)
        .get('/api/policies?page=2&limit=5')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(mockPrismaClient.policy.findMany).toHaveBeenCalledWith({
        include: {
          author: {
            select: {
              firstName: true,
              lastName: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip: 5, // (page - 1) * limit = (2 - 1) * 5
        take: 5
      });
    });

    test('should filter by status', async () => {
      mockPrismaClient.policy.findMany.mockResolvedValue([]);
      mockPrismaClient.policy.count.mockResolvedValue(0);

      await request(app)
        .get('/api/policies?status=ACTIVE')
        .set('Authorization', `Bearer ${authToken}`);

      expect(mockPrismaClient.policy.findMany).toHaveBeenCalledWith({
        where: { status: 'ACTIVE' },
        include: {
          author: {
            select: {
              firstName: true,
              lastName: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip: 0,
        take: 10
      });
    });

    test('should filter by category', async () => {
      mockPrismaClient.policy.findMany.mockResolvedValue([]);
      mockPrismaClient.policy.count.mockResolvedValue(0);

      await request(app)
        .get('/api/policies?category=SECURITY')
        .set('Authorization', `Bearer ${authToken}`);

      expect(mockPrismaClient.policy.findMany).toHaveBeenCalledWith({
        where: { category: 'SECURITY' },
        include: {
          author: {
            select: {
              firstName: true,
              lastName: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip: 0,
        take: 10
      });
    });

    test('should search by title', async () => {
      mockPrismaClient.policy.findMany.mockResolvedValue([]);
      mockPrismaClient.policy.count.mockResolvedValue(0);

      await request(app)
        .get('/api/policies?search=privacy')
        .set('Authorization', `Bearer ${authToken}`);

      expect(mockPrismaClient.policy.findMany).toHaveBeenCalledWith({
        where: {
          OR: [
            { title: { contains: 'privacy', mode: 'insensitive' } },
            { description: { contains: 'privacy', mode: 'insensitive' } }
          ]
        },
        include: {
          author: {
            select: {
              firstName: true,
              lastName: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip: 0,
        take: 10
      });
    });
  });

  describe('GET /api/policies/:id', () => {
    test('should fetch single policy by ID', async () => {
      const mockPolicy = {
        id: 'policy-1',
        title: 'Data Privacy Policy',
        description: 'Comprehensive data privacy policy',
        content: 'Policy content here...',
        category: 'PRIVACY',
        status: 'ACTIVE',
        version: 1,
        effectiveDate: new Date(),
        expirationDate: null,
        tags: ['privacy', 'gdpr'],
        authorId: 'author-1',
        createdAt: new Date(),
        updatedAt: new Date(),
        author: { firstName: 'John', lastName: 'Doe' },
        versions: [],
        assignments: []
      };

      mockPrismaClient.policy.findUnique.mockResolvedValue(mockPolicy);

      const response = await request(app)
        .get('/api/policies/policy-1')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockPolicy);
    });

    test('should return 404 for non-existent policy', async () => {
      mockPrismaClient.policy.findUnique.mockResolvedValue(null);

      const response = await request(app)
        .get('/api/policies/non-existent')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Policy not found');
    });
  });

  describe('POST /api/policies', () => {
    test('should create new policy successfully', async () => {
      const policyData = {
        title: 'New Security Policy',
        description: 'A comprehensive security policy',
        content: 'Detailed policy content...',
        category: 'SECURITY',
        effectiveDate: '2025-10-01',
        tags: ['security', 'it']
      };

      const mockCreatedPolicy = {
        id: 'new-policy-id',
        ...policyData,
        status: 'DRAFT',
        version: 1,
        authorId: 'test-user',
        createdAt: new Date(),
        updatedAt: new Date(),
        effectiveDate: new Date(policyData.effectiveDate)
      };

      mockPrismaClient.policy.create.mockResolvedValue(mockCreatedPolicy);
      mockPrismaClient.policyVersion.create.mockResolvedValue({});
      mockPrismaClient.auditLog.create.mockResolvedValue({});

      const response = await request(app)
        .post('/api/policies')
        .set('Authorization', `Bearer ${authToken}`)
        .send(policyData);

      expect(response.status).toBe(201);
      expect(response.body).toEqual(mockCreatedPolicy);
      expect(mockPrismaClient.policy.create).toHaveBeenCalledWith({
        data: {
          title: policyData.title,
          description: policyData.description,
          content: policyData.content,
          category: policyData.category,
          effectiveDate: new Date(policyData.effectiveDate),
          tags: policyData.tags,
          authorId: 'test-user'
        }
      });
    });

    test('should validate required fields', async () => {
      const incompleteData = {
        title: 'New Policy'
        // missing description, content, category, effectiveDate
      };

      const response = await request(app)
        .post('/api/policies')
        .set('Authorization', `Bearer ${authToken}`)
        .send(incompleteData);

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });

    test('should validate category enum', async () => {
      const policyData = {
        title: 'New Policy',
        description: 'Description',
        content: 'Content',
        category: 'INVALID_CATEGORY',
        effectiveDate: '2025-10-01'
      };

      const response = await request(app)
        .post('/api/policies')
        .set('Authorization', `Bearer ${authToken}`)
        .send(policyData);

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });

    test('should require ADMIN or POLICY_MANAGER role', async () => {
      const policyData = {
        title: 'New Policy',
        description: 'Description',
        content: 'Content',
        category: 'SECURITY',
        effectiveDate: '2025-10-01'
      };

      const response = await request(app)
        .post('/api/policies')
        .set('Authorization', `Bearer ${userToken}`) // Regular user token
        .send(policyData);

      expect(response.status).toBe(403);
    });
  });

  describe('PUT /api/policies/:id', () => {
    test('should update policy successfully', async () => {
      const updateData = {
        title: 'Updated Policy Title',
        description: 'Updated description',
        status: 'ACTIVE'
      };

      const existingPolicy = {
        id: 'policy-1',
        title: 'Original Title',
        description: 'Original description',
        content: 'Content',
        category: 'SECURITY',
        status: 'DRAFT',
        version: 1,
        authorId: 'test-user'
      };

      const updatedPolicy = {
        ...existingPolicy,
        ...updateData,
        version: 2,
        updatedAt: new Date()
      };

      mockPrismaClient.policy.findUnique.mockResolvedValue(existingPolicy);
      mockPrismaClient.policy.update.mockResolvedValue(updatedPolicy);
      mockPrismaClient.policyVersion.create.mockResolvedValue({});
      mockPrismaClient.auditLog.create.mockResolvedValue({});

      const response = await request(app)
        .put('/api/policies/policy-1')
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(updatedPolicy);
    });

    test('should return 404 for non-existent policy', async () => {
      mockPrismaClient.policy.findUnique.mockResolvedValue(null);

      const response = await request(app)
        .put('/api/policies/non-existent')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ title: 'Updated Title' });

      expect(response.status).toBe(404);
    });

    test('should enforce authorization for policy updates', async () => {
      const existingPolicy = {
        id: 'policy-1',
        authorId: 'different-user',
        status: 'DRAFT'
      };

      mockPrismaClient.policy.findUnique.mockResolvedValue(existingPolicy);

      const response = await request(app)
        .put('/api/policies/policy-1')
        .set('Authorization', `Bearer ${userToken}`) // Different user
        .send({ title: 'Updated Title' });

      expect(response.status).toBe(403);
    });

    test('should allow admin to update any policy', async () => {
      const existingPolicy = {
        id: 'policy-1',
        authorId: 'different-user',
        status: 'DRAFT'
      };

      const updatedPolicy = {
        ...existingPolicy,
        title: 'Admin Updated',
        version: 2
      };

      mockPrismaClient.policy.findUnique.mockResolvedValue(existingPolicy);
      mockPrismaClient.policy.update.mockResolvedValue(updatedPolicy);
      mockPrismaClient.policyVersion.create.mockResolvedValue({});
      mockPrismaClient.auditLog.create.mockResolvedValue({});

      const response = await request(app)
        .put('/api/policies/policy-1')
        .set('Authorization', `Bearer ${adminToken}`) // Admin token
        .send({ title: 'Admin Updated' });

      expect(response.status).toBe(200);
    });
  });

  describe('DELETE /api/policies/:id', () => {
    test('should delete policy successfully', async () => {
      const existingPolicy = {
        id: 'policy-1',
        authorId: 'test-user',
        status: 'DRAFT'
      };

      mockPrismaClient.policy.findUnique.mockResolvedValue(existingPolicy);
      mockPrismaClient.policy.delete.mockResolvedValue(existingPolicy);
      mockPrismaClient.auditLog.create.mockResolvedValue({});

      const response = await request(app)
        .delete('/api/policies/policy-1')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(204);
      expect(mockPrismaClient.policy.delete).toHaveBeenCalledWith({
        where: { id: 'policy-1' }
      });
    });

    test('should return 404 for non-existent policy', async () => {
      mockPrismaClient.policy.findUnique.mockResolvedValue(null);

      const response = await request(app)
        .delete('/api/policies/non-existent')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(404);
    });

    test('should enforce authorization for policy deletion', async () => {
      const existingPolicy = {
        id: 'policy-1',
        authorId: 'different-user',
        status: 'DRAFT'
      };

      mockPrismaClient.policy.findUnique.mockResolvedValue(existingPolicy);

      const response = await request(app)
        .delete('/api/policies/policy-1')
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(403);
    });
  });

  describe('POST /api/policies/:id/assign', () => {
    test('should assign policy to users successfully', async () => {
      const assignmentData = {
        userIds: ['user-1', 'user-2', 'user-3']
      };

      const existingPolicy = {
        id: 'policy-1',
        status: 'ACTIVE'
      };

      const mockUsers = [
        { id: 'user-1', firstName: 'John', lastName: 'Doe' },
        { id: 'user-2', firstName: 'Jane', lastName: 'Smith' },
        { id: 'user-3', firstName: 'Bob', lastName: 'Johnson' }
      ];

      mockPrismaClient.policy.findUnique.mockResolvedValue(existingPolicy);
      mockPrismaClient.user.findMany.mockResolvedValue(mockUsers);
      mockPrismaClient.policyAssignment.deleteMany.mockResolvedValue({ count: 0 });
      mockPrismaClient.policyAssignment.create
        .mockResolvedValueOnce({ id: 'assign-1' })
        .mockResolvedValueOnce({ id: 'assign-2' })
        .mockResolvedValueOnce({ id: 'assign-3' });
      mockPrismaClient.auditLog.create.mockResolvedValue({});

      const response = await request(app)
        .post('/api/policies/policy-1/assign')
        .set('Authorization', `Bearer ${authToken}`)
        .send(assignmentData);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Policy assigned successfully');
      expect(response.body.assignedCount).toBe(3);
    });

    test('should validate user IDs exist', async () => {
      const assignmentData = {
        userIds: ['non-existent-user']
      };

      const existingPolicy = { id: 'policy-1', status: 'ACTIVE' };
      
      mockPrismaClient.policy.findUnique.mockResolvedValue(existingPolicy);
      mockPrismaClient.user.findMany.mockResolvedValue([]); // No users found

      const response = await request(app)
        .post('/api/policies/policy-1/assign')
        .set('Authorization', `Bearer ${authToken}`)
        .send(assignmentData);

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Some user IDs are invalid');
    });

    test('should require ADMIN or POLICY_MANAGER role', async () => {
      const response = await request(app)
        .post('/api/policies/policy-1/assign')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ userIds: ['user-1'] });

      expect(response.status).toBe(403);
    });
  });

  describe('GET /api/policies/:id/versions', () => {
    test('should fetch policy version history', async () => {
      const mockVersions = [
        {
          id: 'version-2',
          version: 2,
          changes: 'Updated content and title',
          createdAt: new Date(),
          createdBy: { firstName: 'John', lastName: 'Doe' }
        },
        {
          id: 'version-1',
          version: 1,
          changes: 'Initial version',
          createdAt: new Date(),
          createdBy: { firstName: 'John', lastName: 'Doe' }
        }
      ];

      mockPrismaClient.policyVersion.findMany.mockResolvedValue(mockVersions);

      const response = await request(app)
        .get('/api/policies/policy-1/versions')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockVersions);
    });
  });

  describe('Error Handling', () => {
    test('should handle database errors gracefully', async () => {
      mockPrismaClient.policy.findMany.mockRejectedValue(new Error('Database connection failed'));

      const response = await request(app)
        .get('/api/policies')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Internal server error');
    });

    test('should handle validation errors', async () => {
      const invalidData = {
        title: '', // Empty title
        effectiveDate: 'invalid-date'
      };

      const response = await request(app)
        .post('/api/policies')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidData);

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });
  });

  describe('Authentication and Authorization', () => {
    test('should reject requests without token', async () => {
      const response = await request(app)
        .get('/api/policies');

      expect(response.status).toBe(401);
    });

    test('should reject requests with invalid token', async () => {
      const response = await request(app)
        .get('/api/policies')
        .set('Authorization', 'Bearer invalid-token');

      expect(response.status).toBe(401);
    });

    test('should allow different roles appropriate access', async () => {
      mockPrismaClient.policy.findMany.mockResolvedValue([]);
      mockPrismaClient.policy.count.mockResolvedValue(0);

      // Regular user should be able to read policies
      const response = await request(app)
        .get('/api/policies')
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(200);
    });
  });
});
