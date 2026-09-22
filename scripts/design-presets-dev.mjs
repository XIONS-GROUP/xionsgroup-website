import { readdir, readFile, mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

// Dev-only preset store for the design toolbox. It lives in a Vite `configureServer` hook,
// so nothing here is bundled, prerendered or deployed. Presets are review values, not site
// defaults, so they land in the ignored local-materials folder.
const ROUTE = '/__hero-presets';
const DIR = path.resolve('local-materials/hero-presets');
const MAX_BODY = 64 * 1024;

function safeName(value) {
  const cleaned = String(value ?? '').trim().replace(/[^\p{Letter}\p{Number} _-]+/gu, '').replace(/\s+/g, '-').slice(0, 40);
  return cleaned || 'preset';
}

async function list() {
  let names = [];
  try { names = await readdir(DIR); } catch { return []; }
  const presets = [];
  for (const name of names.filter(n => n.endsWith('.json')).sort().reverse()) {
    try { presets.push({ file: name, ...JSON.parse(await readFile(path.join(DIR, name), 'utf8')) }); } catch { /* Skip unreadable presets. */ }
  }
  return presets;
}

async function save(payload) {
  const name = safeName(payload?.name);
  const stamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const file = `${stamp}-${name}.json`;
  const target = path.join(DIR, file);
  // The sanitiser already removes separators and dots; this refuses anything that still escapes.
  if (path.dirname(target) !== DIR) throw new Error('Invalid preset name');
  await mkdir(DIR, { recursive: true });
  const record = { name, savedAt: new Date().toISOString(), settings: payload?.settings ?? {} };
  await writeFile(target, JSON.stringify(record, null, 2) + '\n', 'utf8');
  return { file, ...record };
}

export function designPresets() {
  return {
    name: 'xions-design-presets',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use(ROUTE, async (request, response) => {
        const send = (status, body) => {
          response.statusCode = status;
          response.setHeader('content-type', 'application/json; charset=utf-8');
          response.end(JSON.stringify(body));
        };
        try {
          if (request.method === 'GET') return send(200, { presets: await list() });
          if (request.method !== 'POST') return send(405, { error: 'Method not allowed' });
          let raw = '';
          for await (const chunk of request) {
            raw += chunk;
            if (raw.length > MAX_BODY) return send(413, { error: 'Preset too large' });
          }
          send(200, { preset: await save(JSON.parse(raw || '{}')) });
        } catch (error) {
          send(400, { error: error instanceof Error ? error.message : 'Bad request' });
        }
      });
    }
  };
}
