import { z } from 'zod';

export const themeCreateSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  version: z.string().min(1),
  author: z.string().min(1)
});

export const assignThemeSchema = z.object({
  themeId: z.string().min(1),
  channelId: z.string().min(1)
});

export const themeListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().optional()
});
