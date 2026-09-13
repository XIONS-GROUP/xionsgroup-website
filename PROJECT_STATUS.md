# XIONS GROUP Website — Project Status

Last updated: 2026-09-13

## Deployment chain

- GitHub repository: `XIONS-GROUP/xionsgroup-website`
- Development branch: `dev`
- Netlify branch preview: `https://dev--xionsgroup.netlify.app`
- Production branch: `main`
- Production domain: `https://xionsgroup.com`
- Netlify build: `npm run build`
- Netlify publish directory: `dist`
- Netlify base directory: repository root

Pushing `dev` triggers the branch preview. Merging `dev` into `main` triggers the production deployment. Pull requests can use Netlify Deploy Previews.

## Canonical local structure

- `src/pages/` — deployed routes
- `src/components/` — reusable interface components
- `src/styles/` — shared styles
- `public/` — deployable static assets
- `content/` — editable source copy and content records
- `archive/pages/` — retained homepage studies, excluded from builds
- `archive/legacy-site/` — retained duplicate project, excluded from builds

The repository root is the only development and deployment entry point. Run all npm and Netlify commands from this directory.

## Current website state

- The `dev` branch contains the white editorial homepage and mega menu.
- The `main` branch still contains the approved pre-launch logo holding page.
- DNS and TLS for `xionsgroup.com` are active through Netlify.
- Preview builds block search indexing.
- Production indexing remains disabled until `ALLOW_INDEXING` is enabled in the final launch pull request.
- Legacy homepage variants no longer create public Astro routes.

## Validation

- Local Astro build passes.
- Production indexing and preview indexing modes are both build-tested.
- Netlify receives GitHub commit references for automatic `dev` deployments.

## Next implementation work

- Replace placeholder imagery with approved brand assets.
- Build the linked French subpages and legal pages; current menu links are placeholders.
- Connect structured copy to reusable page components or a CMS if browser-based editing is required.
- Add and test the contact form.
- Review responsive behavior and accessibility before the `dev` to `main` release.
