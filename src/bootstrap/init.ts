import { execSync } from 'node:child_process';
import { prisma } from '../lib/prisma';
import { seedDemoCatalog } from './seed-demo';
import { seedTenantOrderDemo } from './seed-tenant-order-demo';
import { seedCatalogMetaDemo } from './seed-catalog-meta-demo';

export async function initializeDatabaseAndSeed() {
  const autoPush = (process.env.AUTO_DB_PUSH ?? 'true').toLowerCase() === 'true';
  const autoSeed = (process.env.AUTO_SEED_DEMO ?? 'true').toLowerCase() === 'true';

  if (autoPush) {
    console.log('[startup] running prisma db push...');
    execSync('npx prisma db push --skip-generate', { stdio: 'inherit' });
  }

  await prisma.$connect();

  if (autoSeed) {
    const existingCount = await prisma.product.count().catch(() => 0);
    if (existingCount === 0) {
      console.log('[startup] no products found, seeding demo catalog...');
      const result = await seedDemoCatalog(prisma);
      console.log('[startup] demo catalog seeded', JSON.stringify(result));
    } else {
      console.log(`[startup] product catalog already present (${existingCount} products), skipping demo seed.`);
    }
    const materialCount = await prisma.material.count().catch(() => 0);
    const finishCount = await prisma.finish.count().catch(() => 0);
    const optionSetCount = await prisma.optionSet.count().catch(() => 0);

    if (materialCount === 0 || finishCount === 0 || optionSetCount === 0) {
      console.log('[startup] catalog material/finish/option data missing, seeding catalog meta demo...');
      const result = await seedCatalogMetaDemo();
      console.log('[startup] catalog meta demo seeded', JSON.stringify(result));
    } else {
      console.log(
        `[startup] catalog meta data already present (${materialCount} materials, ${finishCount} finishes, ${optionSetCount} option sets), skipping catalog meta seed.`
      );
    }

    const orderCount = await prisma.order.count().catch(() => 0);
    const tenantCount = await prisma.tenant.count().catch(() => 0);
    if (orderCount === 0 || tenantCount === 0) {
      console.log('[startup] tenant/order data missing, seeding tenant/order demo...');
      const result = await seedTenantOrderDemo();
      console.log('[startup] tenant/order demo seeded', JSON.stringify(result));
    } else {
      console.log(`[startup] tenant/order data already present (${tenantCount} tenants, ${orderCount} orders), skipping tenant/order seed.`);
    }
  }
}
