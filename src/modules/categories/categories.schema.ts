import { z } from 'zod';

export const categoryListQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(50),
  search: z.string().trim().optional()
});

const categoryBaseSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional().default(''),
  parentId: z.string().nullable().optional(),
  pricingId: z.string().optional().default(''),
  attributeSetId: z.string().optional().default(''),
  published: z.boolean().default(true),
  friendlyUrl: z.string().optional().default(''),
  sortOrder: z.number().int().optional().default(0),
  accuZipConfig: z.string().optional().default(''),
  useAlternateMaster: z.boolean().optional().default(false),
  canBrowse: z.boolean().optional().default(true),
  canUpload: z.boolean().optional().default(false),
  canUploadLater: z.boolean().optional().default(false),
  canCreate: z.boolean().optional().default(true),
  canCustom: z.boolean().optional().default(true),
  tags: z.array(z.string()).optional().default([])
});

export const categorySchema = categoryBaseSchema.transform((v) => ({
  ...v,
  useAlternateMaster: Boolean(v.useAlternateMaster),
}));

export const categoryUpdateSchema = categoryBaseSchema.partial();

export const categoryTagsSchema = z.object({
  tags: z.array(
    z.object({
      id: z.string().optional(),
      label: z.string().min(1),
    })
  ),
});
