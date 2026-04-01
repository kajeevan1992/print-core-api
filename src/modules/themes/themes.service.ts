import { Prisma } from '@prisma/client';
import { z } from 'zod';
import { prisma } from '../../lib/prisma';
import { themeCreateSchema } from './themes.schema';

type ThemeCreateInput = z.infer<typeof themeCreateSchema>;

export async function listThemes(params: { page: number; limit: number; search?: string }) {
  const { page, limit, search } = params;
  const skip = (page - 1) * limit;

  const where: Prisma.ThemeWhereInput = search
    ? {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { author: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } }
        ]
      }
    : {};

  const [items, total] = await prisma.$transaction([
    prisma.theme.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' }
    }),
    prisma.theme.count({ where })
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

export async function getThemeById(id: string) {
  return prisma.theme.findUnique({ where: { id } });
}

export async function createTheme(input: ThemeCreateInput) {
  return prisma.theme.create({ data: input });
}

export async function assignThemeToChannel(themeId: string, channelId: string) {
  return prisma.channel.update({
    where: { id: channelId },
    data: { themeId },
    include: { theme: true }
  });
}
