import type { brands } from './brands';
type BrandSlug = (typeof brands)[number]['slug'];
type Logo = { src: string; width: number };
// Approved artwork belongs in public/images/brands/<slug>/.
// Null renders a brand name, never an invented brand identity.
export const brandLogos: Record<BrandSlug, Logo | null> = {
  lentropiste: null,
  betenoir: null,
  sunlution: null,
  masqly: null,
};
