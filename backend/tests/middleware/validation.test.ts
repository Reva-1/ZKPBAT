import { Request, Response, NextFunction } from 'express';
import { validateRequest } from '../../src/middleware/validation';
import Joi from 'joi';

describe('Validation Middleware', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = {
      body: {}
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  describe('Body Validation', () => {
    test('should validate request body successfully', () => {
      const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required()
      });

      req.body = {
        email: 'test@example.com',
        password: 'password123'
      };

      const middleware = validateRequest(schema);
      middleware(req as Request, res as Response, next);

      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    test('should reject invalid request body', () => {
      const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required()
      });

      req.body = {
        email: 'invalid-email',
        password: '123'
      };

      const middleware = validateRequest(schema);
      middleware(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Validation failed',
        details: expect.any(Array)
      });
      expect(next).not.toHaveBeenCalled();
    });

    test('should reject missing required fields', () => {
      const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required()
      });

      req.body = {
        email: 'test@example.com'
        // password is missing
      };

      const middleware = validateRequest(schema);
      middleware(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Validation failed',
        details: expect.arrayContaining([
          expect.objectContaining({
            field: 'password',
            message: expect.stringContaining('required')
          })
        ])
      });
    });

    test('should handle empty body', () => {
      const schema = Joi.object({
        title: Joi.string().required()
      });

      req.body = {};

      const middleware = validateRequest(schema);
      middleware(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Validation failed',
        details: expect.arrayContaining([
          expect.objectContaining({
            field: 'title',
            message: expect.stringContaining('required')
          })
        ])
      });
    });

    test('should allow additional properties when not strict', () => {
      const schema = Joi.object({
        name: Joi.string().required()
      });

      req.body = {
        name: 'Test Name',
        extraField: 'extra value'
      };

      const middleware = validateRequest(schema);
      middleware(req as Request, res as Response, next);

      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    test('should handle complex nested objects', () => {
      const schema = Joi.object({
        user: Joi.object({
          name: Joi.string().required(),
          email: Joi.string().email().required(),
          address: Joi.object({
            street: Joi.string().required(),
            city: Joi.string().required(),
            zipCode: Joi.string().pattern(/^\d{5}$/).required()
          }).required()
        }).required()
      });

      req.body = {
        user: {
          name: 'John Doe',
          email: 'john@example.com',
          address: {
            street: '123 Main St',
            city: 'Anytown',
            zipCode: '12345'
          }
        }
      };

      const middleware = validateRequest(schema);
      middleware(req as Request, res as Response, next);

      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    test('should provide detailed error paths for nested validation', () => {
      const schema = Joi.object({
        user: Joi.object({
          email: Joi.string().email().required(),
          profile: Joi.object({
            age: Joi.number().integer().min(0).required()
          }).required()
        }).required()
      });

      req.body = {
        user: {
          email: 'invalid-email',
          profile: {
            age: -5
          }
        }
      };

      const middleware = validateRequest(schema);
      middleware(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Validation failed',
        details: expect.arrayContaining([
          expect.objectContaining({
            field: 'user.email',
            message: expect.stringContaining('valid email')
          }),
          expect.objectContaining({
            field: 'user.profile.age',
            message: expect.stringContaining('greater than or equal to 0')
          })
        ])
      });
    });

    test('should handle arrays validation', () => {
      const schema = Joi.object({
        tags: Joi.array().items(Joi.string()).min(1).required(),
        numbers: Joi.array().items(Joi.number().integer()).optional()
      });

      req.body = {
        tags: ['tag1', 'tag2', 'tag3'],
        numbers: [1, 2, 3]
      };

      const middleware = validateRequest(schema);
      middleware(req as Request, res as Response, next);

      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });
  });
});
