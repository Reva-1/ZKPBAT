import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

export interface CustomError extends Error {
  statusCode?: number;
  code?: string;
}

export const errorHandler = (
  error: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = error.statusCode || 500;
  let message = error.message || 'Internal Server Error';

  // Prisma errors
  if (error.code === 'P2002') {
    statusCode = 409;
    message = 'Resource already exists';
  }

  if (error.code === 'P2025') {
    statusCode = 404;
    message = 'Resource not found';
  }

  // JWT errors
  if (error.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
  }

  if (error.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired';
  }

  // Validation errors
  if (error.name === 'ValidationError') {
    statusCode = 400;
    message = error.message;
  }

  logger.error({
    error: {
      name: error.name,
      message: error.message,
      stack: error.stack,
      code: error.code
    },
    request: {
      method: req.method,
      url: req.url,
      headers: req.headers,
      body: req.body
    }
  });

  res.status(statusCode).json({
    error: {
      message,
      ...(process.env.NODE_ENV === 'development' && {
        stack: error.stack,
        code: error.code
      })
    }
  });
};
