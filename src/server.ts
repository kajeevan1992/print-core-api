import { app } from './app';
import { env } from './config/env';
import { prisma } from './lib/prisma';
import { initializeDatabaseAndSeed } from './bootstrap/init';

async function bootstrap(): Promise<void> {
  try {
    await initializeDatabaseAndSeed();
    app.listen(env.PORT, () => {
      console.log(`[startup] print-core-api listening on port ${env.PORT} (${env.NODE_ENV})`);
    });
  } catch (error) {
    console.error('Unable to start server', error);
    process.exit(1);
  }
}

bootstrap();
