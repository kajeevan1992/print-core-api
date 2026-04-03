import type { NextFunction, Request, Response } from 'express';
import { prisma } from '../lib/prisma';

export async function channelResolver(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const publicKey = req.header('x-public-key');

    if (!publicKey) {
      req.channel = null;
      next();
      return;
    }

    const channel = await prisma.channel.findUnique({
      where: { publicApiKey: publicKey }
    });

    if (!channel) {
      res.status(401).json({
        success: false,
        error: {
          message: 'Invalid public API key'
        }
      });
      return;
    }

    req.channel = channel;
    next();
  } catch (error) {
    next(error);
  }
}
