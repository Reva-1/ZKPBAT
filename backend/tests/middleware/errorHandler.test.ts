import { Request, Response, NextFunction } from 'express';
import { errorHandler } from '../../src/middleware/errorHandler';
import { logger } from '../../src/utils/logger';

// Mock logger
jest.mock('../../src/utils/logger', () => ({
  logger: {
    error: jest.fn(),
  },
}));

describe('Error Handler Middleware', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  test('should handle standard errors with 500 status', () => {
    const error = new Error('Test error message');

    errorHandler(error, req as Request, res as Response, next);

    expect(logger.error).toHaveBeenCalledWith('Error:', error.message);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Internal server error',
      message: process.env.NODE_ENV === 'development' ? 'Test error message' : 'Something went wrong'
    });
  });

  test('should handle errors with custom status codes', () => {
    const error = new Error('Validation failed') as any;
    error.statusCode = 400;

    errorHandler(error, req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Internal server error',
      message: process.env.NODE_ENV === 'development' ? 'Validation failed' : 'Something went wrong'
    });
  });

  test('should handle Prisma client known request errors', () => {
    const error = new Error('Unique constraint violation') as any;
    error.code = 'P2002';
    error.meta = { target: ['email'] };

    errorHandler(error, req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Database constraint violation',
      message: 'A record with this email already exists'
    });
  });

  test('should handle Prisma record not found errors', () => {
    const error = new Error('Record not found') as any;
    error.code = 'P2025';

    errorHandler(error, req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Record not found',
      message: 'The requested resource was not found'
    });
  });

  test('should handle JWT errors', () => {
    const error = new Error('JsonWebTokenError') as any;
    error.name = 'JsonWebTokenError';

    errorHandler(error, req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Invalid token',
      message: 'Authentication failed'
    });
  });

  test('should handle JWT expiration errors', () => {
    const error = new Error('TokenExpiredError') as any;
    error.name = 'TokenExpiredError';

    errorHandler(error, req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Token expired',
      message: 'Please log in again'
    });
  });

  test('should handle validation errors', () => {
    const error = new Error('ValidationError') as any;
    error.name = 'ValidationError';
    error.details = [
      { message: 'Email is required' },
      { message: 'Password must be at least 6 characters' }
    ];

    errorHandler(error, req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Validation failed',
      details: ['Email is required', 'Password must be at least 6 characters']
    });
  });

  test('should not expose error details in production', () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';

    const error = new Error('Sensitive error information');

    errorHandler(error, req as Request, res as Response, next);

    expect(res.json).toHaveBeenCalledWith({
      error: 'Internal server error',
      message: 'Something went wrong'
    });

    process.env.NODE_ENV = originalEnv;
  });
});
