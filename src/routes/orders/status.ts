import { Router } from 'express';
import { prisma } from '../../lib/prisma';

const router = Router();

router.get('/', async (_req, res) => {
  try {
    const orders = await prisma.order.findMany({
      orderBy: { submittedAt: 'desc' },
      include: { items: true, artworks: true, tenant: true },
    });
    return res.json({ success: true, data: orders });
  } catch (error) {
    console.error('ORDERS_LIST_FAILED', error);
    return res.json({ success: true, data: [] });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const orderId = req.params.id;
    const order = await prisma.order.findFirst({
      where: { OR: [{ id: orderId }, { orderNumber: orderId }] },
      include: { items: true, artworks: true, tenant: true },
    });

    if (!order) {
      return res.status(404).json({ success: false, error: { message: 'Order not found' } });
    }

    return res.json({ success: true, data: order });
  } catch (error) {
    console.error('ORDER_DETAIL_FAILED', error);
    return res.status(500).json({
      success: false,
      error: { message: error instanceof Error ? error.message : 'Could not load order detail' },
    });
  }
});

router.post('/', async (req, res) => {
  try {
    const body = req.body ?? {};
    const customer = body.customer ?? {};
    const items = Array.isArray(body.items) ? body.items : [];
    const totalMinor = typeof body.totalMinor === 'number' ? body.totalMinor : 0;
    const submittedAt = new Date();

    const order = await prisma.order.create({
      data: {
        orderNumber: `ORD-${Date.now()}`,
        customerName: [customer.firstName, customer.lastName].filter(Boolean).join(' ').trim() || 'Customer',
        email: customer.email || null,
        status: 'artwork-review',
        totalMinor,
        currency: 'GBP',
        submittedAt,
        items: {
          create: items.map((item: any) => ({
            productName: item.name || 'Order item',
            quantity: item.quantity || item.qty || 1,
            unitPriceMinor: item.unitPriceMinor || 0,
            lineTotalMinor: item.lineTotalMinor || 0,
            variantLabel: item.variantLabel || null,
          })),
        },
      },
      include: { items: true },
    });

    return res.status(201).json({ success: true, data: order });
  } catch (error) {
    console.error('ORDER_CREATE_FAILED', error);
    return res.status(500).json({
      success: false,
      error: { message: error instanceof Error ? error.message : 'Could not create order' },
    });
  }
});

router.patch('/:id/status', async (req, res) => {
  try {
    const orderId = req.params.id;
    const { status } = req.body ?? {};

    if (!orderId || !status) {
      return res.status(400).json({
        success: false,
        error: { message: 'order id and status are required' },
      });
    }

    const order = await prisma.order.findFirst({
      where: { OR: [{ id: orderId }, { orderNumber: orderId }] },
    });

    if (!order) {
      return res.status(404).json({ success: false, error: { message: 'Order not found' } });
    }

    const updated = await prisma.order.update({
      where: { id: order.id },
      data: { status },
    });

    return res.json({ success: true, data: updated });
  } catch (error) {
    console.error('ORDER_STATUS_UPDATE_FAILED', error);
    return res.status(500).json({
      success: false,
      error: { message: error instanceof Error ? error.message : 'Order status update failed' },
    });
  }
});

export default router;
