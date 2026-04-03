import { Router } from 'express';
import { getTheme, getThemes, postAssignTheme, postTheme } from './themes.controller';

export const themesRouter = Router();

themesRouter.get('/', getThemes);
themesRouter.post('/assign', postAssignTheme);
themesRouter.get('/:id', getTheme);
themesRouter.post('/', postTheme);
