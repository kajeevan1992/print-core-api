import { PrismaClient } from '@prisma/client';

export async function seedDemoCatalog(prisma: PrismaClient) {
  const friendlyUrl = 'print-products';

  const existingCategory = await prisma.category.findUnique({
    where: { friendlyUrl },
  });

  const category = existingCategory
    ? await prisma.category.update({
        where: { id: existingCategory.id },
        data: {
          name: 'Print Products',
          description: 'Demo print products for storefront testing',
          published: true,
          canBrowse: true,
          canCreate: true,
          canCustom: true,
        },
      })
    : await prisma.category.create({
        data: {
          name: 'Print Products',
          description: 'Demo print products for storefront testing',
          friendlyUrl,
          published: true,
          thumbnail: '',
          sortOrder: 1,
          canBrowse: true,
          canUpload: true,
          canUploadLater: true,
          canCreate: true,
          canCustom: true,
        },
      });

  const products = [
    {
      slug: 'standard-business-cards',
      name: 'Standard Business Cards',
      description: 'Professional business cards for everyday networking.',
      creationMethod: 'upload',
      productType: 'print',
      categoryId: category.id,
      thumbnail: '/images/business-card-front.svg',
      sortOrder: 1,
      pages: 2,
      units: 'mm',
      width: 85,
      height: 55,
      bleed: 3,
      published: true,
      vendorId: '',
      hotFolder: '',
      pdfFileUrl: null,
      cmsPageLink: '',
      previewUrl: '',
      isGlobal: false,
      storefrontIds: [],
      productNumbers: [],
      templateDefaults: {},
      templateSetup: {},
      templateAssets: [],
      priceMapping: { basePriceMinor: 1900, currency: 'GBP', variants: [{ name: '350gsm Silk', priceMinor: 1900 }, { name: '400gsm Matt', priceMinor: 2400 }] },
      comments: [],
      internalNotes: '',
      inventory: {},
      relatedProducts: [],
      attributes: [],
      alternateViews: [],
    },
    {
      slug: 'a5-flyers',
      name: 'A5 Flyers',
      description: 'Promotional flyers for campaigns and handouts.',
      creationMethod: 'upload',
      productType: 'print',
      categoryId: category.id,
      thumbnail: '/images/flyer-front.svg',
      sortOrder: 2,
      pages: 2,
      units: 'mm',
      width: 148,
      height: 210,
      bleed: 3,
      published: true,
      vendorId: '',
      hotFolder: '',
      pdfFileUrl: null,
      cmsPageLink: '',
      previewUrl: '',
      isGlobal: false,
      storefrontIds: [],
      productNumbers: [],
      templateDefaults: {},
      templateSetup: {},
      templateAssets: [],
      priceMapping: { basePriceMinor: 2900, currency: 'GBP', variants: [{ name: '130gsm Gloss', priceMinor: 2900 }, { name: '170gsm Silk', priceMinor: 3400 }] },
      comments: [],
      internalNotes: '',
      inventory: {},
      relatedProducts: [],
      attributes: [],
      alternateViews: [],
    },
    {
      slug: 'mailer-boxes',
      name: 'Mailer Boxes',
      description: 'Custom packaging for ecommerce and retail shipping.',
      creationMethod: 'quote',
      productType: 'packaging',
      categoryId: category.id,
      thumbnail: '/images/poster-main.svg',
      sortOrder: 3,
      pages: 1,
      units: 'mm',
      width: 300,
      height: 220,
      bleed: 3,
      published: true,
      vendorId: '',
      hotFolder: '',
      pdfFileUrl: null,
      cmsPageLink: '',
      previewUrl: '',
      isGlobal: false,
      storefrontIds: [],
      productNumbers: [],
      templateDefaults: {},
      templateSetup: {},
      templateAssets: [],
      priceMapping: { basePriceMinor: 9900, currency: 'GBP', variants: [{ name: 'Small Box', priceMinor: 9900 }, { name: 'Medium Box', priceMinor: 12900 }] },
      comments: [],
      internalNotes: '',
      inventory: {},
      relatedProducts: [],
      attributes: [],
      alternateViews: [],
    },
  ] as const;

  const savedProducts = [];
  for (const product of products) {
    const existing = await prisma.product.findUnique({ where: { slug: product.slug } });

    const saved = existing
      ? await prisma.product.update({
          where: { id: existing.id },
          data: product,
        })
      : await prisma.product.create({
          data: product,
        });

    savedProducts.push({
      id: saved.id,
      slug: saved.slug,
      name: saved.name,
      categoryId: saved.categoryId,
    });
  }

  return {
    category: {
      id: category.id,
      name: category.name,
      friendlyUrl: category.friendlyUrl,
    },
    products: savedProducts,
  };
}
