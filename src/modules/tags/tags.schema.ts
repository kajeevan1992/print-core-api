import { z } from 'zod';
export const tagSchema = z.object({ name: z.string().min(1), parentId: z.string().optional().nullable(), friendlyUrl: z.string().optional(), published: z.boolean().optional().default(false), sidebar: z.boolean().optional().default(false) });
export const tagUpdateSchema = tagSchema.partial();
export const tagListQuerySchema = z.object({ page: z.coerce.number().int().min(1).default(1), limit: z.coerce.number().int().min(1).max(100).default(200), search: z.string().optional() });
