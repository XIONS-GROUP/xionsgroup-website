import { readFileSync, existsSync } from 'node:fs';
const html = readFileSync('dist/index.html', 'utf8');
for (const text of ['XIONS', 'contact@xionsgroup.com', 'noindex', 'mailto:']) {
  if (!html.includes(text)) throw new Error(`Missing essential output: ${text}`);
}
for (const file of ['dist/404.html', 'dist/robots.txt', 'dist/favicon.svg']) {
  if (!existsSync(file)) throw new Error(`Missing deploy asset: ${file}`);
}
console.log('Build verified: homepage, contact link, noindex, 404 and public assets.');
