import { defineMiddleware } from 'astro:middleware';
import { parse, serialize, type DefaultTreeAdapterMap } from 'parse5';
import { translate } from './i18n/en';
import { localizedPath, localeFor } from './i18n/routes';

// Runs during Astro prerendering (and local dev), never in the visitor's browser.
// Parse the document so copy changes cannot alter scripts, styles or form values.
export const onRequest = defineMiddleware(async ({ url }, next) => {
  const response = await next();
  if (localeFor(url.pathname) !== 'en' || !response.headers.get('content-type')?.includes('text/html')) return response;
  const document = parse(await response.text());
  function visit(node: DefaultTreeAdapterMap['node']) {
    if ('tagName' in node && ['script', 'style', 'svg'].includes(node.tagName)) return;
    if (node.nodeName === '#text' && 'value' in node) node.value = translate(node.value);
    if ('attrs' in node) {
      const languageLink = node.attrs.some(a => a.name === 'data-language');
      // Keep the submitted category stable across languages and notification formats.
      if (node.tagName === 'option' && !node.attrs.some(a => a.name === 'value')) {
        const value = node.childNodes.map(n => 'value' in n ? n.value : '').join('');
        node.attrs.push({name:'value', value});
      }
      for (const attr of node.attrs) {
        if (['alt', 'aria-label', 'placeholder', 'title', 'content'].includes(attr.name)) attr.value = translate(attr.value);
        if (['href', 'action'].includes(attr.name) && /^\/fr(?:\/|$)/.test(attr.value) && !languageLink) attr.value = localizedPath(attr.value, 'en');
        if (attr.name === 'href' && attr.value.startsWith('mailto:') && attr.value.includes('Candidature%20spontan')) attr.value = attr.value.split('?')[0] + '?subject=Speculative%20application';
      }
    }
    if ('childNodes' in node) node.childNodes.forEach(visit);
  }
  visit(document);
  const headers = new Headers(response.headers);
  headers.delete('content-length');
  return new Response(serialize(document), {status:response.status, headers});
});
