import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const htmlFiles = [];
const walk = (dir) => {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) walk(path);
    else if (name.endsWith('.html')) htmlFiles.push(path);
  }
};
walk('dist');

const missing = new Set();
for (const file of htmlFiles) {
  const html = readFileSync(file, 'utf8');
  for (const match of html.matchAll(/(?:href|action)="([^"]+)"/g)) {
    const raw = match[1];
    if (!raw.startsWith('/') || raw.startsWith('//')) continue;
    const pathname = raw.split(/[?#]/)[0];
    if (!pathname) continue;
    const assetPath = join('dist', pathname);
    const pagePath = join('dist', pathname, 'index.html');
    const htmlPath = `${assetPath}.html`;
    if (!existsSync(assetPath) && !existsSync(pagePath) && !existsSync(htmlPath)) missing.add(`${file} → ${raw}`);
  }
}

if (missing.size) throw new Error(`Broken internal links:\n${[...missing].join('\n')}`);
console.log(`Internal links verified across ${htmlFiles.length} HTML files.`);
