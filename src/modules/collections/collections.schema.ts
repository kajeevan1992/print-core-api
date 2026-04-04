import { z } from 'zod';
export const collectionSchema = z.object({ title: z.string().min(1), productIds: z.array(z.string()).default([]), categoryIds: z.array(z.string()).default([]) });
export const collectionUpdateSchema = collectionSchema.partial();
export const collectionListQuerySchema = z.object({ page: z.coerce.number().int().min(1).default(1), limit: z.coerce.number().int().min(1).max(100).default(200), search: z.string().optional() });
