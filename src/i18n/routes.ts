export const origin = 'https://www.xionsgroup.com';
export const routes = [
  ['', ''], ['groupe', 'group'], ['marques', 'brands'],
  ...['lentropiste', 'betenoir', 'sunlution', 'masqly'].map(slug => [`marques/${slug}`, `brands/${slug}`]),
  ['engagements', 'commitments'], ['presse', 'press'], ['carrieres', 'careers'],
  ['contact', 'contact'], ['merci', 'thank-you'], ['mentions-legales', 'legal-notice'],
  ['conditions-generales', 'terms'], ['politique-confidentialite', 'privacy'],
  ['politique-cookies', 'cookies'], ['404', '404'],
] as const;
export type Locale = 'fr' | 'en';
export function localeFor(path: string): Locale { return path.startsWith('/en/') || path === '/en' ? 'en' : 'fr'; }
export function routeFor(path: string) {
  const locale = localeFor(path);
  const slug = path.replace(/^\/(fr|en)\/?/, '').replace(/^\//, '').replace(/\/$/, '');
  return routes.find(row => row[locale === 'fr' ? 0 : 1] === (path === '/' ? '' : slug));
}
export function localizedPath(path: string, locale: Locale) {
  const url = new URL(path, origin);
  const row = routeFor(url.pathname);
  if (!row) return `/${locale}/`;
  const slug = row[locale === 'fr' ? 0 : 1];
  return `/${locale}/${slug ? `${slug}/` : ''}${url.search}${url.hash}`;
}
export function isPublicPage(path: string) {
  const row = routeFor(path);
  return !!row && !['merci', '404'].includes(row[0]);
}
