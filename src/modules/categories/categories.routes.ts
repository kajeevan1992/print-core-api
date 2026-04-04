import { Router } from 'express';
import { getCategories, getCategoryTags, patchCategory, postCategory, postMoveCategory, putCategoryTags, removeCategory } from './categories.controller';

export const categoriesRouter = Router();
categoriesRouter.get('/', getCategories);
categoriesRouter.post('/', postCategory);
categoriesRouter.patch('/:id', patchCategory);
categoriesRouter.delete('/:id', removeCategory);
categoriesRouter.post('/:id/move', postMoveCategory);
categoriesRouter.get('/tags/list', getCategoryTags);
categoriesRouter.put('/tags/list', putCategoryTags);
