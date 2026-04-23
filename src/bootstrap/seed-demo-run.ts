import { prisma } from '../lib/prisma';
import { seedDemoCatalog } from './seed-demo';

async function main() {
  await prisma.$connect();
  const result = await seedDemoCatalog(prisma);
  console.log(JSON.stringify({ success: true, data: result }, null, 2));
}

main()
  .catch((error) => {
    console.error('SEED_RUN_FAILED', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
