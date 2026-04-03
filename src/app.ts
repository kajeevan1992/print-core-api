import express from 'express';
import cors from 'cors';
import { productsRouter } from './modules/products/products.routes';
import { channelsRouter } from './modules/channels/channels.routes';
import { themesRouter } from './modules/themes/themes.routes';
import { errorHandler, notFoundHandler } from './middleware/error-handler';
import { env } from './config/env';

export const app = express();

const corsOrigin = env.CORS_ORIGIN
  ? env.CORS_ORIGIN.split(',').map((origin) => origin.trim())
  : true;

app.use(cors({ origin: corsOrigin }));
app.use(express.json());

app.get('/', (_req, res) => {
  res.json({
    success: true,
    data: {
      name: 'print-core-api',
      status: 'ok'
    }
  });
});

app.get('/health', (_req, res) => {
  res.json({ success: true, data: { status: 'ok' } });
});

app.use('/products', productsRouter);
app.use('/channels', channelsRouter);
app.use('/themes', themesRouter);

app.use(notFoundHandler);
app.use(errorHandler);
