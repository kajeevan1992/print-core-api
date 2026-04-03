import type { Request, Response } from 'express';
import { env } from '../../config/env';
import { assignThemeSchema, themeCreateSchema, themeListQuerySchema } from './themes.schema';
import { assignThemeToChannel, createTheme, getThemeById, listThemes } from './themes.service';

function responseMeta(req: Request) {
  if (env.NODE_ENV !== 'development') {
    return undefined;
  }

  return {
    channelId: req.channel?.id ?? null,
    scoped: Boolean(req.channel)
  };
}

export async function getThemes(req: Request, res: Response): Promise<void> {
  const query = themeListQuerySchema.parse(req.query);
  const result = await listThemes(query);

  res.json({ success: true, data: result, meta: responseMeta(req) });
}

export async function getTheme(req: Request, res: Response): Promise<void> {
  const theme = await getThemeById(req.params.id);

  if (!theme) {
    res.status(404).json({ success: false, error: { message: 'Theme not found' } });
    return;
  }

  res.json({ success: true, data: theme, meta: responseMeta(req) });
}

export async function postTheme(req: Request, res: Response): Promise<void> {
  const payload = themeCreateSchema.parse(req.body);
  const theme = await createTheme(payload);

  res.status(201).json({ success: true, data: theme, meta: responseMeta(req) });
}

export async function postAssignTheme(req: Request, res: Response): Promise<void> {
  const payload = assignThemeSchema.parse(req.body);
  const updatedChannel = await assignThemeToChannel(payload.themeId, payload.channelId);

  res.json({ success: true, data: updatedChannel, meta: responseMeta(req) });
}
