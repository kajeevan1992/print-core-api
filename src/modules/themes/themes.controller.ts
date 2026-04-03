import type { Request, Response } from 'express';
import { assignThemeSchema, themeCreateSchema, themeListQuerySchema } from './themes.schema';
import { assignThemeToChannel, createTheme, getThemeById, listThemes } from './themes.service';

function getSingleParam(value: string | string[] | undefined): string | null {
  if (typeof value === 'string') return value;
  return null;
}

export async function getThemes(req: Request, res: Response): Promise<void> {
  const query = themeListQuerySchema.parse(req.query);
  const result = await listThemes(query);

  res.json({ success: true, data: result });
}

export async function getTheme(req: Request, res: Response): Promise<void> {
  const id = getSingleParam(req.params.id);

  if (!id) {
    res.status(400).json({ success: false, error: { message: 'Invalid theme id' } });
    return;
  }

  const theme = await getThemeById(id);

  if (!theme) {
    res.status(404).json({ success: false, error: { message: 'Theme not found' } });
    return;
  }

  res.json({ success: true, data: theme });
}

export async function postTheme(req: Request, res: Response): Promise<void> {
  const payload = themeCreateSchema.parse(req.body);
  const theme = await createTheme(payload);

  res.status(201).json({ success: true, data: theme });
}

export async function postAssignTheme(req: Request, res: Response): Promise<void> {
  const payload = assignThemeSchema.parse(req.body);
  const updatedChannel = await assignThemeToChannel(payload.themeId, payload.channelId);

  res.json({ success: true, data: updatedChannel });
}
