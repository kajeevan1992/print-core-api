import type { NextFunction, Request, Response } from 'express';
import { Prisma } from '@prisma/client';
import { ZodError } from 'zod';

export function notFoundHandler(_req: Request, res: Response): void {
  res.status(404).json({
    success: false,
    error: {
      message: 'Resource not found'
    }
  });
}

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction): void {
  if (err instanceof ZodError) {
    res.status(400).json({
      success: false,
      error: {
        message: 'Validation failed',
        issues: err.flatten().fieldErrors
      }
    });
    return;
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    res.status(400).json({
      success: false,
      error: {
        message: 'Database request failed',
        code: err.code,
        meta: err.meta
      }
    });
    return;
  }

  if (err instanceof Error) {
    res.status(500).json({
      success: false,
      error: {
        message: err.message
      }
    });
    return;
  }

  res.status(500).json({
    success: false,
    error: {
      message: 'Unexpected server error'
    }
  });
}
