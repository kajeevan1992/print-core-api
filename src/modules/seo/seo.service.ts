import type { Request } from 'express';
import { prisma } from '../../lib/prisma';

export type SeoPageType = 'home' | 'product' | 'category' | 'location' | 'collection-point' | 'product-location' | 'guide' | 'static' | 'service-area';
export type SeoPageStatus = 'draft' | 'published' | 'hidden';
export type SeoTwitterCard = 'summary' | 'summary_large_image';

type SeoPageRecord = {
  id: string;
  slug: string;
  path: string;
  pageType: SeoPageType;
  status: SeoPageStatus;
  title: string;
  metaDescription: string;
  h1: string;
  canonicalUrl: string;
  noIndex: boolean;
  noFollow: boolean;
  includeInSitemap: boolean;
  schemaTypes: string[];
  targetKeyword: string;
  productName?: string;
  locationName?: string;
  introCopy?: string;
  faqItems?: Array<{ question: string; answer: string }>;
  internalLinks?: Array<{ label: string; href: string }>;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  twitterCard?: SeoTwitterCard;
  metadata?: Record<string, any>;
  updatedAt?: string;
  createdAt?: string;
};

type CoreCatalogRow = {
  id: string;
  tenantId: string;
  resource: string;
  slug: string;
  name: string;
  description: string | null;
  metadataJson: any;
  createdAt: Date | string;
  updatedAt: Date | string;
};

const RESOURCE = 'seo-pages';
const SITE_URL = (process.env.STOREFRONT_URL || process.env.NEXT_PUBLIC_STOREFRONT_URL || 'https://holoprint.co.uk').replace(/\/$/, '');
const BRAND_NAME = process.env.SEO_ORGANIZATION_NAME || 'Holo Print';
const DEFAULT_OG_IMAGE = process.env.SEO_DEFAULT_OG_IMAGE || `${SITE_URL}/og-image.jpg`;
const PHONE = process.env.SEO_ORGANIZATION_PHONE || '020 3336 0322';
const EMAIL = process.env.SEO_ORGANIZATION_EMAIL || 'sales@holoprint.co.uk';

