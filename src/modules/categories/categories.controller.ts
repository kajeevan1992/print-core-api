import type { Request, Response } from 'express';
import { categoryListQuerySchema, categorySchema, categoryTagsSchema, categoryUpdateSchema } from './categories.schema';
import { createCategory, deleteCategory, listCategories, listCategoryTags, moveCategory, saveCategoryTags, updateCategory } from './categories.service';

const getId = (value: string | string[] | undefined) => typeof value === 'string' ? value : null;

export async function getCategories(req: Request, res: Response) {
  try {
    res.json({ success: true, data: await listCategories(categoryListQuerySchema.parse(req.query)) });
  } catch (error) {
    console.error('CATEGORIES_LIST_FAILED', error);
    res.json({ success: true, data: { items: [], pagination: { page: 1, limit: 50, total: 0, totalPages: 1 } } });
  }
}
export async function postCategory(req: Request, res: Response) {
  try {
    res.status(201).json({ success: true, data: await createCategory(categorySchema.parse(req.body)) });
  } catch (error) {
    console.error('CATEGORY_CREATE_FAILED', error);
    res.status(500).json({ success: false, error: { message: 'Could not create category' } });
  }
}
export async function patchCategory(req: Request, res: Response) {
  try {
    const id = getId(req.params.id);
    if (!id) return void res.status(400).json({ success: false, error: { message: 'Invalid category id' } });
    const item = await updateCategory(id, categoryUpdateSchema.parse(req.body));
    if (!item) return void res.status(404).json({ success: false, error: { message: 'Category not found' } });
    res.json({ success: true, data: item });
  } catch (error) {
    console.error('CATEGORY_UPDATE_FAILED', error);
    res.status(500).json({ success: false, error: { message: 'Could not update category' } });
  }
}
export async function removeCategory(req: Request, res: Response) {
  try {
    const id = getId(req.params.id);
    if (!id) return void res.status(400).json({ success: false, error: { message: 'Invalid category id' } });
    res.json({ success: true, data: await deleteCategory(id) });
  } catch (error) {
    console.error('CATEGORY_DELETE_FAILED', error);
    res.status(500).json({ success: false, error: { message: 'Could not delete category' } });
  }
}
export async function postMoveCategory(req: Request, res: Response) {
  try {
    const id = getId(req.params.id);
    if (!id) return void res.status(400).json({ success: false, error: { message: 'Invalid category id' } });
    res.json({ success: true, data: await moveCategory(id, req.body.direction === 'up' ? 'up' : 'down') });
  } catch (error) {
    console.error('CATEGORY_MOVE_FAILED', error);
    res.status(500).json({ success: false, error: { message: 'Could not move category' } });
  }
}
export async function getCategoryTags(_req: Request, res: Response) {
  try {
    res.json({ success: true, data: await listCategoryTags() });
  } catch (error) {
    console.error('CATEGORY_TAGS_LIST_FAILED', error);
    res.json({ success: true, data: [] });
  }
}
export async function putCategoryTags(req: Request, res: Response) {
  try {
    const payload = categoryTagsSchema.parse(req.body);
    res.json({ success: true, data: await saveCategoryTags(payload.tags) });
  } catch (error) {
    console.error('CATEGORY_TAGS_SAVE_FAILED', error);
    res.status(500).json({ success: false, error: { message: 'Could not save category tags' } });
  }
}
