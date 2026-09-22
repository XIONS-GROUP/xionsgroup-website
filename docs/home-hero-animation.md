# Homepage X light

The French and English homepages now share a procedural monochrome X light animation. The hero no longer uses the `home-desktop` / `home-mobile` photo placeholders; those asset slots are retained in the visual inventory for a possible future photographic variant.

- Component: `src/components/HeroLight.astro`.
- Rendering and motion: `src/scripts/hero-light.ts` (native WebGL, no added dependencies or external services).
- Static fallback: `public/images/home/xionsgroup-hero-light.svg`.
- Homepage text and placement: `src/components/HomePage.astro`.

The silhouette remains fixed at the hero centre. Scaling is height-based, using the reference ratio 2876:1580. Desktop artwork height is clamped between 44rem (704px at the default root size) and 64rem (1024px), tracking 100svh in between. Mobile (700px and below) uses a fixed 40rem (640px) artwork height. The hero is at least that tall. Width changes clip the sides, never squeeze or shrink the X to fit. The static SVG uses the same sizing rule. Text uses difference blending instead of a backdrop gradient. This is an analytic reconstruction, not a pixel-identical copy of the reference.

The first visit in a tab session has a 2.2-second reveal, followed by a 20-second light cycle: two diagonal highlights move along the fixed surface, meet at the waist, disperse and settle back to the reference lighting. A narrower edge light leads a wider, slower light field. The grain pattern is stationary. Completed introductions are remembered in sessionStorage; storage failures do not prevent rendering. Timing and approved grain defaults live in `src/config/hero-light.ts`.

Local design toolbox: open `/design-preview/` on the Astro dev server, or use the floating “设计工具箱” link on a local site page. The toolbox uses an actual same-origin iframe viewport (390×844 mobile, 1440×900 desktop), scaled visually to fit the available screen, so site media queries run at the selected device width. It can be collapsed and follows the visible content region automatically. Only the homepage Hero currently has editable controls; other regions show their name and an explicit no-controls message.

Mobile first-screen minimum height and X artwork height are separate controls, saved under `xions-preview-layout-v1`. The preview can grow beyond the chosen minimum if its text requires more room. These dimensions remain local review values until explicitly committed as website defaults. Noise controls retain the existing `xions-hero-grain-v2` preferences. Approved website defaults are still 12% and 0.9px. The replay button is in the toolbox. The runtime observes both the hero and poster dimensions so height changes update even when playback is paused.

The toolbox route and launcher are absent from built deployments. Local updates communicate through development-only custom events. The visitor-facing pause/resume button shows only its icon, with translated screen-reader text retained.

Rendering is capped at 30 fps, 1.5 device pixel ratio and 1600 pixels on the longest canvas edge. It stops when the hero leaves view, the tab becomes hidden, reduced motion is enabled, or the visitor presses pause. Reduced motion renders the fully revealed reference still without the animated lighting, including if enabled midway through the introduction; disabled JavaScript, unavailable WebGL or context loss leave the SVG visible. Context restoration recreates the renderer. Pause/resume controls are translated into English at build time.

Validation: project build, localized copy/links/metadata checks and Astro type checks; browser inspection of French desktop and English/French narrow layouts; pause/resume and local replay UI. The latest resize check confirmed identical 704px artwork heights at wide/narrow desktop widths, a centred fixed-ratio 640px mobile artwork, clipping without horizontal page overflow. A mocked lifecycle harness additionally checks offscreen/background suspension, reduced motion, context loss/restoration, no-WebGL fallback and disposal. This is not a physical iPhone GPU performance measurement.

The static SVG can be opened directly for a still reference. It is a separately drawn approximation of the shader, not an exported animation frame.
