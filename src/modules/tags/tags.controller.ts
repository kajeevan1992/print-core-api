import type { Request, Response } from 'express';
import { tagListQuerySchema, tagSchema, tagUpdateSchema } from './tags.schema';
import { createTag, deleteTag, getTagById, listTags, updateTag } from './tags.service';

const getId = (v: string | string[] | undefined) => (typeof v === 'string' ? v : null);

export async function getTags(req: Request, res: Response) {
  try {
    res.json({ success: true, data: await listTags(tagListQuerySchema.parse(req.query)) });
  } catch (error) {
    console.error('TAGS_LIST_FAILED', error);
    res.json({ success: true, data: { items: [], pagination: { page: 1, limit: 50, total: 0, totalPages: 1 } } });
  }
}
export async function getTag(req: Request, res: Response) {
  try {
    const id = getId(req.params.id);
    if (!id) return void res.status(400).json({ success: false, error: { message: 'Invalid tag id' } });
    const item = await getTagById(id);
    if (!item) return void res.status(404).json({ success: false, error: { message: 'Tag not found' } });
    res.json({ success: true, data: item });
  } catch (error) {
    console.error('TAG_GET_FAILED', error);
    res.status(500).json({ success: false, error: { message: 'Could not load tag' } });
  }
}
export async function postTag(req: Request, res: Response) {
  try {
    res.status(201).json({ success: true, data: await createTag(tagSchema.parse(req.body)) });
  } catch (error) {
    console.error('TAG_CREATE_FAILED', error);
    res.status(500).json({ success: false, error: { message: 'Could not create tag' } });
  }
}
export async function patchTag(req: Request, res: Response) {
  try {
    const id = getId(req.params.id);
    if (!id) return void res.status(400).json({ success: false, error: { message: 'Invalid tag id' } });
    const item = await updateTag(id, tagUpdateSchema.parse(req.body));
    if (!item) return void res.status(404).json({ success: false, error: { message: 'Tag not found' } });
    res.json({ success: true, data: item });
  } catch (error) {
    console.error('TAG_UPDATE_FAILED', error);
    res.status(500).json({ success: false, error: { message: 'Could not update tag' } });
  }
}
export async function removeTag(req: Request, res: Response) {
  try {
    const id = getId(req.params.id);
    if (!id) return void res.status(400).json({ success: false, error: { message: 'Invalid tag id' } });
    res.json({ success: true, data: await deleteTag(id) });
  } catch (error) {
    console.error('TAG_DELETE_FAILED', error);
    res.status(500).json({ success: false, error: { message: 'Could not delete tag' } });
  }
}
