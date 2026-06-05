import type { Request, Response } from 'express';
import { buildLlms, buildRobots, buildSitemap, listSeoPages, resolveSeo, saveSeoPage, seedSeoPages } from './seo.service';

function ok(res: Response, data: unknown) {
  res.json({ success: true, data });
}

function fail(res: Response, error: unknown, fallback = 'SEO request failed') {
  console.error('SEO_ROUTE_FAILED', error);
  res.status(500).json({ success: false, error: { message: error instanceof Error ? error.message : fallback } });
}

export async function getSeoPages(req: Request, res: Response): Promise<void> {
  try {
    ok(res, await listSeoPages(req, {
      status: typeof req.query.status === 'string' ? req.query.status : 'all',
      pageType: typeof req.query.pageType === 'string' ? req.query.pageType : 'all',
      search: typeof req.query.search === 'string' ? req.query.search : '',
    }));
  } catch (error) {
    fail(res, error, 'SEO pages failed to load');
  }
}

export async function postSeoPage(req: Request, res: Response): Promise<void> {
  try {
    if (String(req.body?.action || '') === 'seed') {
      const items = await seedSeoPages(req);
      ok(res, { items, count: items.length, action: 'seed' });
      return;
    }
    ok(res, { item: await saveSeoPage(req, req.body || {}) });
  } catch (error) {
    fail(res, error, 'SEO page failed to save');
  }
}

export async function getSeoResolve(req: Request, res: Response): Promise<void> {
  try {
    const path = typeof req.query.path === 'string' ? req.query.path : typeof req.query.pathname === 'string' ? req.query.pathname : '/';
    const data = await resolveSeo(req, path);
    res.setHeader('Link', `<${data.canonicalUrl}>; rel="canonical"`);
    res.setHeader('X-Robots-Tag', data.robots);
    ok(res, data);
  } catch (error) {
    fail(res, error, 'SEO metadata failed to resolve');
  }
}

export async function getSitemapJson(req: Request, res: Response): Promise<void> {
  try {
    const sitemap = await buildSitemap(req);
    ok(res, { count: sitemap.count, urls: sitemap.urls });
  } catch (error) {
    fail(res, error, 'Sitemap failed to build');
  }
}

export async function getSitemapXml(req: Request, res: Response): Promise<void> {
  try {
    const sitemap = await buildSitemap(req);
    res.type('application/xml').send(sitemap.xml);
  } catch (error) {
    console.error('SEO_SITEMAP_FAILED', error);
    res.type('application/xml').send('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>\n');
  }
}

export async function getRobotsTxt(req: Request, res: Response): Promise<void> {
  try {
    const robots = await buildRobots(req);
    res.type('text/plain').send(robots.text);
  } catch (error) {
    console.error('SEO_ROBOTS_FAILED', error);
    res.type('text/plain').send('User-agent: *\nAllow: /\nDisallow: /api/\nSitemap: https://holoprint.co.uk/sitemap.xml\n');
  }
}

export async function getLlmsTxt(req: Request, res: Response): Promise<void> {
  try {
    const llms = await buildLlms(req);
    res.type('text/plain').send(llms.text);
  } catch (error) {
    console.error('SEO_LLMS_FAILED', error);
    res.type('text/plain').send('# Holo Print\n\n> Design, print, sign and web support.\n');
  }
}
