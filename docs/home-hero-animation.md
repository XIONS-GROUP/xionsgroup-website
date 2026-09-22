# Homepage X light

The French and English homepages now share a procedural monochrome X light animation. The hero no longer uses the `home-desktop` / `home-mobile` photo placeholders; those asset slots are retained in the visual inventory for a possible future photographic variant.

- Component: `src/components/HeroLight.astro`.
- Rendering and motion: `src/scripts/hero-light.ts` (native WebGL, no added dependencies or external services).
- Static fallback: `public/images/home/xionsgroup-hero-light.svg`.
- Homepage text and placement: `src/components/HomePage.astro`.

The silhouette remains fixed at the hero centre. Scaling is height-based, using the reference ratio 2876:1580. Desktop artwork height is clamped between 44rem (704px at the default root size) and 64rem (1024px), tracking 100svh in between. Mobile (700px and below) uses the approved 360px artwork height. This only sizes the X: the animated canvas still covers the entire hero, including all space above and below it. Width changes clip the sides, never squeeze or shrink the X to fit. The static SVG uses the same sizing rule. Text uses difference blending instead of a backdrop gradient. This is an analytic reconstruction, not a pixel-identical copy of the reference.

Scheme 1 is a 28-second repeating sequence: 0–2 seconds of full-frame white; 2–7 seconds for curved side shadows to move inward; 3.2–8 seconds for the upper/lower shadows to follow; 7–10 seconds to settle into the reference X with a soft edge highlight; 10–23 seconds with the complete X and very restrained light movement; 23–28 seconds for light to expand outward past every viewport corner and return to white. The loop boundary is white on both sides, with no hard cut. Each page visit starts at white; replay resets the entire cycle.

The procedural scene has no image-sized clip. The fixed-aspect X uses artwork coordinates, while moving shadow offsets and the final white expansion account for the full viewport extents. Thus a 360px X on a tall phone still has an animated white-to-dark background across the entire hero. The grain pattern remains stationary and fades out in the white stage. Reduced motion skips the sequence and shows the complete reference X. Timing and approved defaults live in `src/config/hero-light.ts`.

Local design toolbox: open `/design-preview/` on the Astro dev server, or use the floating “设计工具箱” link on a local site page. The toolbox uses an actual same-origin iframe viewport (390×844 mobile, 1440×900 desktop), scaled visually to fit the available screen, so site media queries run at the selected device width. It can be collapsed and follows the visible content region automatically. Only the homepage Hero currently has editable controls; other regions show their name and an explicit no-controls message.

Mobile first-screen minimum height and X artwork height are separate controls, saved under `xions-preview-layout-v2`. The preview can grow beyond the chosen minimum if its text requires more room. The v2 preview settings adopt the approved 360px X and migrate only the previous minimum screen height from v1. Further slider changes remain local review values until explicitly committed. Noise controls retain the existing `xions-hero-grain-v2` preferences. Approved website defaults are still 12% and 0.9px. The replay button is in the toolbox. The runtime observes both the hero and poster dimensions so height changes update even when playback is paused.

The toolbox route and launcher are absent from built deployments. Local updates communicate through development-only custom events. The visitor-facing pause/resume button shows only its icon, with translated screen-reader text retained.

Rendering is capped at 30 fps, 1.5 device pixel ratio and 1600 pixels on the longest canvas edge. It stops when the hero leaves view, the tab becomes hidden, reduced motion is enabled, or the visitor presses pause. Reduced motion renders the fully revealed reference still without the animated lighting, including if enabled midway through the introduction; disabled JavaScript, unavailable WebGL or context loss leave the SVG visible. Context restoration recreates the renderer. Pause/resume controls are translated into English at build time.

Validation: project build, localized copy/links/metadata checks and Astro type checks; browser inspection of French desktop and English/French narrow layouts; pause/resume and local replay UI. The latest resize check confirmed identical 704px artwork heights at wide/narrow desktop widths, a centred fixed-ratio 360px mobile artwork, clipping without horizontal page overflow. A mocked lifecycle harness additionally checks offscreen/background suspension, reduced motion, context loss/restoration, no-WebGL fallback and disposal. This is not a physical iPhone GPU performance measurement.

The static SVG can be opened directly for a still reference. It is a separately drawn approximation of the shader, not an exported animation frame.
