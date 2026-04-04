import { prisma } from '../../lib/prisma';
import { z } from 'zod';
import { categorySchema, categoryUpdateSchema } from './categories.schema';

type CategoryInput = z.infer<typeof categorySchema>;
type CategoryUpdateInput = z.infer<typeof categoryUpdateSchema>;

const slugify = (value: string) => value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
const includeCategory = { categoryTags: { include: { tag: true } } } as const;
const mapCategory = async (category: any) => ({
  ...category,
  tags: category.categoryTags?.map((item: any) => ({ id: item.tag.id, label: item.tag.label })) ?? [],
  productCount: await prisma.product.count({ where: { categoryId: category.id, published: true } })
});

export async function listCategories(params: { page: number; limit: number; search?: string }) {
  const where = params.search ? { name: { contains: params.search, mode: 'insensitive' as const } } : {};
  const cats = await prisma.category.findMany({ where, include: includeCategory, orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }] });
  const items = await Promise.all(cats.map(mapCategory));
  return { items, pagination: { page: params.page, limit: params.limit, total: items.length, totalPages: 1 } };
}
export async function createCategory(input: CategoryInput) {
  const { tagIds, ...data } = input;
  const created = await prisma.category.create({ data: { ...data, friendlyUrl: data.friendlyUrl || `/${slugify(data.name)}`, categoryTags: { create: tagIds.map((tagId) => ({ tag: { connect: { id: tagId } } })) } }, include: includeCategory });
  return mapCategory(created);
}
export async function updateCategory(id: string, input: CategoryUpdateInput) {
  const existing = await prisma.category.findUnique({ where: { id } });
  if (!existing) return null;
  const { tagIds, ...data } = input;
  const updated = await prisma.category.update({ where: { id }, data: { ...data, ...(tagIds ? { categoryTags: { deleteMany: {}, create: tagIds.map((tagId) => ({ tag: { connect: { id: tagId } } })) } } : {}) }, include: includeCategory });
  return mapCategory(updated);
}
export async function deleteCategory(id: string) { await prisma.category.delete({ where: { id } }); await prisma.product.updateMany({ where: { categoryId: id }, data: { published: false, categoryId: null } }); return { success: true }; }
export async function moveCategory(id: string, direction: 'up'|'down') {
  const list = await prisma.category.findMany({ orderBy: { sortOrder: 'asc' } });
  const index = list.findIndex((item) => item.id === id);
  const swapIndex = direction === 'up' ? index - 1 : index + 1;
  if (index < 0 || swapIndex < 0 || swapIndex >= list.length) return listCategories({ page: 1, limit: 200 });
  const current = list[index]; const target = list[swapIndex];

  await prisma.$transaction([
    prisma.category.update({ where: { id: current.id }, data: { sortOrder: target.sortOrder } }),
    prisma.category.update({ where: { id: target.id }, data: { sortOrder: current.sortOrder } })
  ]);
  return listCategories({ page: 1, limit: 200 });
}
export async function listCategoryTags() { return { items: await prisma.categoryTag.findMany({ orderBy: { label: 'asc' } }) }; }
export async function saveCategoryTags(labels: string[]) {
  const cleaned = Array.from(new Set(labels.map((item) => item.trim()).filter(Boolean)));
  const existing = await prisma.categoryTag.findMany();
  const existingLabels = new Set(existing.map((item) => item.label));
  const toDelete = existing.filter((item) => !cleaned.includes(item.label));
  if (toDelete.length) await prisma.categoryTag.deleteMany({ where: { id: { in: toDelete.map((item) => item.id) } } });
  for (const label of cleaned) if (!existingLabels.has(label)) await prisma.categoryTag.create({ data: { label } });
  return { items: await prisma.categoryTag.findMany({ orderBy: { label: 'asc' } }) };
}
