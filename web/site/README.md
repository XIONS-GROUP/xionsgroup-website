# XIONS GROUP website

Astro pre-launch holding page and deployment foundation. The full corporate website is not yet implemented.

## Local use

Use the Node version in `.nvmrc`. Run `npm ci`, then `npm run dev`. Run `npm run build` before publishing; `npm run preview` previews the built output.

## Content

French copy is in `src/content/home.fr.json`. The homepage uses `src/layouts/Base.astro`. Website-only media belongs in `public/images` or `src/assets/images`; originals stay outside the repository. Contact currently opens an email client; no form service or CMS is configured.

## Deployment

Netlify build command: `npm run build`; publish directory: `dist`; base directory: repository root. Production branch: `main`; explicitly enable Branch Deploys for `dev` and Deploy Previews for PRs. GitHub/Netlify remote links are not configured until company ownership is confirmed.

Use feature branches and PRs into `dev`, then review `dev → main` releases. CI checks the build. Remote branch protection must be configured separately. Do not force-push shared branches.

The pre-launch site intentionally blocks indexing in HTML, robots.txt and Netlify response headers. This is NOT access protection. When launching, remove the production indexing restrictions while preserving preview noindex behavior. Do not connect the domain before reviewing `docs/domain-cutover.md`.