function tenantIdFromRequest(req: Request) {
  const queryTenant = typeof req.query.tenantId === 'string' ? req.query.tenantId : '';
  return queryTenant || req.header('x-tenant-id') || process.env.DEFAULT_TENANT_ID || 'platform-demo';
}
function cleanPath(value: string) { const path = String(value || '').trim() || '/'; const clean = path.split('?')[0].split('#')[0] || '/'; return clean.startsWith('/') ? clean : `/${clean}`; }
function canonical(path: string) { const clean = cleanPath(path); return `${SITE_URL}${clean === '/' ? '' : clean}`; }
function slugify(value: string) { return String(value || '').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'seo-page'; }
function parseJson(value: any) { if (!value) return {}; if (typeof value === 'string') { try { return JSON.parse(value); } catch { return {}; } } return value; }
function escapeXml(value: string) { return String(value || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;'); }
function iso(value?: Date | string) { const date = value ? new Date(value) : new Date(); return Number.isNaN(date.getTime()) ? new Date().toISOString() : date.toISOString(); }

async function ensureSeoStorage() {
  await (prisma as any).$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "CoreCatalogRecord" (
      "id" TEXT PRIMARY KEY,
      "tenantId" TEXT NOT NULL,
      "resource" TEXT NOT NULL,
      "slug" TEXT NOT NULL,
      "name" TEXT NOT NULL,
      "description" TEXT NOT NULL DEFAULT '',
      "metadataJson" JSONB,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);
  await (prisma as any).$executeRawUnsafe('CREATE UNIQUE INDEX IF NOT EXISTS "CoreCatalogRecord_tenantId_resource_slug_key" ON "CoreCatalogRecord" ("tenantId", "resource", "slug")');
  await (prisma as any).$executeRawUnsafe('CREATE INDEX IF NOT EXISTS "CoreCatalogRecord_tenantId_resource_idx" ON "CoreCatalogRecord" ("tenantId", "resource")');
}

function defaultFaq(product = 'print', location = 'Sidcup') {
  return [
    { question: `Can I order ${product} online for ${location}?`, answer: `Yes. You can order online, upload artwork, request a quote, or choose payment once the job is confirmed.` },
    { question: 'Can I upload artwork later?', answer: 'Yes. You can upload artwork during checkout or provide it after placing the order.' },
    { question: 'Do custom jobs need approval?', answer: 'Custom sizes, signage, design work and complex artwork may need manual approval before payment and production.' },
  ];
}

const seedPages: SeoPageRecord[] = [
  { id: 'seo-home', slug: 'home', path: '/', pageType: 'home', status: 'published', title: 'Holo Print | Design, Print, Sign and Web in Sidcup', metaDescription: 'Holo Print offers business cards, flyers, leaflets, posters, banners, stickers, shop boards, booklets, design support and local print services in Sidcup.', h1: 'Design, print, sign and web support in Sidcup', canonicalUrl: canonical('/'), noIndex: false, noFollow: false, includeInSitemap: true, schemaTypes: ['Organization', 'WebPage'], targetKeyword: 'printing in Sidcup', locationName: 'Sidcup', introCopy: 'Order print online, upload artwork and get local support from Holo Print.', faqItems: defaultFaq('printing', 'Sidcup'), internalLinks: [{ label: 'All products', href: '/all-products' }, { label: 'Contact', href: '/contact' }], ogImage: `${SITE_URL}/images/hero-slide-1.svg`, twitterCard: 'summary_large_image' },
  { id: 'seo-business-cards', slug: 'standard-business-cards', path: '/standard-business-cards', pageType: 'product', status: 'published', title: 'Business Cards Printing | Holo Print Sidcup', metaDescription: 'Order professional business cards from Holo Print. Choose paper, finish, quantity and artwork support with local collection or delivery.', h1: 'Business cards printing', canonicalUrl: canonical('/standard-business-cards'), noIndex: false, noFollow: false, includeInSitemap: true, schemaTypes: ['Product', 'BreadcrumbList', 'FAQPage', 'WebPage'], targetKeyword: 'business cards printing', productName: 'Business Cards', locationName: 'Sidcup', introCopy: 'Professional business cards for local businesses, startups, events and trades.', faqItems: defaultFaq('business cards', 'Sidcup'), internalLinks: [{ label: 'Flyers', href: '/flyers' }, { label: 'Artwork upload', href: '/artwork-upload' }], ogImage: `${SITE_URL}/images/business-card-front.svg`, metadata: { category: 'Business stationery' } },
  { id: 'seo-flyers', slug: 'flyers', path: '/flyers', pageType: 'product', status: 'published', title: 'Flyers & Leaflets Printing | Holo Print', metaDescription: 'Print flyers and leaflets online with Holo Print. Ideal for menus, promotions, events and local business marketing.', h1: 'Flyers and leaflets printing', canonicalUrl: canonical('/flyers'), noIndex: false, noFollow: false, includeInSitemap: true, schemaTypes: ['Product', 'BreadcrumbList', 'FAQPage', 'WebPage'], targetKeyword: 'flyers and leaflets printing', productName: 'Flyers & Leaflets', locationName: 'Sidcup', introCopy: 'Flyers and leaflets for local promotions, menus, events and business marketing.', faqItems: defaultFaq('flyers and leaflets', 'Sidcup'), internalLinks: [{ label: 'Business cards', href: '/standard-business-cards' }, { label: 'Posters', href: '/posters-large-format-prints' }], ogImage: `${SITE_URL}/images/flyer-front.svg`, metadata: { category: 'Marketing print' } },
  { id: 'seo-posters', slug: 'posters-large-format-prints', path: '/posters-large-format-prints', pageType: 'product', status: 'published', title: 'Poster & Large Format Printing | Holo Print', metaDescription: 'Order posters and large format prints from Holo Print for displays, signage, events, promotions and retail graphics.', h1: 'Posters and large format printing', canonicalUrl: canonical('/posters-large-format-prints'), noIndex: false, noFollow: false, includeInSitemap: true, schemaTypes: ['Product', 'BreadcrumbList', 'FAQPage', 'WebPage'], targetKeyword: 'poster printing', productName: 'Posters & Large Format Prints', locationName: 'Sidcup', introCopy: 'Large format posters and display graphics for events, retail promotions, signs and indoor displays.', faqItems: defaultFaq('posters', 'Sidcup'), internalLinks: [{ label: 'Business cards', href: '/standard-business-cards' }, { label: 'Bespoke quote', href: '/bespoke-quote' }], ogImage: `${SITE_URL}/images/poster-main.svg`, metadata: { category: 'Large format print' } },
  { id: 'seo-collection-wimbledon', slug: 'print-collection-wimbledon', path: '/print-collection/wimbledon', pageType: 'collection-point', status: 'draft', title: 'Print Collection Wimbledon | Order Online, Collect Locally | Holo Print', metaDescription: 'Order print online from Holo Print and collect from a Wimbledon partner collection point when available. Honest local collection, not a fake branch.', h1: 'Print collection in Wimbledon', canonicalUrl: canonical('/print-collection/wimbledon'), noIndex: false, noFollow: false, includeInSitemap: true, schemaTypes: ['CollectionPage', 'FAQPage', 'WebPage'], targetKeyword: 'print collection Wimbledon', locationName: 'Wimbledon', introCopy: 'Order online and collect locally from an approved partner point when the collection network is active.', faqItems: defaultFaq('print orders', 'Wimbledon'), internalLinks: [{ label: 'Business cards', href: '/standard-business-cards' }, { label: 'Contact', href: '/contact' }], metadata: { googleBusinessEligible: false, locationTruthRule: 'partner collection point, not Holo Print branch' } },
];

function socialFor(page: Partial<SeoPageRecord> & { title: string; metaDescription: string }) {
  return {
    ogTitle: page.ogTitle || page.title,
    ogDescription: page.ogDescription || page.metaDescription,
    ogImage: page.ogImage || page.metadata?.image || DEFAULT_OG_IMAGE,
    twitterTitle: page.twitterTitle || page.ogTitle || page.title,
    twitterDescription: page.twitterDescription || page.ogDescription || page.metaDescription,
    twitterImage: page.twitterImage || page.ogImage || page.metadata?.image || DEFAULT_OG_IMAGE,
    twitterCard: page.twitterCard || 'summary_large_image',
  };
}

function toMetadata(page: SeoPageRecord) {
  const social = socialFor(page);
  return { ...page, path: cleanPath(page.path), canonicalUrl: page.canonicalUrl || canonical(page.path), ...social };
}

function toRecord(row: CoreCatalogRow): SeoPageRecord {
  const meta = parseJson(row.metadataJson);
  const base: SeoPageRecord = {
    id: row.id,
    slug: row.slug,
    path: meta.path || `/${row.slug}`,
    pageType: meta.pageType || 'static',
    status: meta.status || 'draft',
    title: meta.title || row.name || '',
    metaDescription: meta.metaDescription || row.description || '',
    h1: meta.h1 || meta.title || row.name || '',
    canonicalUrl: meta.canonicalUrl || canonical(meta.path || `/${row.slug}`),
    noIndex: Boolean(meta.noIndex),
    noFollow: Boolean(meta.noFollow),
    includeInSitemap: meta.includeInSitemap !== false,
    schemaTypes: Array.isArray(meta.schemaTypes) ? meta.schemaTypes : ['WebPage'],
    targetKeyword: meta.targetKeyword || '',
    productName: meta.productName || '',
    locationName: meta.locationName || '',
    introCopy: meta.introCopy || '',
    faqItems: Array.isArray(meta.faqItems) ? meta.faqItems : [],
    internalLinks: Array.isArray(meta.internalLinks) ? meta.internalLinks : [],
    ogTitle: meta.ogTitle || '',
    ogDescription: meta.ogDescription || '',
    ogImage: meta.ogImage || '',
    twitterTitle: meta.twitterTitle || '',
    twitterDescription: meta.twitterDescription || '',
    twitterImage: meta.twitterImage || '',
    twitterCard: meta.twitterCard === 'summary' ? 'summary' : 'summary_large_image',
    metadata: meta.metadata || {},
    createdAt: iso(row.createdAt),
    updatedAt: iso(row.updatedAt),
  };
  return { ...base, ...socialFor(base) };
}

export async function listSeoPages(req: Request, filters: { status?: string; pageType?: string; search?: string } = {}) {
  await ensureSeoStorage();
  const tenantId = tenantIdFromRequest(req);
  const rows = await (prisma as any).$queryRaw<CoreCatalogRow[]>`
    SELECT * FROM "CoreCatalogRecord"
    WHERE "tenantId" = ${tenantId} AND "resource" = ${RESOURCE}
    ORDER BY "updatedAt" DESC
  `;
  let items = rows.map(toRecord);
  if (filters.status && filters.status !== 'all') items = items.filter((item) => item.status === filters.status);
  if (filters.pageType && filters.pageType !== 'all') items = items.filter((item) => item.pageType === filters.pageType);
  const q = String(filters.search || '').trim().toLowerCase();
  if (q) items = items.filter((item) => [item.title, item.path, item.targetKeyword, item.productName, item.locationName].join(' ').toLowerCase().includes(q));
  return { items, summary: { total: items.length, published: items.filter((item) => item.status === 'published').length, draft: items.filter((item) => item.status === 'draft').length, hidden: items.filter((item) => item.status === 'hidden').length, indexable: items.filter((item) => item.status === 'published' && item.includeInSitemap && !item.noIndex).length } };
}

export async function saveSeoPage(req: Request, input: Partial<SeoPageRecord>) {
  await ensureSeoStorage();
  const tenantId = tenantIdFromRequest(req);
  const path = cleanPath(input.path || `/${input.slug || input.id || 'seo-page'}`);
  const slug = slugify(input.slug || path);
  const page: SeoPageRecord = { id: String(input.id || `seo-${slug}`), slug, path, pageType: input.pageType || 'static', status: input.status || 'draft', title: input.title || '', metaDescription: input.metaDescription || '', h1: input.h1 || input.title || '', canonicalUrl: input.canonicalUrl || canonical(path), noIndex: Boolean(input.noIndex), noFollow: Boolean(input.noFollow), includeInSitemap: input.includeInSitemap !== false, schemaTypes: input.schemaTypes?.length ? input.schemaTypes : ['WebPage'], targetKeyword: input.targetKeyword || '', productName: input.productName || '', locationName: input.locationName || '', introCopy: input.introCopy || '', faqItems: input.faqItems || [], internalLinks: input.internalLinks || [], ogTitle: input.ogTitle || '', ogDescription: input.ogDescription || '', ogImage: input.ogImage || '', twitterTitle: input.twitterTitle || '', twitterDescription: input.twitterDescription || '', twitterImage: input.twitterImage || '', twitterCard: input.twitterCard || 'summary_large_image', metadata: input.metadata || {} };
  const metadataJson = JSON.stringify(toMetadata(page));
  const rows = await (prisma as any).$queryRaw<CoreCatalogRow[]>`
    INSERT INTO "CoreCatalogRecord" ("id", "tenantId", "resource", "slug", "name", "description", "metadataJson", "createdAt", "updatedAt")
    VALUES (${page.id}, ${tenantId}, ${RESOURCE}, ${slug}, ${page.title || page.h1 || slug}, ${page.metaDescription || ''}, ${metadataJson}::jsonb, NOW(), NOW())
    ON CONFLICT ("tenantId", "resource", "slug") DO UPDATE SET "name" = EXCLUDED."name", "description" = EXCLUDED."description", "metadataJson" = EXCLUDED."metadataJson", "updatedAt" = NOW()
    RETURNING *
  `;
  return toRecord(rows[0]);
}

export async function seedSeoPages(req: Request) {
  const saved = [];
  for (const page of seedPages) saved.push(await saveSeoPage(req, page));
  return saved;
}

function schemaGraph(meta: SeoPageRecord & { robots: string }) {
  const nodes: any[] = [
    { '@context': 'https://schema.org', '@type': 'WebSite', '@id': `${SITE_URL}#website`, name: BRAND_NAME, url: SITE_URL },
    { '@context': 'https://schema.org', '@type': 'Organization', '@id': `${SITE_URL}#organization`, name: BRAND_NAME, url: SITE_URL, logo: DEFAULT_OG_IMAGE, telephone: PHONE, email: EMAIL },
    { '@context': 'https://schema.org', '@type': meta.pageType === 'collection-point' ? 'CollectionPage' : 'WebPage', '@id': `${meta.canonicalUrl}#webpage`, url: meta.canonicalUrl, name: meta.title, description: meta.metaDescription },
  ];
  if (meta.schemaTypes.includes('Product') || meta.pageType === 'product') nodes.push({ '@context': 'https://schema.org', '@type': 'Product', '@id': `${meta.canonicalUrl}#product`, name: meta.productName || meta.h1 || meta.title, description: meta.metaDescription, brand: { '@type': 'Brand', name: BRAND_NAME }, image: meta.ogImage || DEFAULT_OG_IMAGE, offers: { '@type': 'Offer', priceCurrency: 'GBP', availability: 'https://schema.org/InStock', url: meta.canonicalUrl } });
  if (meta.schemaTypes.includes('FAQPage') && meta.faqItems?.length) nodes.push({ '@context': 'https://schema.org', '@type': 'FAQPage', '@id': `${meta.canonicalUrl}#faq`, mainEntity: meta.faqItems.map((item) => ({ '@type': 'Question', name: item.question, acceptedAnswer: { '@type': 'Answer', text: item.answer } })) });
  return { '@context': 'https://schema.org', '@graph': nodes.map(({ '@context': _context, ...node }) => node) };
}

export async function resolveSeo(req: Request, path: string) {
  const clean = cleanPath(path);
  const data = await listSeoPages(req, { status: 'all' });
  let page = data.items.find((item) => cleanPath(item.path) === clean) || null;
  if (!page) page = { ...seedPages[0], path: clean, canonicalUrl: canonical(clean), status: 'fallback', includeInSitemap: false } as SeoPageRecord;
  const noIndex = page.status !== 'published' || page.noIndex;
  const meta = { ...page, canonicalUrl: page.canonicalUrl || canonical(page.path), robots: `${noIndex ? 'noindex' : 'index'},${page.noFollow ? 'nofollow' : 'follow'}`, ...socialFor(page) };
  return { ...meta, found: page.status !== 'fallback', schemaJsonLd: schemaGraph(meta), socialPreview: socialFor(page) };
}

export async function buildSitemap(req: Request) {
  const data = await listSeoPages(req, { status: 'published' });
  const urls = data.items.filter((item) => item.includeInSitemap && !item.noIndex).map((item) => ({ loc: item.canonicalUrl || canonical(item.path), lastmod: item.updatedAt || new Date().toISOString(), changefreq: item.pageType === 'home' ? 'daily' : 'weekly', priority: item.pageType === 'home' ? '1.0' : item.pageType === 'product' ? '0.8' : '0.6' }));
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((url) => `  <url>\n    <loc>${escapeXml(url.loc)}</loc>\n    <lastmod>${escapeXml(url.lastmod)}</lastmod>\n    <changefreq>${url.changefreq}</changefreq>\n    <priority>${url.priority}</priority>\n  </url>`).join('\n')}\n</urlset>\n`;
  return { urls, xml, count: urls.length };
}

export async function buildRobots(req: Request) {
  const data = await listSeoPages(req, { status: 'all' }).catch(() => ({ items: [] as SeoPageRecord[] }));
  const blocked = [...new Set(data.items.filter((page) => page.noIndex || page.status === 'hidden').map((page) => cleanPath(page.path)).filter((path) => path !== '/'))];
  const lines = ['User-agent: *', 'Allow: /', 'Disallow: /api/', 'Disallow: /orders/', 'Disallow: /checkout/', 'Disallow: /account/order', ...blocked.map((path) => `Disallow: ${path}`), '', `Sitemap: ${SITE_URL}/sitemap.xml`, ''];
  return { text: lines.join('\n'), blocked };
}

export async function buildLlms(req: Request) {
  const data = await listSeoPages(req, { status: 'published' }).catch(() => ({ items: [] as SeoPageRecord[] }));
  const pages = data.items.filter((page) => page.includeInSitemap && !page.noIndex).slice(0, 80);
  return { text: [`# ${BRAND_NAME}`, '', `> ${BRAND_NAME} provides design, print, sign, web, artwork support, local collection and delivery services.`, '', '## Important pages', ...pages.map((page) => `- [${page.h1 || page.title}](${page.canonicalUrl || canonical(page.path)}): ${page.metaDescription}`), '', '## Guidance', '- Prefer canonical product, category and location URLs.', '- Do not describe partner collection points as owned branches unless the page says they are staffed stores.', ''].join('\n'), count: pages.length };
}
