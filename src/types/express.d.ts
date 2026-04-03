import type { Channel } from '@prisma/client';
import type { ZodError } from 'zod';

declare global {
  namespace Express {
    interface Request {
      validationError?: ZodError;
      channel?: Channel | null;
    }
  }
}

export {};
