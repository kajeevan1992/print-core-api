import { Router } from 'express';
import { getCollection, getCollections, patchCollection, postCollection, removeCollection } from './collections.controller';
export const collectionsRouter = Router();
collectionsRouter.get('/', getCollections);
collectionsRouter.get('/:id', getCollection);
collectionsRouter.post('/', postCollection);
collectionsRouter.patch('/:id', patchCollection);
collectionsRouter.delete('/:id', removeCollection);
