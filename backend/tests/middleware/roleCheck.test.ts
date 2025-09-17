import { Request, Response, NextFunction } from 'express';
import { roleCheck } from '../../src/middleware/roleCheck';

interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    role: string;
    email: string;
  };
}

describe('Role Check Middleware', () => {
  let req: Partial<AuthenticatedRequest>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = {
      user: {
        userId: 'user-123',
        role: 'USER',
        email: 'test@example.com'
      }
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  test('should allow admin access to admin-only routes', () => {
    req.user!.role = 'ADMIN';
    const middleware = roleCheck(['ADMIN']);

    middleware(req as Request, res as Response, next);

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  test('should allow policy manager access to policy routes', () => {
    req.user!.role = 'POLICY_MANAGER';
    const middleware = roleCheck(['POLICY_MANAGER', 'ADMIN']);

    middleware(req as Request, res as Response, next);

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  test('should deny user access to admin-only routes', () => {
    req.user!.role = 'USER';
    const middleware = roleCheck(['ADMIN']);

    middleware(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Insufficient permissions'
    });
    expect(next).not.toHaveBeenCalled();
  });

  test('should handle missing user in request', () => {
    req.user = undefined;
    const middleware = roleCheck(['USER']);

    middleware(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Authentication required'
    });
    expect(next).not.toHaveBeenCalled();
  });

  test('should allow multiple valid roles', () => {
    req.user!.role = 'AUDITOR';
    const middleware = roleCheck(['ADMIN', 'POLICY_MANAGER', 'AUDITOR']);

    middleware(req as Request, res as Response, next);

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  test('should handle empty allowed roles array', () => {
    const middleware = roleCheck([]);

    middleware(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Insufficient permissions'
    });
    expect(next).not.toHaveBeenCalled();
  });
});
