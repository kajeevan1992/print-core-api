import type { Request, Response } from 'express';
import { channelCreateSchema, channelListQuerySchema, channelUpdateSchema } from './channels.schema';
import { createChannel, getChannelById, listChannels, updateChannel } from './channels.service';

function getSingleParam(value: string | string[] | undefined): string | null {
  if (typeof value === 'string') return value;
  return null;
}

export async function getChannels(req: Request, res: Response): Promise<void> {
  const query = channelListQuerySchema.parse(req.query);
  const result = await listChannels(query);

  res.json({ success: true, data: result });
}

export async function getChannel(req: Request, res: Response): Promise<void> {
  const id = getSingleParam(req.params.id);

  if (!id) {
    res.status(400).json({ success: false, error: { message: 'Invalid channel id' } });
    return;
  }

  const channel = await getChannelById(id);

  if (!channel) {
    res.status(404).json({ success: false, error: { message: 'Channel not found' } });
    return;
  }

  res.json({ success: true, data: channel });
}

export async function postChannel(req: Request, res: Response): Promise<void> {
  const payload = channelCreateSchema.parse(req.body);
  const channel = await createChannel(payload);

  res.status(201).json({ success: true, data: channel });
}

export async function patchChannel(req: Request, res: Response): Promise<void> {
  const id = getSingleParam(req.params.id);

  if (!id) {
    res.status(400).json({ success: false, error: { message: 'Invalid channel id' } });
    return;
  }

  const payload = channelUpdateSchema.parse(req.body);
  const channel = await updateChannel(id, payload);

  if (!channel) {
    res.status(404).json({ success: false, error: { message: 'Channel not found' } });
    return;
  }

  res.json({ success: true, data: channel });
}
