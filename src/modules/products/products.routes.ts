import { Router } from 'express';
import { getProduct, getProducts, patchProduct, postProduct } from './products.controller';

export const productsRouter = Router();

productsRouter.get('/', getProducts);
productsRouter.get('/:id', getProduct);
productsRouter.post('/', postProduct);
productsRouter.patch('/:id', patchProduct);
