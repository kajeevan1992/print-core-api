import type { Request, Response } from 'express';
import { collectionListQuerySchema, collectionSchema, collectionUpdateSchema } from './collections.schema';
import { createCollection, deleteCollection, getCollectionById, listCollections, updateCollection } from './collections.service';

const getId = (v: string | string[] | undefined) => (typeof v === 'string' ? v : null);

export async function getCollections(req: Request, res: Response) {
  try {
    res.json({ success: true, data: await listCollections(collectionListQuerySchema.parse(req.query)) });
  } catch (error) {
    console.error('COLLECTIONS_LIST_FAILED', error);
    res.json({ success: true, data: { items: [], pagination: { page: 1, limit: 50, total: 0, totalPages: 1 } } });
  }
}
export async function getCollection(req: Request, res: Response) {
  try {
    const id = getId(req.params.id);
    if (!id) return void res.status(400).json({ success: false, error: { message: 'Invalid collection id' } });
    const item = await getCollectionById(id);
    if (!item) return void res.status(404).json({ success: false, error: { message: 'Collection not found' } });
    res.json({ success: true, data: item });
  } catch (error) {
    console.error('COLLECTION_GET_FAILED', error);
    res.status(500).json({ success: false, error: { message: 'Could not load collection' } });
  }
}
export async function postCollection(req: Request, res: Response) {
  try {
    res.status(201).json({ success: true, data: await createCollection(collectionSchema.parse(req.body)) });
  } catch (error) {
    console.error('COLLECTION_CREATE_FAILED', error);
    res.status(500).json({ success: false, error: { message: 'Could not create collection' } });
  }
}
export async function patchCollection(req: Request, res: Response) {
  try {
    const id = getId(req.params.id);
    if (!id) return void res.status(400).json({ success: false, error: { message: 'Invalid collection id' } });
    const item = await updateCollection(id, collectionUpdateSchema.parse(req.body));
    if (!item) return void res.status(404).json({ success: false, error: { message: 'Collection not found' } });
    res.json({ success: true, data: item });
  } catch (error) {
    console.error('COLLECTION_UPDATE_FAILED', error);
    res.status(500).json({ success: false, error: { message: 'Could not update collection' } });
  }
}
export async function removeCollection(req: Request, res: Response) {
  try {
    const id = getId(req.params.id);
    if (!id) return void res.status(400).json({ success: false, error: { message: 'Invalid collection id' } });
    res.json({ success: true, data: await deleteCollection(id) });
  } catch (error) {
    console.error('COLLECTION_DELETE_FAILED', error);
    res.status(500).json({ success: false, error: { message: 'Could not delete collection' } });
  }
}
