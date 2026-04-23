import { prisma } from '../lib/prisma';

export async function seedTenantOrderDemo() {
  const tenantOne = await prisma.tenant.upsert({
    where: { slug: 'demo-store' },
    update: {
      name: 'Printcore Demo Store',
      status: 'active',
      planName: 'Growth',
      storefrontsUsed: 1,
      storefrontsLimit: 3,
      adminUsersUsed: 2,
      adminUsersLimit: 8,
      storageUsedGb: 4,
      storageLimitGb: 50,
      defaultSubdomain: 'demo.printcore.com',
      primaryDomain: 'demo.printcore.com',
      nextBillingDate: new Date('2026-05-01T00:00:00.000Z'),
    },
    create: {
      slug: 'demo-store',
      name: 'Printcore Demo Store',
      status: 'active',
      planName: 'Growth',
      storefrontsUsed: 1,
      storefrontsLimit: 3,
      adminUsersUsed: 2,
      adminUsersLimit: 8,
      storageUsedGb: 4,
      storageLimitGb: 50,
      defaultSubdomain: 'demo.printcore.com',
      primaryDomain: 'demo.printcore.com',
      nextBillingDate: new Date('2026-05-01T00:00:00.000Z'),
    },
  });

  const tenantTwo = await prisma.tenant.upsert({
    where: { slug: 'north-print' },
    update: {
      name: 'North Print Studio',
      status: 'trial',
      planName: 'Starter',
      storefrontsUsed: 1,
      storefrontsLimit: 1,
      adminUsersUsed: 1,
      adminUsersLimit: 3,
      storageUsedGb: 1,
      storageLimitGb: 10,
      defaultSubdomain: 'north-print.printcore.com',
      nextBillingDate: new Date('2026-04-28T00:00:00.000Z'),
    },
    create: {
      slug: 'north-print',
      name: 'North Print Studio',
      status: 'trial',
      planName: 'Starter',
      storefrontsUsed: 1,
      storefrontsLimit: 1,
      adminUsersUsed: 1,
      adminUsersLimit: 3,
      storageUsedGb: 1,
      storageLimitGb: 10,
      defaultSubdomain: 'north-print.printcore.com',
      nextBillingDate: new Date('2026-04-28T00:00:00.000Z'),
    },
  });

  const domainSeeds = [
    {
      tenantId: tenantOne.id,
      hostname: 'demo.printcore.com',
      type: 'PLATFORM_SUBDOMAIN',
      isPrimary: true,
      verificationStatus: 'verified',
      sslStatus: 'issued',
    },
    {
      tenantId: tenantTwo.id,
      hostname: 'north-print.printcore.com',
      type: 'PLATFORM_SUBDOMAIN',
      isPrimary: true,
      verificationStatus: 'verified',
      sslStatus: 'issued',
    },
  ];

  for (const domain of domainSeeds) {
    await prisma.tenantDomain.upsert({
      where: { hostname: domain.hostname },
      update: domain,
      create: domain,
    });
  }

  const orderSeeds = [
    {
      tenantId: tenantOne.id,
      orderNumber: 'ORD-1001',
      customerName: 'Ava Thompson',
      email: 'ava@example.com',
      status: 'artwork-review',
      totalMinor: 4900,
      currency: 'GBP',
      submittedAt: new Date('2026-04-20T09:30:00.000Z'),
      items: [
        { productName: 'Standard Business Cards', quantity: 2, unitPriceMinor: 2450, lineTotalMinor: 4900, variantLabel: '350gsm Silk' },
      ],
      artworks: [
        { orderReference: 'ORD-1001', customerEmail: 'ava@example.com', fileName: 'business-cards-proof.pdf', fileType: 'PDF', note: 'Front and back supplied', status: 'pending-review', source: 'seed' },
      ],
    },
    {
      tenantId: tenantOne.id,
      orderNumber: 'ORD-1002',
      customerName: 'Leo Carter',
      email: 'leo@example.com',
      status: 'awaiting-approval',
      totalMinor: 12900,
      currency: 'GBP',
      submittedAt: new Date('2026-04-21T13:10:00.000Z'),
      items: [
        { productName: 'Mailer Boxes', quantity: 1, unitPriceMinor: 12900, lineTotalMinor: 12900, variantLabel: 'Medium Box' },
      ],
      artworks: [
        { orderReference: 'ORD-1002', customerEmail: 'leo@example.com', fileName: 'mailer-box-artwork.ai', fileType: 'AI', note: 'Awaiting customer approval', status: 'awaiting-customer-fix', source: 'seed' },
      ],
    },
    {
      tenantId: tenantTwo.id,
      orderNumber: 'ORD-1003',
      customerName: 'Mia Patel',
      email: 'mia@example.com',
      status: 'in-production',
      totalMinor: 21900,
      currency: 'GBP',
      submittedAt: new Date('2026-04-22T08:45:00.000Z'),
      items: [
        { productName: 'A5 Flyers', quantity: 3, unitPriceMinor: 7300, lineTotalMinor: 21900, variantLabel: '170gsm Silk' },
      ],
      artworks: [
        { orderReference: 'ORD-1003', customerEmail: 'mia@example.com', fileName: 'flyer-artwork-v2.pdf', fileType: 'PDF', note: 'Approved and in production', status: 'approved', source: 'seed' },
      ],
    },
  ];

  for (const orderSeed of orderSeeds) {
    const { items, artworks, ...orderData } = orderSeed;
    const order = await prisma.order.upsert({
      where: { orderNumber: orderData.orderNumber },
      update: orderData,
      create: orderData,
    });

    await prisma.orderItem.deleteMany({ where: { orderId: order.id } });
    if (items.length) {
      await prisma.orderItem.createMany({
        data: items.map((item) => ({
          orderId: order.id,
          ...item,
        })),
      });
    }

    await prisma.artwork.deleteMany({ where: { orderReference: order.orderNumber } });
    if (artworks.length) {
      await prisma.artwork.createMany({
        data: artworks.map((artwork) => ({
          orderId: order.id,
          ...artwork,
        })),
      });
    }
  }

  return {
    tenantsSeeded: 2,
    domainsSeeded: domainSeeds.length,
    ordersSeeded: orderSeeds.length,
    artworksSeeded: orderSeeds.reduce((sum, order) => sum + order.artworks.length, 0),
  };
}
