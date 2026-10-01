import { origin } from '../i18n/routes';
// Use an image that exists on the preview; canonical URLs remain official.
export const shareImageOrigin = process.env.CONTEXT && process.env.CONTEXT !== 'production' && process.env.DEPLOY_PRIME_URL
  ? new URL(process.env.DEPLOY_PRIME_URL).origin
  : origin;

// Short names for the BreadcrumbList. The page <title> is too long for a crumb, and the URL
// slug is not a label, so each route carries its own. Keyed on the French slug, which is the
// canonical key everywhere in routes.ts; the English side comes from the translation table.
export const breadcrumbLabels = {
  'groupe': 'Le groupe',
  'marques': 'Nos marques',
  'marques/lentropiste': 'L’Entropiste',
  'marques/betenoir': 'Betenoir',
  'marques/sunlution': 'Sunlution',
  'marques/masqly': 'Masqly',
  'engagements': 'Engagements',
  'presse': 'Presse & rayonnement',
  'carrieres': 'Carrières',
  'contact': 'Contact',
  'merci': 'Merci',
  'mentions-legales': 'Mentions légales',
  'conditions-generales': 'Conditions d’utilisation',
  'politique-confidentialite': 'Confidentialité',
  'politique-cookies': 'Cookies',
} as const;
