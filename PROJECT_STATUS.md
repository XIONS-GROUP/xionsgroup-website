# XIONS GROUP Website — Project Status

Last updated: 2026-09-16

## Deployment chain

- GitHub repository: `XIONS-GROUP/xionsgroup-website`
- Development branch: `dev`
- Netlify branch preview: `https://dev--xionsgroup.netlify.app`
- Production branch: `main`
- Production domain: `https://www.xionsgroup.com`
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
- `docs/` — supporting and archived project documentation
- `local-materials/` — ignored business source files, kept out of the public repository
- `archive/` — retained code studies and the duplicate project, excluded from builds

The repository root is the only development and deployment entry point. Run all npm and Netlify commands from this directory.

## Current website state

- The `dev` branch contains the complete French multi-page site and the new luxury editorial design system.
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

### Visual planning update — 2026-09-16

- `src/data/visuals.json` is the source of truth for 28 named visual assets, including one optional Betenoir teaser.
- Home uses separate desktop and mobile cover compositions; body photography uses 3:2 and 4:5 frames. Logos, social cover and icon use dedicated formats.
- Dev renders labeled image placeholders; `/fr/visual-plan` lists placements and sizes. Production builds omit empty placeholders and the review route.
- Brand pages share one image-led template. Presse follows the corrected source copy: seven event galleries and three communication galleries, pending actual captions and photography. Home restores six existing event marks.
- Mobile navigation fills the viewport beneath the header, hides Groupe sublinks, and shows all four brands. Navigation surfaces share the same translucent white treatment; desktop all-brands link is separate beneath the brands.
- Content and positioning review: ignored `local-materials/website-content-review-2026-09-16.md`.
- The user's checklist now lives in ignored `local-materials/launch-content-and-visual-checklist.md`; the older copy is backed up under `local-materials/visual-kit/`.
- `node scripts/generate-visual-kit.mjs` generates the checklist, CSV, named SVG groups and Illustrator artboard script from the manifest. Affinity native artboards are not claimed; desktop import still needs verification.
- Home currently uses a single desktop/mobile pair. Additional carousel images and accessible playback controls are deferred until the first composition is approved.
- Dev and production builds/link checks pass. Responsive previews checked at approximately 390×844, 320×568 and 1440×900 CSS pixels.

### Remaining release work

- Replace placeholder imagery with approved brand assets.
- Complete the company registration details in the legal notice before production launch.
- Connect the remaining page copy to a CMS if browser-based editing is required.
- Confirm Netlify Forms notification delivery with a real staging submission.
- Review responsive behavior and accessibility before the `dev` to `main` release.
