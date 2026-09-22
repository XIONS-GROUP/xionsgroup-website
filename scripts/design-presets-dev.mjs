import { readdir, readFile, mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

// Dev-only stores for the design toolbox: saved parameter presets and in-place copy edits.
// Both live in a Vite `configureServer` hook, so nothing here is bundled, prerendered or
// deployed. They are review material, not site defaults, so they land in the ignored
// local-materials folder.
const STORES = {
  '/__hero-presets': { dir: path.resolve('local-materials/hero-presets'), key: 'presets', item: 'preset' },
  '/__text-edits': { dir: path.resolve('local-materials/text-edits'), key: 'edits', item: 'edit' }
};
const MAX_BODY = 512 * 1024;

function safeName(value) {
  const cleaned = String(value ?? '').trim().replace(/[^\p{Letter}\p{Number} _-]+/gu, '').replace(/\s+/g, '-').slice(0, 40);
  return cleaned || 'sans-nom';
}

async function list(dir) {
  let names = [];
  try { names = await readdir(dir); } catch { return []; }
  const records = [];
  for (const name of names.filter(n => n.endsWith('.json')).sort().reverse()) {
    try { records.push({ file: name, ...JSON.parse(await readFile(path.join(dir, name), 'utf8')) }); } catch { /* Skip unreadable records. */ }
  }
  return records;
}

async function save(dir, payload) {
  const name = safeName(payload?.name);
  const stamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const file = `${stamp}-${name}.json`;
  const target = path.join(dir, file);
  // The sanitiser already removes separators and dots; this refuses anything that still escapes.
  if (path.dirname(target) !== dir) throw new Error('Invalid name');
  await mkdir(dir, { recursive: true });
  const { name: _ignored, ...rest } = payload ?? {};
  const record = { name, savedAt: new Date().toISOString(), ...rest };
  await writeFile(target, JSON.stringify(record, null, 2) + '\n', 'utf8');
  return { file, ...record };
}

export function designPresets() {
  return {
    name: 'xions-design-presets',
    apply: 'serve',
    configureServer(server) {
      for (const [route, store] of Object.entries(STORES)) {
        server.middlewares.use(route, async (request, response) => {
          const send = (status, body) => {
            response.statusCode = status;
            response.setHeader('content-type', 'application/json; charset=utf-8');
            response.end(JSON.stringify(body));
          };
          try {
            if (request.method === 'GET') return send(200, { [store.key]: await list(store.dir) });
            if (request.method !== 'POST') return send(405, { error: 'Method not allowed' });
            let raw = '';
            for await (const chunk of request) {
              raw += chunk;
              if (raw.length > MAX_BODY) return send(413, { error: 'Payload too large' });
            }
            send(200, { [store.item]: await save(store.dir, JSON.parse(raw || '{}')) });
          } catch (error) {
            send(400, { error: error instanceof Error ? error.message : 'Bad request' });
          }
        });
      }
    }
  };
}
