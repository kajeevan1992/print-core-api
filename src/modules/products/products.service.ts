import { Prisma } from '@prisma/client';
import { z } from 'zod';
import { prisma } from '../../lib/prisma';
import { productCreateSchema, productUpdateSchema } from './products.schema';

type ProductCreateInput = z.infer<typeof productCreateSchema>;
type ProductUpdateInput = z.infer<typeof productUpdateSchema>;

const slugify = (value: string) => value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

const includeProduct = {
  channels: true,
  productTags: { include: { tag: true } }
} as const;

const mapProduct = (product: any) => ({
  ...product,
  tagIds: product.productTags?.map((item: any) => item.tagId) ?? [],
  tags: product.productTags?.map((item: any) => ({ id: item.tag.id, label: item.tag.name, color: 'blue' })) ?? []
});

export async function listProducts(params: { page: number; limit: number; search?: string; categoryId?: string; status?: 'published' | 'draft' }) {
  const { page, limit, search, categoryId, status } = params;
  const skip = (page - 1) * limit;
  const where: Prisma.ProductWhereInput = {
    ...(search ? { OR: [{ name: { contains: search, mode: 'insensitive' } }, { slug: { contains: search, mode: 'insensitive' } }] } : {}),
    ...(categoryId ? { categoryId } : {}),
    ...(status ? { published: status === 'published' } : {})
  };
  const [items, total] = await prisma.$transaction([
    prisma.product.findMany({ where, skip, take: limit, include: includeProduct, orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }] }),
    prisma.product.count({ where })
  ]);
  return { items: items.map(mapProduct), pagination: { page, limit, total, totalPages: Math.max(1, Math.ceil(total / limit)) } };
}

export async function getProductById(id: string) {
  const product = await prisma.product.findUnique({ where: { id }, include: includeProduct });
  return product ? mapProduct(product) : null;
}

export async function createProduct(input: ProductCreateInput) {
  const { channelIds, tagIds, ...data } = input;
  const created = await prisma.product.create({
    data: {
      ...data,
      slug: data.slug || slugify(data.name),
      categoryId: data.categoryId || null,
      lastSavedAt: data.lastSavedAt ? new Date(data.lastSavedAt) : new Date(),
      channels: { create: channelIds.map((channelId) => ({ channel: { connect: { id: channelId } } })) },
      productTags: { create: tagIds.map((tagId) => ({ tag: { connect: { id: tagId } } })) }
    },
    include: includeProduct
  });
  return mapProduct(created);
}

export async function updateProduct(id: string, input: ProductUpdateInput) {
  const existing = await prisma.product.findUnique({ where: { id } });
  if (!existing) return null;
  const { channelIds, tagIds, ...data } = input;
  const updated = await prisma.product.update({
    where: { id },
    data: {
      ...data,
      ...(data.lastSavedAt ? { lastSavedAt: new Date(data.lastSavedAt) } : {}),
      ...(channelIds ? { channels: { deleteMany: {}, create: channelIds.map((channelId) => ({ channel: { connect: { id: channelId } } })) } } : {}),
      ...(tagIds ? { productTags: { deleteMany: {}, create: tagIds.map((tagId) => ({ tag: { connect: { id: tagId } } })) } } : {})
    },
    include: includeProduct
  });
  return mapProduct(updated);
}

export async function deleteProduct(id: string) {
  await prisma.product.delete({ where: { id } });
  return { success: true };
}
