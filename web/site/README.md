# XIONS GROUP website

Astro pre-launch holding page and deployment foundation. The full corporate website is not yet implemented.

## Local use

Use the Node version in `.nvmrc`. Run `npm ci`, then `npm run dev`. Run `npm run build` before publishing; `npm run preview` previews the built output.

## Content

French copy is in `src/content/home.fr.json`; the current visual homepage is `src/pages/index.astro`. Website-only media belongs in `public/images` or `src/assets/images`; originals stay outside the repository. Contact currently opens an email client; no form service or CMS is configured. Superseded homepage studies are kept in `archive/pages` and are not deployed.

## Deployment

Netlify build command: `npm run build`; publish directory: `dist`; base directory: repository root. Production branch: `main`; Branch Deploys are enabled for `dev`, and Deploy Previews can be used for pull requests.

Use feature branches and PRs into `dev`, then review `dev → main` releases. CI checks the build. Remote branch protection must be configured separately. Do not force-push shared branches.

The pre-launch site intentionally blocks indexing in HTML and robots.txt. This is not access protection. At the public launch, set `ALLOW_INDEXING = "true"` only in `[context.production.environment]` in `netlify.toml`; branch deploys and pull-request previews remain excluded from search results.
