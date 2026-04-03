import type { Request, Response } from 'express';
import { productCreateSchema, productListQuerySchema, productUpdateSchema } from './products.schema';
import { createProduct, getProductById, listProducts, updateProduct } from './products.service';

function getSingleParam(value: string | string[] | undefined): string | null {
  if (typeof value === 'string') return value;
  return null;
}

export async function getProducts(req: Request, res: Response): Promise<void> {
  const query = productListQuerySchema.parse(req.query);
  const result = await listProducts(query);

  res.json({ success: true, data: result });
}

export async function getProduct(req: Request, res: Response): Promise<void> {
  const id = getSingleParam(req.params.id);

  if (!id) {
    res.status(400).json({ success: false, error: { message: 'Invalid product id' } });
    return;
  }

  const product = await getProductById(id);

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
  const id = getSingleParam(req.params.id);

  if (!id) {
    res.status(400).json({ success: false, error: { message: 'Invalid product id' } });
    return;
  }

  const payload = productUpdateSchema.parse(req.body);
  const product = await updateProduct(id, payload);

  if (!product) {
    res.status(404).json({ success: false, error: { message: 'Product not found' } });
    return;
  }

  res.json({ success: true, data: product });
}
