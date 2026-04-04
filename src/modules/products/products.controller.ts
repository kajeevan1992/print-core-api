import type { Request, Response } from 'express';
import { productCreateSchema, productListQuerySchema, productUpdateSchema } from './products.schema';
import { createProduct, deleteProduct, getProductById, listProducts, updateProduct } from './products.service';

function getSingleParam(value: string | string[] | undefined): string | null {
  return typeof value === 'string' ? value : null;
}

export async function getProducts(req: Request, res: Response): Promise<void> {
  const query = productListQuerySchema.parse(req.query);
  res.json({ success: true, data: await listProducts(query) });
}

export async function getProduct(req: Request, res: Response): Promise<void> {
  const id = getSingleParam(req.params.id);
  if (!id) return void res.status(400).json({ success: false, error: { message: 'Invalid product id' } });
  const product = await getProductById(id);
  if (!product) return void res.status(404).json({ success: false, error: { message: 'Product not found' } });
  res.json({ success: true, data: product });
}

export async function postProduct(req: Request, res: Response): Promise<void> {
  const payload = productCreateSchema.parse(req.body);
  res.status(201).json({ success: true, data: await createProduct(payload) });
}

export async function patchProduct(req: Request, res: Response): Promise<void> {
  const id = getSingleParam(req.params.id);
  if (!id) return void res.status(400).json({ success: false, error: { message: 'Invalid product id' } });
  const payload = productUpdateSchema.parse(req.body);
  const product = await updateProduct(id, payload);
  if (!product) return void res.status(404).json({ success: false, error: { message: 'Product not found' } });
  res.json({ success: true, data: product });
}

export async function removeProduct(req: Request, res: Response): Promise<void> {
  const id = getSingleParam(req.params.id);
  if (!id) return void res.status(400).json({ success: false, error: { message: 'Invalid product id' } });
  res.json({ success: true, data: await deleteProduct(id) });
}
