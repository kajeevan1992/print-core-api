import type { Request, Response } from 'express';
import { env } from '../../config/env';
import { productCreateSchema, productListQuerySchema, productUpdateSchema } from './products.schema';
import { createProduct, getProductById, listProducts, updateProduct } from './products.service';

function responseMeta(req: Request) {
  if (env.NODE_ENV !== 'development') {
    return undefined;
  }

  return {
    channelId: req.channel?.id ?? null,
    scoped: Boolean(req.channel)
  };
}

export async function getProducts(req: Request, res: Response): Promise<void> {
  const query = productListQuerySchema.parse(req.query);
  const result = await listProducts({ ...query, channelId: req.channel?.id });

  res.json({ success: true, data: result, meta: responseMeta(req) });
}

export async function getProduct(req: Request, res: Response): Promise<void> {
  const product = await getProductById(req.params.id, req.channel?.id);

  if (!product) {
    res.status(404).json({ success: false, error: { message: 'Product not found' } });
    return;
  }

  res.json({ success: true, data: product, meta: responseMeta(req) });
}

export async function postProduct(req: Request, res: Response): Promise<void> {
  const payload = productCreateSchema.parse(req.body);
  const product = await createProduct(payload, req.channel?.id);

  res.status(201).json({ success: true, data: product, meta: responseMeta(req) });
}

export async function patchProduct(req: Request, res: Response): Promise<void> {
  const payload = productUpdateSchema.parse(req.body);
  const product = await updateProduct(req.params.id, payload, req.channel?.id);

  if (!product) {
    res.status(404).json({ success: false, error: { message: 'Product not found' } });
    return;
  }

  res.json({ success: true, data: product, meta: responseMeta(req) });
}
