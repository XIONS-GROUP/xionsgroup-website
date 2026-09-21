import type { APIRoute } from 'astro';
import { origin, routes } from '../i18n/routes';
export const GET: APIRoute = () => {
  const entries = routes.filter(([fr]) => !['merci', '404'].includes(fr)).flatMap(([fr, en]) => {
    const paths = {fr:`${origin}/fr/${fr ? `${fr}/` : ''}`,en:`${origin}/en/${en ? `${en}/` : ''}`};
    return Object.values(paths).map(url => `<url><loc>${url}</loc><xhtml:link rel="alternate" hreflang="fr" href="${paths.fr}"/><xhtml:link rel="alternate" hreflang="en" href="${paths.en}"/><xhtml:link rel="alternate" hreflang="x-default" href="${paths.fr}"/></url>`);
  });
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">${entries.join('')}</urlset>`, {headers:{'Content-Type':'application/xml; charset=utf-8'}});
};
