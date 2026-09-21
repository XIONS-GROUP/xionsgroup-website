import { origin } from '../i18n/routes';
// Use an image that exists on the preview; canonical URLs remain official.
export const shareImageOrigin = process.env.CONTEXT && process.env.CONTEXT !== 'production' && process.env.DEPLOY_PRIME_URL
  ? new URL(process.env.DEPLOY_PRIME_URL).origin
  : origin;
