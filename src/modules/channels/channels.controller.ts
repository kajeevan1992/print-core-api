import type { Request, Response } from 'express';
import { env } from '../../config/env';
import { channelCreateSchema, channelListQuerySchema, channelUpdateSchema } from './channels.schema';
import { createChannel, getChannelById, listChannels, updateChannel } from './channels.service';

function responseMeta(req: Request) {
  if (env.NODE_ENV !== 'development') {
    return undefined;
  }

  return {
    channelId: req.channel?.id ?? null,
    scoped: Boolean(req.channel)
  };
}

export async function getChannels(req: Request, res: Response): Promise<void> {
  const query = channelListQuerySchema.parse(req.query);
  const result = await listChannels({ ...query, scopedChannelId: req.channel?.id });

  res.json({ success: true, data: result, meta: responseMeta(req) });
}

export async function getChannel(req: Request, res: Response): Promise<void> {
  const channel = await getChannelById(req.params.id, req.channel?.id);

  if (!channel) {
    res.status(404).json({ success: false, error: { message: 'Channel not found' } });
    return;
  }

  res.json({ success: true, data: channel, meta: responseMeta(req) });
}

export async function postChannel(req: Request, res: Response): Promise<void> {
  const payload = channelCreateSchema.parse(req.body);
  const channel = await createChannel(payload);

  res.status(201).json({ success: true, data: channel, meta: responseMeta(req) });
}

export async function patchChannel(req: Request, res: Response): Promise<void> {
  const payload = channelUpdateSchema.parse(req.body);
  const channel = await updateChannel(req.params.id, payload, req.channel?.id);

  if (!channel) {
    res.status(404).json({ success: false, error: { message: 'Channel not found' } });
    return;
  }

  res.json({ success: true, data: channel, meta: responseMeta(req) });
}
