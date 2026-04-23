import { prisma } from '../../lib/prisma';
import { z } from 'zod';
import { categorySchema, categoryUpdateSchema } from './categories.schema';

type CategoryInput = z.infer<typeof categorySchema>;
type CategoryUpdateInput = z.infer<typeof categoryUpdateSchema>;

const slugify = (value: string) => value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
const includeCategory = { categoryTags: { include: { tag: true } } } as const;

const mapCategory = async (category: any) => ({
  ...category,
  tags: category.categoryTags?.map((item: any) => ({ id: item.tag.id, label: item.tag.label ?? item.tag.name ?? '' })) ?? [],
  productCount: await prisma.product.count({ where: { categoryId: category.id, published: true } }).catch(() => 0)
});

export async function listCategories(params: { page: number; limit: number; search?: string }) {
  const where = params.search ? { name: { contains: params.search, mode: 'insensitive' as const } } : {};
  try {
    const cats = await prisma.category.findMany({ where, include: includeCategory, orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }] });
    const items = await Promise.all(cats.map(mapCategory));
    return { items, pagination: { page: params.page, limit: params.limit, total: items.length, totalPages: 1 } };
  } catch {
    const cats = await prisma.category.findMany({ where, orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }] }).catch(() => []);
    const items = cats.map((category: any) => ({ ...category, tags: [], productCount: 0 }));
    return { items, pagination: { page: params.page, limit: params.limit, total: items.length, totalPages: 1 } };
  }
}

export async function createCategory(input: CategoryInput) {
  const { tags, ...data } = input;
  const created = await prisma.category.create({
    data: {
      ...data,
      friendlyUrl: data.friendlyUrl || `/${slugify(data.name)}`,
      categoryTags: { create: tags.map((tagId: string) => ({ tag: { connect: { id: tagId } } })) }
    },
    include: includeCategory
  });
  return mapCategory(created);
}

export async function updateCategory(id: string, input: CategoryUpdateInput) {
  const existing = await prisma.category.findUnique({ where: { id } });
  if (!existing) return null;
  const { tags, ...data } = input;
  const updated = await prisma.category.update({
    where: { id },
    data: {
      ...data,
      ...(tags
        ? {
            categoryTags: {
              deleteMany: {},
              create: tags.map((tagId: string) => ({ tag: { connect: { id: tagId } } }))
            }
          }
        : {})
    },
    include: includeCategory
  });
  return mapCategory(updated);
}

export async function deleteCategory(id: string) {
  await prisma.category.delete({ where: { id } });
  return { success: true };
}

export async function moveCategory(id: string, direction: 'up' | 'down') {
  const categories = await prisma.category.findMany({ orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }] });
  const index = categories.findIndex((category) => category.id === id);
  if (index === -1) return null;
  const swapIndex = direction === 'up' ? index - 1 : index + 1;
  if (swapIndex < 0 || swapIndex >= categories.length) return categories[index];
  const current = categories[index];
  const swap = categories[swapIndex];
  await prisma.$transaction([
    prisma.category.update({ where: { id: current.id }, data: { sortOrder: swap.sortOrder } }),
    prisma.category.update({ where: { id: swap.id }, data: { sortOrder: current.sortOrder } })
  ]);
  return prisma.category.findUnique({ where: { id } });
}

export async function listCategoryTags() {
  try {
    return await prisma.tag.findMany({ orderBy: { name: 'asc' } });
  } catch {
    return [];
  }
}

export async function saveCategoryTags(tags: Array<{ id?: string; label: string }>) {
  try {
    const current = await prisma.tag.findMany();
    const currentIds = new Set(current.map((tag) => tag.id));
    const nextIds = new Set(tags.map((tag) => tag.id).filter(Boolean) as string[]);
    const toDelete = current.filter((tag) => !nextIds.has(tag.id));
    for (const tag of toDelete) await prisma.tag.delete({ where: { id: tag.id } }).catch(() => null);
    const saved = [];
    for (const tag of tags) {
      if (tag.id && currentIds.has(tag.id)) {
        saved.push(await prisma.tag.update({ where: { id: tag.id }, data: { name: tag.label, friendlyUrl: `tag/${slugify(tag.label)}` } }));
      } else {
        saved.push(await prisma.tag.create({ data: { name: tag.label, friendlyUrl: `tag/${slugify(tag.label)}` } }));
      }
    }
    return saved;
  } catch {
    return [];
  }
}
