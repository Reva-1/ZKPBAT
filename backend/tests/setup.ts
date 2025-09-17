import { PrismaClient } from '@prisma/client';

declare global {
  var __MONGO_URI__: string;
  var __MONGO_DB_NAME__: string;
}

// Mock Prisma for testing
jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => ({
    user: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    policy: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    policyVersion: {
      findMany: jest.fn(),
      create: jest.fn(),
    },
    auditLog: {
      create: jest.fn(),
      findMany: jest.fn(),
    },
    $disconnect: jest.fn(),
  })),
}));

// Setup environment variables for testing
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-jwt-secret';
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test_db';

beforeEach(() => {
  jest.clearAllMocks();
});

afterAll(async () => {
  // Clean up any open handles
  await new Promise(resolve => setTimeout(resolve, 500));
});
