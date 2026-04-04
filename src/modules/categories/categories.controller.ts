import type { Request, Response } from 'express';
import { categoryListQuerySchema, categorySchema, categoryTagsSchema, categoryUpdateSchema } from './categories.schema';
import { createCategory, deleteCategory, listCategories, listCategoryTags, moveCategory, saveCategoryTags, updateCategory } from './categories.service';

const getId = (value: string | string[] | undefined) => typeof value === 'string' ? value : null;

export async function getCategories(req: Request, res: Response) { res.json({ success: true, data: await listCategories(categoryListQuerySchema.parse(req.query)) }); }
export async function postCategory(req: Request, res: Response) { res.status(201).json({ success: true, data: await createCategory(categorySchema.parse(req.body)) }); }
export async function patchCategory(req: Request, res: Response) { const id=getId(req.params.id); if(!id) return void res.status(400).json({ success:false,error:{message:'Invalid category id'}}); const item=await updateCategory(id, categoryUpdateSchema.parse(req.body)); if(!item) return void res.status(404).json({ success:false,error:{message:'Category not found'}}); res.json({ success:true,data:item }); }
export async function removeCategory(req: Request, res: Response) { const id=getId(req.params.id); if(!id) return void res.status(400).json({ success:false,error:{message:'Invalid category id'}}); res.json({ success:true, data: await deleteCategory(id) }); }
export async function postMoveCategory(req: Request, res: Response) { const id=getId(req.params.id); if(!id) return void res.status(400).json({ success:false,error:{message:'Invalid category id'}}); res.json({ success:true, data: await moveCategory(id, req.body.direction === 'up' ? 'up' : 'down') }); }
export async function getCategoryTags(_req: Request, res: Response) { res.json({ success:true, data: await listCategoryTags() }); }
export async function putCategoryTags(req: Request, res: Response) { const payload = categoryTagsSchema.parse(req.body); res.json({ success:true, data: await saveCategoryTags(payload.labels) }); }
