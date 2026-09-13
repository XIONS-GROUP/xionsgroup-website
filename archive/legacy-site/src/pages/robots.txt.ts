import type { APIRoute } from 'astro';
import { allowIndexing } from '../config/indexing';

export const GET: APIRoute = () => {
  const body = allowIndexing
    ? 'User-agent: *\nAllow: /\n'
    : 'User-agent: *\nDisallow: /\n';

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
