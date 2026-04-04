import { z } from 'zod';

export const productCreateSchema = z.object({
  name: z.string().min(1),
  slug: z.string().optional(),
  description: z.string().optional(),
  creationMethod: z.string().optional(),
  productType: z.string().min(1),
  categoryId: z.string().optional().nullable(),
  vendorId: z.string().optional().default(''),
  hotFolder: z.string().optional(),
  pdfFileUrl: z.string().optional(),
  cmsPageLink: z.string().optional(),
  previewUrl: z.string().optional(),
  thumbnail: z.string().optional(),
  sortOrder: z.number().int().optional(),
  pages: z.number().int().optional(),
  units: z.string().optional(),
  width: z.number().optional(),
  height: z.number().optional(),
  bleed: z.number().optional(),
  isGlobal: z.boolean().optional().default(false),
  published: z.boolean().optional().default(false),
  storefrontIds: z.array(z.string()).optional().default([]),
  lastSavedAt: z.string().optional(),
  productNumbers: z.any().optional(),
  templateDefaults: z.any().optional(),
  templateSetup: z.any().optional(),
  templateAssets: z.any().optional(),
  priceMapping: z.any().optional(),
  comments: z.array(z.any()).optional().default([]),
  internalNotes: z.string().optional().default(''),
  inventory: z.any().optional(),
  relatedProducts: z.array(z.any()).optional().default([]),
  attributes: z.array(z.any()).optional().default([]),
  alternateViews: z.array(z.any()).optional().default([]),
  channelIds: z.array(z.string()).optional().default([]),
  tagIds: z.array(z.string()).optional().default([])
});

export const productUpdateSchema = productCreateSchema.partial();

export const productListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().optional(),
  categoryId: z.string().optional(),
  status: z.enum(['published', 'draft']).optional()
});
