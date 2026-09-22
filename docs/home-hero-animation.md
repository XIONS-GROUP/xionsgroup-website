# Homepage X light

The French and English homepages now share a procedural monochrome X light animation. The hero no longer uses the `home-desktop` / `home-mobile` photo placeholders; those asset slots are retained in the visual inventory for a possible future photographic variant.

- Component: `src/components/HeroLight.astro`.
- Rendering and motion: `src/scripts/hero-light.ts` (native WebGL, no added dependencies or external services).
- Static fallback: `public/images/home/xionsgroup-hero-light.svg`.
- Homepage text and placement: `src/components/HomePage.astro`.

The silhouette remains fixed at the hero centre. Scaling is height-based, using the reference ratio 2876:1580. Desktop artwork height is fixed at the approved 650px. Mobile (700px and below) uses the approved 390px artwork height. Both the shader and SVG read these sizes from the shared defaults. This only sizes the X: the animated canvas still covers the entire hero, including all space above and below it. Width changes clip the sides, never squeeze or shrink the X to fit. The static SVG uses the same sizing rule. Text uses difference blending instead of a backdrop gradient. This is an analytic reconstruction, not a pixel-identical copy of the reference.

The approved 2026-09-22 sequence repeats every 23 seconds. Earlier values and their rationale are in [the parameter history](project-log/hero-parameters.md):

| Stage | Default duration | Timeline |
| --- | --- | --- |
| Full-frame white | 0 s | Starts white, immediately forming |
| Existing white-to-X formation | 10 s | 0–10 s |
| Complete X before rotation | 2 s | 10–12 s |
| Centred 180° rotation | 4 s | 12–16 s |
| Complete X after rotation | 2 s | 16–18 s |
| Light spreading back to white | 5 s | 18–23 s |

Rotation uses cubic Bézier (0.65, 0, 0.85, 1): a slow departure, late acceleration and a soft arrival at exactly 180°. Coordinates rotate before the reference aspect ratio is applied, so the silhouette never stretches; the background rotates while text remains upright. The return follows the four X arms and expands through the entire viewport, including areas beyond the mobile artwork. The loop boundary is white on both sides, with no hard cut. Each page visit starts at white; replay resets the entire cycle. These timings are approved; the layered lighting added in the same review remains open to visual refinement.

Continuous light runs unconditionally, on its own free clock, for the whole sequence: no stage gate, no fade envelope and no reset at the loop boundary. A broad soft band crosses a diagonal, modulating interior light from −28% to +4%; a narrower highlight travels along the opposite curved edge with peak amplitude 0.22. Their periods are 8s and 5s, respectively, and the approved strength is 290% with speed 1.00×. The clock reads raw accumulated playback time rather than the looped stage time, because 23 seconds is a multiple of neither period and reusing the looped value would visibly jump the light at every restart. During exit the light keeps moving and is simply covered by the spreading white. Reduced motion is the only case that zeroes it. Lights follow the rotating artwork coordinates; grain stays stationary.

Because the light is always on at 290%, the sequence no longer opens on a pure white frame: the X silhouette is already softly shaded at t=0 and the whole 10s formation plays under moving light. This is the intended consequence of the "always looping" requirement, recorded for confirmation in [the flow-loop log](project-log/2026-09-22-flow-loop.md).

The procedural scene has no image-sized clip. The fixed-aspect X uses artwork coordinates, while moving shadow offsets and the final white expansion account for the full viewport extents. Thus a 390px X on a tall phone still has an animated white-to-dark background across the entire hero. The grain pattern remains stationary and fades out in the white stage. Reduced motion skips the sequence and shows the complete reference X. Timing and approved defaults live in `src/config/hero-light.ts`.

Local design toolbox: open `/design-preview/` on the Astro dev server, or use the floating “设计工具箱” link on a local site page. The toolbox uses an actual same-origin iframe viewport (390×844 mobile, 1440×900 desktop), scaled visually to fit the available screen, so site media queries run at the selected device width. It can be collapsed and follows the visible content region automatically. Only the homepage Hero currently has editable controls; other regions show their name and an explicit no-controls message.

The 380px toolbox is grouped into collapsible composition, grain and timing sections. Wide windows reserve space beside the preview; narrower windows use a collapsible floating panel. Desktop X height (default 650px), mobile first-screen minimum height and mobile X artwork height are separate controls, saved under `xions-preview-layout-v3`. The preview can grow beyond the chosen minimum if its text requires more room. The v3 settings adopt the approved 390px mobile / 650px desktop X, migrating only the separate minimum screen height from v2 (or v1). Further slider changes remain local review values until explicitly committed. Noise controls retain the existing `xions-hero-grain-v2` preferences. Approved website defaults are still 12% and 0.9px.

Each of the six stage durations can be edited independently in seconds (0–30 for holds, 1–30 for transitions). Timing changes immediately restart the sequence and persist under `xions-preview-timing-v2`. The timeline can be scrubbed to pause at a specific time, with the current stage and rotation angle displayed; playback and replay controls are available alongside it. These saved preferences affect this browser's local toolbox only. The runtime observes both the hero and poster dimensions so height changes update even when playback is paused.

The toolbox route and launcher are absent from built deployments. Local updates communicate through development-only custom events. The visitor-facing pause/resume button shows only its icon, with translated screen-reader text retained.

Rendering is capped at 30 fps, 1.5 device pixel ratio and 1600 pixels on the longest canvas edge. It stops when the hero leaves view, the tab becomes hidden, reduced motion is enabled, or the visitor presses pause. Reduced motion renders the fully revealed reference still without the animated lighting, including if enabled midway through the introduction; disabled JavaScript, unavailable WebGL or context loss leave the SVG visible. Context restoration recreates the renderer. Pause/resume controls are translated into English at build time.

Validation: project build, localized copy/links/metadata checks and Astro type checks; timing boundary/easing/reduced-motion assertions; browser inspection of the rotated X, full-frame white, live desktop height changes, timeline seeking and saved timing edits. The footer's single current-language link is checked across all localized pages and its matching font size/baseline inspected in the browser. Earlier resize/lifecycle checks covered fixed-ratio mobile artwork, offscreen/background suspension and fallbacks. This is not a physical iPhone GPU performance measurement.

The static SVG can be opened directly for a still reference. It is a separately drawn approximation of the shader, not an exported animation frame.
