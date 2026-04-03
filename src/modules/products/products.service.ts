import { Prisma } from '@prisma/client';
import { z } from 'zod';
import { prisma } from '../../lib/prisma';
import { productCreateSchema, productUpdateSchema } from './products.schema';

type ProductCreateInput = z.infer<typeof productCreateSchema>;
type ProductUpdateInput = z.infer<typeof productUpdateSchema>;

export async function listProducts(params: {
  page: number;
  limit: number;
  search?: string;
  status?: 'published' | 'draft';
  channelId?: string;
}) {
  const { page, limit, search, status, channelId } = params;
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
    ...(status ? { published: status === 'published' } : {}),
    ...(channelId
      ? {
          channels: {
            some: {
              channelId
            }
          }
        }
      : {})
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

export async function getProductById(id: string, channelId?: string) {
  return prisma.product.findFirst({
    where: {
      id,
      ...(channelId
        ? {
            channels: {
              some: {
                channelId
              }
            }
          }
        : {})
    },
    include: { channels: true }
  });
}

export async function createProduct(input: ProductCreateInput, channelId?: string) {
  const { channelIds, ...data } = input;

  const linkedChannelIds = channelId
    ? Array.from(new Set([channelId, ...(channelIds ?? [])]))
    : (channelIds ?? []);

  return prisma.product.create({
    data: {
      ...data,
      channels: {
        create: linkedChannelIds.map((linkedChannelId) => ({
          channel: { connect: { id: linkedChannelId } }
        }))
      }
    },
    include: { channels: true }
  });
}

export async function updateProduct(id: string, input: ProductUpdateInput, channelId?: string) {
  const existingProduct = await prisma.product.findFirst({
    where: {
      id,
      ...(channelId
        ? {
            channels: {
              some: {
                channelId
              }
            }
          }
        : {})
    }
  });

  if (!existingProduct) {
    return null;
  }

  const { channelIds, ...data } = input;

  const linkedChannelIds = channelId
    ? Array.from(new Set([channelId, ...(channelIds ?? [])]))
    : channelIds;

  return prisma.product.update({
    where: { id },
    data: {
      ...data,
      ...(linkedChannelIds
        ? {
            channels: {
              deleteMany: {},
              create: linkedChannelIds.map((linkedChannelId) => ({
                channel: { connect: { id: linkedChannelId } }
              }))
            }
          }
        : {})
    },
    include: { channels: true }
  });
}
