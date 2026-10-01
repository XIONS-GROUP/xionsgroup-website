// Turns the built site into a copy that opens by double-clicking, with no server running.
// The real build uses root-absolute asset paths (/_astro/…, /images/…) and extensionless page
// links, both of which break under file://. This rewrites them to relative paths. Output is
// review material, so it lands in the ignored local-materials folder.
import { cp, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';

const SOURCE = path.resolve('dist');
const TARGET = path.resolve('local-materials/portable-preview');

async function htmlFiles(dir, out = []) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) await htmlFiles(full, out);
    else if (entry.name.endsWith('.html')) out.push(full);
  }
  return out;
}

function rewrite(html, prefix) {
  return html.replace(/(href|src)="\/([^"/][^"]*)?"/g, (whole, attr, rest = '') => {
    const [pathname] = rest.split('#');
    if (!pathname) return `${attr}="${prefix}index.html"`;
    // Query strings are cache-busters; file:// treats them as part of the name, so drop them.
    const clean = pathname.split('?')[0];
    const anchor = rest.includes('#') ? `#${rest.split('#').slice(1).join('#')}` : '';
    const isFile = path.extname(clean) !== '';
    const target = isFile ? clean : `${clean.replace(/\/$/, '')}/index.html`;
    return `${attr}="${prefix}${target}${anchor}"`;
  });
}

await rm(TARGET, { recursive: true, force: true });
await cp(SOURCE, TARGET, { recursive: true });
const pages = await htmlFiles(TARGET);
for (const file of pages) {
  const depth = path.relative(TARGET, file).split(path.sep).length - 1;
  const prefix = '../'.repeat(depth);
  await writeFile(file, rewrite(await readFile(file, 'utf8'), prefix), 'utf8');
}
console.log(`Portable preview written to ${TARGET} (${pages.length} pages).`);
console.log(`Open: ${path.join(TARGET, 'fr', 'index.html')}`);
