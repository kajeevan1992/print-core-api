import type { ZodError } from 'zod';

declare global {
  namespace Express {
    interface Request {
      validationError?: ZodError;
    }
  }
}

export {};
