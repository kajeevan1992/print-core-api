import { Router } from 'express';
import { prisma } from '../../lib/prisma';
import { seedDemoCatalog } from '../../bootstrap/seed-demo';

const router = Router();

router.get('/ping', (_req, res) => {
  res.json({ success: true, data: { status: 'ok' } });
});

router.post('/seed', async (_req, res) => {
  try {
    const result = await seedDemoCatalog(prisma);
    res.json({ success: true, data: { seeded: true, ...result } });
  } catch (error) {
    console.error('DEV_SEED_ROUTE_FAILED', error);
    res.status(500).json({
      success: false,
      error: {
        message: error instanceof Error ? error.message : 'Seed failed',
        stack: process.env.NODE_ENV === 'production' ? undefined : error instanceof Error ? error.stack : undefined,
      },
    });
  }
});

export default router;
