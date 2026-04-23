import { Router } from 'express';
import { prisma } from '../../lib/prisma';

const router = Router();

router.get('/', async (_req, res) => {
  try {
    const rows = await prisma.optionSet.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return res.json({
      success: true,
      data: rows,
    });
  } catch (error) {
    console.error('OPTION_SETS_LIST_FAILED', error);
    return res.status(500).json({
      success: false,
      error: { message: error instanceof Error ? error.message : 'Could not load option sets' },
    });
  }
});

export default router;
