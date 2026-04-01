import { z } from 'zod';

export const productCreateSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().optional(),
  productType: z.string().min(1),
  categoryId: z.string().min(1),
  vendorId: z.string().min(1),
  isGlobal: z.boolean().optional().default(false),
  published: z.boolean().optional().default(false),
  channelIds: z.array(z.string().min(1)).optional().default([])
});

export const productUpdateSchema = productCreateSchema.partial();

export const productListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().optional(),
  status: z.enum(['published', 'draft']).optional()
});
