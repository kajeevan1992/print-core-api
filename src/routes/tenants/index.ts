import { Router } from 'express';
import { prisma } from '../../lib/prisma';

const router = Router();

router.get('/', async (_req, res) => {
  try {
    const tenants = await prisma.tenant.findMany({
      orderBy: { createdAt: 'desc' },
      include: { domains: true },
    });

    return res.json({
      success: true,
      data: tenants,
    });
  } catch (error) {
    console.error('TENANTS_LIST_FAILED', error);
    return res.status(500).json({
      success: false,
      error: { message: error instanceof Error ? error.message : 'Could not load tenants' },
    });
  }
});

router.patch('/:id/plan', async (req, res) => {
  try {
    const tenantId = req.params.id;
    const { planName } = req.body ?? {};

    if (!tenantId || !planName) {
      return res.status(400).json({
        success: false,
        error: { message: 'tenant id and planName are required' },
      });
    }

    const updated = await prisma.tenant.update({
      where: { id: tenantId },
      data: { planName },
    });

    return res.json({
      success: true,
      data: updated,
    });
  } catch (error) {
    console.error('TENANT_PLAN_UPDATE_FAILED', error);
    return res.status(500).json({
      success: false,
      error: { message: error instanceof Error ? error.message : 'Could not update tenant plan' },
    });
  }
});

router.patch('/:id/status', async (req, res) => {
  try {
    const tenantId = req.params.id;
    const { status } = req.body ?? {};

    if (!tenantId || !status) {
      return res.status(400).json({
        success: false,
        error: { message: 'tenant id and status are required' },
      });
    }

    const updated = await prisma.tenant.update({
      where: { id: tenantId },
      data: { status },
    });

    return res.json({
      success: true,
      data: updated,
    });
  } catch (error) {
    console.error('TENANT_STATUS_UPDATE_FAILED', error);
    return res.status(500).json({
      success: false,
      error: { message: error instanceof Error ? error.message : 'Could not update tenant status' },
    });
  }
});

export default router;
