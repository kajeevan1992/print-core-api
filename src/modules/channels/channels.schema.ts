import { z } from 'zod';

export const channelCreateSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  domain: z.string().url().optional(),
  status: z.string().min(1),
  themeId: z.string().optional(),
  currency: z.string().min(1),
  locale: z.string().min(1),
  isHeadless: z.boolean().optional().default(false)
});

export const channelUpdateSchema = channelCreateSchema.partial();

export const channelListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().optional(),
  status: z.string().optional()
});
