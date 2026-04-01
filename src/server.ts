import { app } from './app';
import { env } from './config/env';
import { prisma } from './lib/prisma';

async function bootstrap(): Promise<void> {
  try {
    await prisma.$connect();
    app.listen(env.PORT, () => {
      console.log(`[startup] print-core-api listening on port ${env.PORT} (${env.NODE_ENV})`);
    });
  } catch (error) {
    console.error('Unable to start server', error);
    process.exit(1);
  }
}

bootstrap();
