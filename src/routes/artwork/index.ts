import { Router } from 'express';
import { prisma } from '../../lib/prisma';

const router = Router();

router.get('/', async (_req, res) => {
  try {
    const artworks = await prisma.artwork.findMany({
      orderBy: { createdAt: 'desc' },
      include: { order: true },
    });
    return res.json({ success: true, data: artworks });
  } catch (error) {
    console.error('ARTWORK_LIST_FAILED', error);
    return res.json({ success: true, data: [] });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const artwork = await prisma.artwork.findUnique({
      where: { id: req.params.id },
      include: { order: true },
    });

    if (!artwork) {
      return res.status(404).json({ success: false, error: { message: 'Artwork not found' } });
    }

    return res.json({ success: true, data: artwork });
  } catch (error) {
    console.error('ARTWORK_DETAIL_FAILED', error);
    return res.status(500).json({
      success: false,
      error: { message: error instanceof Error ? error.message : 'Could not load artwork detail' },
    });
  }
});

router.post('/', async (req, res) => {
  try {
    const body = req.body ?? {};
    const orderReference = body.orderReference || null;
    const linkedOrder = orderReference
      ? await prisma.order.findFirst({ where: { OR: [{ id: orderReference }, { orderNumber: orderReference }] } })
      : null;

    const artwork = await prisma.artwork.create({
      data: {
        orderId: linkedOrder?.id || null,
        orderReference: orderReference || linkedOrder?.orderNumber || null,
        customerEmail: body.customerEmail || null,
        fileName: body.fileName || 'artwork-file',
        fileType: body.fileType || 'Unknown',
        note: body.note || null,
        status: body.status || 'pending-review',
        source: body.source || 'api',
      },
      include: { order: true },
    });

    return res.status(201).json({ success: true, data: artwork });
  } catch (error) {
    console.error('ARTWORK_CREATE_FAILED', error);
    return res.status(500).json({
      success: false,
      error: { message: error instanceof Error ? error.message : 'Could not create artwork record' },
    });
  }
});

router.patch('/:id/status', async (req, res) => {
  try {
    const artworkId = req.params.id;
    const { status } = req.body ?? {};

    if (!artworkId || !status) {
      return res.status(400).json({
        success: false,
        error: { message: 'artwork id and status are required' },
      });
    }

    const updated = await prisma.artwork.update({
      where: { id: artworkId },
      data: { status },
      include: { order: true },
    });

    return res.json({ success: true, data: updated });
  } catch (error) {
    console.error('ARTWORK_STATUS_UPDATE_FAILED', error);
    return res.status(500).json({
      success: false,
      error: { message: error instanceof Error ? error.message : 'Could not update artwork status' },
    });
  }
});

export default router;
