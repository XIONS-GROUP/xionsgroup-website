# XIONS GROUP website

Astro corporate website for XIONS GROUP. The `dev` branch contains the French and English site; `main` remains the pre-launch holding page until the approved release.

French and English pages share templates. Translation files live in `src/i18n/`; `npm run build` checks translation coverage, language links, SEO and contact field compatibility. See [bilingual and SEO maintenance](docs/bilingual-seo.md).

## Local use

Use the Node version in `.nvmrc`. Run `npm ci`, then `npm run dev`. Run `npm run build` before publishing; `npm run preview` previews the built output.

## Content

French source copy is documented in `content/home.fr.json`. Shared brand content lives in `src/data/brands.ts`; page-specific copy lives with its route in `src/pages/fr/`. Website-only media belongs in `public/images` or `src/assets/images`; originals stay outside the repository. Company source documents stay in the ignored `local-materials/` directory. The contact page uses Netlify Forms; no CMS is configured. Superseded code is kept in `archive/` and is not deployed.

## Deployment

Netlify build command: `npm run build`; publish directory: `dist`; base directory: repository root. Production branch: `main`; Branch Deploys are enabled for `dev`, and Deploy Previews can be used for pull requests.

Use feature branches and PRs into `dev`, then review `dev → main` releases. CI checks the build. Remote branch protection must be configured separately. Do not force-push shared branches.

The pre-launch site intentionally blocks indexing in HTML and robots.txt. This is not access protection. At the public launch, set `ALLOW_INDEXING = "true"` only in `[context.production.environment]` in `netlify.toml`; branch deploys and pull-request previews remain excluded from search results.
