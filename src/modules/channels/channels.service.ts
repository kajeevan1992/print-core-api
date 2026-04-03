import { randomBytes } from 'crypto';
import { Prisma } from '@prisma/client';
import { z } from 'zod';
import { prisma } from '../../lib/prisma';
import { channelCreateSchema, channelUpdateSchema } from './channels.schema';

type ChannelCreateInput = z.infer<typeof channelCreateSchema>;
type ChannelUpdateInput = z.infer<typeof channelUpdateSchema>;

function generateApiKey(prefix: string): string {
  return `${prefix}_${randomBytes(24).toString('hex')}`;
}

export async function listChannels(params: {
  page: number;
  limit: number;
  search?: string;
  status?: string;
  scopedChannelId?: string;
}) {
  const { page, limit, search, status, scopedChannelId } = params;
  const skip = (page - 1) * limit;

  const where: Prisma.ChannelWhereInput = {
    ...(search
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { slug: { contains: search, mode: 'insensitive' } },
            { domain: { contains: search, mode: 'insensitive' } }
          ]
        }
      : {}),
    ...(status ? { status } : {}),
    ...(scopedChannelId ? { id: scopedChannelId } : {})
  };

  const [items, total] = await prisma.$transaction([
    prisma.channel.findMany({
      where,
      skip,
      take: limit,
      include: { theme: true },
      orderBy: { createdAt: 'desc' }
    }),
    prisma.channel.count({ where })
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

export async function getChannelById(id: string, scopedChannelId?: string) {
  if (scopedChannelId && scopedChannelId !== id) {
    return null;
  }

  return prisma.channel.findUnique({
    where: { id },
    include: { theme: true }
  });
}

export async function createChannel(input: ChannelCreateInput) {
  return prisma.channel.create({
    data: {
      ...input,
      publicApiKey: generateApiKey('pk'),
      privateApiKey: generateApiKey('sk')
    },
    include: { theme: true }
  });
}

export async function updateChannel(id: string, input: ChannelUpdateInput, scopedChannelId?: string) {
  if (scopedChannelId && scopedChannelId !== id) {
    return null;
  }

  const existingChannel = await prisma.channel.findUnique({
    where: { id }
  });

  if (!existingChannel) {
    return null;
  }

  return prisma.channel.update({
    where: { id },
    data: input,
    include: { theme: true }
  });
}
