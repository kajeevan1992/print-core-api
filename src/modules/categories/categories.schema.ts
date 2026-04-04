import { z } from 'zod';

export const categorySchema = z.object({
  name: z.string().min(1),
  description: z.string().optional().default(''),
  parentId: z.string().optional().nullable(),
  pricingId: z.string().optional().default(''),
  attributeSetId: z.string().optional().default(''),
  published: z.boolean().optional().default(true),
  thumbnail: z.string().optional().default(''),
  friendlyUrl: z.string().optional().default(''),
  sortOrder: z.number().int().optional(),
  accuZipConfig: z.string().optional().default(''),
  useAlternateMaster: z.boolean().optional().default(false),
  tagIds: z.array(z.string()).optional().default([]),
  canBrowse: z.boolean().optional().default(true),
  canUpload: z.boolean().optional().default(false),
  canUploadLater: z.boolean().optional().default(false),
  canCreate: z.boolean().optional().default(true),
  canCustom: z.boolean().optional().default(true)
});
export const categoryUpdateSchema = categorySchema.partial();
export const categoryListQuerySchema = z.object({ page: z.coerce.number().int().min(1).default(1), limit: z.coerce.number().int().min(1).max(100).default(200), search: z.string().optional() });
export const categoryTagsSchema = z.object({ labels: z.array(z.string()) });
