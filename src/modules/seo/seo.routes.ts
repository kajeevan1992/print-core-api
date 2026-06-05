import { Router } from 'express';
import { getLlmsTxt, getRobotsTxt, getSeoPages, getSeoResolve, getSitemapJson, getSitemapXml, postSeoPage } from './seo.controller';

export const seoRouter = Router();

seoRouter.get('/pages', getSeoPages);
seoRouter.post('/pages', postSeoPage);
seoRouter.get('/resolve', getSeoResolve);
seoRouter.get('/sitemap', getSitemapJson);
seoRouter.get('/sitemap.xml', getSitemapXml);
seoRouter.get('/robots.txt', getRobotsTxt);
seoRouter.get('/llms.txt', getLlmsTxt);
