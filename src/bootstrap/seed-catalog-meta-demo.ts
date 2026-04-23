import { prisma } from '../lib/prisma';

export async function seedCatalogMetaDemo() {
  const materials = [
    { name: '350gsm Silk', slug: '350gsm-silk', description: 'Smooth coated card stock', gsm: '350gsm' },
    { name: '170gsm Silk', slug: '170gsm-silk', description: 'Common flyer stock', gsm: '170gsm' },
    { name: '400gsm Matt Laminated', slug: '400gsm-matt-laminated', description: 'Premium laminated card', gsm: '400gsm' },
    { name: 'E Flute Board', slug: 'e-flute-board', description: 'Mailer box board material', gsm: null },
    { name: 'PVC Banner', slug: 'pvc-banner', description: 'Outdoor banner substrate', gsm: '510gsm' },
  ];

  const finishes = [
    { name: 'Matt Lamination', slug: 'matt-lamination', description: 'Protective matt laminate' },
    { name: 'Gloss Lamination', slug: 'gloss-lamination', description: 'High-shine protective laminate' },
    { name: 'Spot UV', slug: 'spot-uv', description: 'Selective gloss UV coating' },
    { name: 'Soft Touch', slug: 'soft-touch', description: 'Premium velvet-feel laminate' },
  ];

  const optionSets = [
    { name: 'Business Card Options', slug: 'business-card-options', description: 'Size, stock, finish, and quantity' },
    { name: 'Flyer Options', slug: 'flyer-options', description: 'Size, paper, sides, and quantity' },
    { name: 'Mailer Box Options', slug: 'mailer-box-options', description: 'Board, size, print sides, and quantity' },
    { name: 'Poster Options', slug: 'poster-options', description: 'Size, stock, and finishing' },
  ];

  for (const row of materials) {
    await prisma.material.upsert({ where: { slug: row.slug }, update: row, create: row });
  }
  for (const row of finishes) {
    await prisma.finish.upsert({ where: { slug: row.slug }, update: row, create: row });
  }
  for (const row of optionSets) {
    await prisma.optionSet.upsert({ where: { slug: row.slug }, update: row, create: row });
  }

  return {
    materialsSeeded: materials.length,
    finishesSeeded: finishes.length,
    optionSetsSeeded: optionSets.length,
  };
}
