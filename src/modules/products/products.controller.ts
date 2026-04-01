import type { Request, Response } from 'express';
import { productCreateSchema, productListQuerySchema, productUpdateSchema } from './products.schema';
import { createProduct, getProductById, listProducts, updateProduct } from './products.service';

export async function getProducts(req: Request, res: Response): Promise<void> {
  const query = productListQuerySchema.parse(req.query);
  const result = await listProducts(query);

  res.json({ success: true, data: result });
}

export async function getProduct(req: Request, res: Response): Promise<void> {
  const product = await getProductById(req.params.id);

  if (!product) {
    res.status(404).json({ success: false, error: { message: 'Product not found' } });
    return;
  }

  res.json({ success: true, data: product });
}

export async function postProduct(req: Request, res: Response): Promise<void> {
  const payload = productCreateSchema.parse(req.body);
  const product = await createProduct(payload);

  res.status(201).json({ success: true, data: product });
}

export async function patchProduct(req: Request, res: Response): Promise<void> {
  const payload = productUpdateSchema.parse(req.body);
  const product = await updateProduct(req.params.id, payload);

  if (!product) {
    res.status(404).json({ success: false, error: { message: 'Product not found' } });
    return;
  }

  res.json({ success: true, data: product });
}
