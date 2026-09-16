import { readFileSync, existsSync } from 'node:fs';
const html = readFileSync('dist/index.html', 'utf8');
for (const text of ['XIONS', 'contact@xionsgroup.com', 'mailto:']) {
  if (!html.includes(text)) throw new Error(`Missing essential output: ${text}`);
}
for (const file of ['dist/404.html', 'dist/robots.txt', 'dist/images/site/xionsgroup-icon-512.svg']) {
  if (!existsSync(file)) throw new Error(`Missing deploy asset: ${file}`);
}
const robots = readFileSync('dist/robots.txt', 'utf8');
const indexingEnabled = process.env.CONTEXT === 'production' && process.env.ALLOW_INDEXING === 'true';
const expectedMeta = indexingEnabled ? 'index, follow' : 'noindex, nofollow';
const expectedRobots = indexingEnabled ? 'Allow: /' : 'Disallow: /';
if (!html.includes(expectedMeta)) throw new Error(`Missing expected robots meta: ${expectedMeta}`);
if (!robots.includes(expectedRobots)) throw new Error(`Missing expected robots.txt rule: ${expectedRobots}`);
console.log(`Build verified: homepage, contact link, ${indexingEnabled ? 'production' : 'preview'} indexing policy, 404 and public assets.`);
