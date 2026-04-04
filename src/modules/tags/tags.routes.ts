import { Router } from 'express';
import { getTag, getTags, patchTag, postTag, removeTag } from './tags.controller';
export const tagsRouter = Router();
tagsRouter.get('/', getTags);
tagsRouter.get('/:id', getTag);
tagsRouter.post('/', postTag);
tagsRouter.patch('/:id', patchTag);
tagsRouter.delete('/:id', removeTag);
