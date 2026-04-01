import { Router } from 'express';
import { getChannel, getChannels, patchChannel, postChannel } from './channels.controller';

export const channelsRouter = Router();

channelsRouter.get('/', getChannels);
channelsRouter.get('/:id', getChannel);
channelsRouter.post('/', postChannel);
channelsRouter.patch('/:id', patchChannel);
