import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { authMiddleware } from '../../src/middleware/auth';

// Mock jwt
jest.mock('jsonwebtoken');
const mockJwt = jwt as jest.Mocked<typeof jwt>;

interface AuthenticatedRequest extends Request {
  user?: any;
}

describe('Auth Middleware', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = {
      headers: {}
    } as any;
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    } as any;
    next = jest.fn();
    jest.clearAllMocks();
  });

  describe('authMiddleware', () => {
    test('should authenticate valid token', () => {
      const mockPayload = {
        userId: 'user-123',
        email: 'test@example.com',
        role: 'USER'
      };

      (req.header as jest.Mock).mockReturnValue('Bearer valid-token');
      mockJwt.verify.mockReturnValue(mockPayload as any);

      authMiddleware(req as Request, res as Response, next);

      expect(mockJwt.verify).toHaveBeenCalledWith('valid-token', process.env.JWT_SECRET || 'fallback-secret');
      expect((req as AuthenticatedRequest).user).toEqual(mockPayload);
      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    test('should reject request without authorization header', () => {
      (req.header as jest.Mock).mockReturnValue(undefined);

      authMiddleware(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: 'No token provided' });
      expect(next).not.toHaveBeenCalled();
    });

    test('should reject request with empty Bearer token', () => {
      (req.header as jest.Mock).mockReturnValue('Bearer ');

      authMiddleware(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: 'No token provided' });
      expect(next).not.toHaveBeenCalled();
    });

    test('should reject request with invalid token', () => {
      (req.header as jest.Mock).mockReturnValue('Bearer invalid-token');
      mockJwt.verify.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      authMiddleware(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: 'Invalid token' });
      expect(next).not.toHaveBeenCalled();
    });

    test('should handle jwt.verify throwing JsonWebTokenError', () => {
      req.headers!.authorization = 'Bearer expired-token';
      const error = new Error('Token expired');
      error.name = 'JsonWebTokenError';
      mockJwt.verify.mockImplementation(() => {
        throw error;
      });

      authMiddleware(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ error: 'Invalid or expired token' });
    });

    test('should handle jwt.verify throwing TokenExpiredError', () => {
      req.headers!.authorization = 'Bearer expired-token';
      const error = new Error('Token expired');
      error.name = 'TokenExpiredError';
      mockJwt.verify.mockImplementation(() => {
        throw error;
      });

      authMiddleware(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ error: 'Invalid or expired token' });
    });

    test('should extract token from Bearer format correctly', () => {
      const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9';
      req.headers!.authorization = `Bearer ${token}`;
      mockJwt.verify.mockReturnValue({ userId: 'test' } as any);

      authMiddleware(req as Request, res as Response, next);

      expect(mockJwt.verify).toHaveBeenCalledWith(token, process.env.JWT_SECRET || 'fallback-secret');
    });

    test('should handle empty token after Bearer', () => {
      req.headers!.authorization = 'Bearer ';

      authMiddleware(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: 'Access token required' });
    });

    test('should use environment JWT_SECRET when available', () => {
      process.env.JWT_SECRET = 'test-secret-from-env';
      req.headers!.authorization = 'Bearer test-token';
      mockJwt.verify.mockReturnValue({ userId: 'test' } as any);

      authMiddleware(req as Request, res as Response, next);

      expect(mockJwt.verify).toHaveBeenCalledWith('test-token', 'test-secret-from-env');
      
      // Clean up
      delete process.env.JWT_SECRET;
    });

    test('should use fallback secret when JWT_SECRET not set', () => {
      delete process.env.JWT_SECRET;
      req.headers!.authorization = 'Bearer test-token';
      mockJwt.verify.mockReturnValue({ userId: 'test' } as any);

      authMiddleware(req as Request, res as Response, next);

      expect(mockJwt.verify).toHaveBeenCalledWith('test-token', 'fallback-secret');
    });
  });

  describe('Token Payload Handling', () => {
    test('should preserve all token payload fields', () => {
      const mockPayload = {
        userId: 'user-123',
        email: 'test@example.com',
        role: 'ADMIN',
        firstName: 'John',
        lastName: 'Doe',
        organization: 'Test Corp',
        iat: 1234567890,
        exp: 1234567900
      };

      req.headers!.authorization = 'Bearer valid-token';
      mockJwt.verify.mockReturnValue(mockPayload as any);

      authMiddleware(req as Request, res as Response, next);

      expect((req as AuthenticatedRequest).user).toEqual(mockPayload);
    });

    test('should handle minimal token payload', () => {
      const mockPayload = {
        userId: 'user-123'
      };

      req.headers!.authorization = 'Bearer valid-token';
      mockJwt.verify.mockReturnValue(mockPayload as any);

      authMiddleware(req as Request, res as Response, next);

      expect((req as AuthenticatedRequest).user).toEqual(mockPayload);
    });
  });

  describe('Security Considerations', () => {
    test('should not expose sensitive information in error messages', () => {
      req.headers!.authorization = 'Bearer malicious-token';
      mockJwt.verify.mockImplementation(() => {
        throw new Error('Sensitive internal error information');
      });

      authMiddleware(req as Request, res as Response, next);

      expect(res.json).toHaveBeenCalledWith({ error: 'Invalid or expired token' });
      // Should not expose the actual error message
      expect(res.json).not.toHaveBeenCalledWith(
        expect.objectContaining({
          error: expect.stringContaining('Sensitive internal error information')
        })
      );
    });

    test('should handle case-sensitive Bearer prefix', () => {
      req.headers!.authorization = 'bearer lowercase-bearer';

      authMiddleware(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: 'Access token required' });
    });

    test('should not accept authorization header with extra spaces', () => {
      req.headers!.authorization = 'Bearer  token-with-extra-spaces';
      mockJwt.verify.mockReturnValue({ userId: 'test' } as any);

      authMiddleware(req as Request, res as Response, next);

      // Should still work, but verify the token is trimmed correctly
      expect(mockJwt.verify).toHaveBeenCalledWith('token-with-extra-spaces', expect.any(String));
    });
  });

  describe('Error Edge Cases', () => {
    test('should handle non-Error objects thrown by jwt.verify', () => {
      req.headers!.authorization = 'Bearer weird-token';
      mockJwt.verify.mockImplementation(() => {
        throw 'String error'; // Non-Error object
      });

      authMiddleware(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ error: 'Invalid or expired token' });
    });

    test('should handle null/undefined authorization header gracefully', () => {
      req.headers!.authorization = null as any;

      authMiddleware(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(401);
    });

    test('should handle authorization header as non-string type', () => {
      req.headers!.authorization = 12345 as any; // Number instead of string

      authMiddleware(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(401);
    });
  });
});
