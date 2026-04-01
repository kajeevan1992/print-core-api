import { Prisma } from '@prisma/client';
import { z } from 'zod';
import { prisma } from '../../lib/prisma';
import { productCreateSchema, productUpdateSchema } from './products.schema';

type ProductCreateInput = z.infer<typeof productCreateSchema>;
type ProductUpdateInput = z.infer<typeof productUpdateSchema>;

export async function listProducts(params: { page: number; limit: number; search?: string; status?: 'published' | 'draft' }) {
  const { page, limit, search, status } = params;
  const skip = (page - 1) * limit;

  const where: Prisma.ProductWhereInput = {
    ...(search
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { slug: { contains: search, mode: 'insensitive' } }
          ]
        }
      : {}),
    ...(status ? { published: status === 'published' } : {})
  };

  const [items, total] = await prisma.$transaction([
    prisma.product.findMany({
      where,
      skip,
      take: limit,
      include: { channels: true },
      orderBy: { createdAt: 'desc' }
    }),
    prisma.product.count({ where })
  ]);

  return {
    items,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  };
}

export async function getProductById(id: string) {
  return prisma.product.findUnique({
    where: { id },
    include: { channels: true }
  });
}

export async function createProduct(input: ProductCreateInput) {
  const { channelIds, ...data } = input;
  return prisma.product.create({
    data: {
      ...data,
      channels: {
        create: channelIds.map((channelId) => ({
          channel: { connect: { id: channelId } }
        }))
      }
    },
    include: { channels: true }
  });
}

export async function updateProduct(id: string, input: ProductUpdateInput) {
  const existingProduct = await prisma.product.findUnique({ where: { id } });

  if (!existingProduct) {
    return null;
  }

  const { channelIds, ...data } = input;

  return prisma.product.update({
    where: { id },
    data: {
      ...data,
      ...(channelIds
        ? {
            channels: {
              deleteMany: {},
              create: channelIds.map((channelId) => ({
                channel: { connect: { id: channelId } }
              }))
            }
          }
        : {})
    },
    include: { channels: true }
  });
}
