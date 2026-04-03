import { Channel } from '@prisma/client';

declare global {
  namespace Express {
    interface Request {
      channel?: Channel | null;
    }
  }
}

export {};
