# Homepage X light

The French and English homepages now share a procedural monochrome X light animation. The hero no longer uses the `home-desktop` / `home-mobile` photo placeholders; those asset slots are retained in the visual inventory for a possible future photographic variant.

- Component: `src/components/HeroLight.astro`.
- Rendering and motion: `src/scripts/hero-light.ts` (native WebGL, no added dependencies or external services).
- Static fallback: `public/images/home/xionsgroup-hero-light.svg`.
- Homepage text and placement: `src/components/HomePage.astro`.

The silhouette remains fixed at the hero centre. Scaling is height-based, using the reference ratio 2876:1580. Desktop artwork height is fixed at the approved 650px. Mobile (700px and below) uses the approved 390px artwork height. Both the shader and SVG read these sizes from the shared defaults. This only sizes the X: the animated canvas still covers the entire hero, including all space above and below it. Width changes clip the sides, never squeeze or shrink the X to fit. The static SVG uses the same sizing rule. Text uses difference blending instead of a backdrop gradient. This is an analytic reconstruction, not a pixel-identical copy of the reference.

The approved 2026-09-22 sequence repeats every 25 seconds. Earlier values and their rationale are in [the parameter history](project-log/hero-parameters.md):

| Stage | Default duration | Timeline |
| --- | --- | --- |
| Full-frame white | 2 s | 0–2 s |
| Existing white-to-X formation | 10 s | 2–12 s |
| Complete X before rotation | 2 s | 12–14 s |
| Centred 180° rotation | 4 s | 14–18 s |
| Complete X after rotation | 2 s | 18–20 s |
| Formation replayed backwards | 5 s | 20–25 s |

Rotation is a symmetric quintic S curve: a slow departure, mid acceleration and a soft arrival at exactly 180°. Coordinates rotate before the reference aspect ratio is applied, so the silhouette never stretches; the background rotates while text remains upright. Each cycle keeps turning rather than snapping back to 0°: `angle = π × (turns + ease)` with `turns = floor(elapsed / total) % 2`. The silhouette is 180°-symmetric so this is invisible in itself, but the flow light is evaluated in rotated coordinates, and resetting the angle would mirror the light across the loop seam; the modulo keeps the value bounded and returns it to 0° every second cycle.

The exit is no longer a separate effect. One assembly progress drives the `formation` uniform: 0→1 while forming, held at 1 through both holds and the rotation, then 1→0 during exit. Because `motionEase` is symmetric about its midpoint, 1−E(u) equals E(1−u), so the exit is a strict time reversal of the formation. A cycle's last frame is therefore pixel-identical to its first and the white hold is simply an extension of that same state, giving a seamless loop. The earlier arm-spreading dissolve was removed in the same review; it is recoverable from commit a8812d5. Each page visit starts at white; replay resets the entire cycle.

Continuous light runs unconditionally, on its own free clock, for the whole sequence: no stage gate, no fade envelope and no reset at the loop boundary. A broad soft band crosses a diagonal, modulating interior light from −28% to +4%; a narrower highlight travels along the opposite curved edge with peak amplitude 0.22. Their periods are 8s and 5s, respectively, and the approved strength is 290% with speed 0.55×. The clock reads raw accumulated playback time rather than the looped stage time, because 25 seconds is a multiple of neither period and reusing the looped value would visibly jump the light at every restart. Reduced motion is the only case that zeroes it. Lights follow the rotating artwork coordinates; grain stays stationary and now fades with the cycle value alone, so it disappears as the exit unwinds the formation.

Because the light is always on at 290%, the white stage is not a blank white frame: the X silhouette reads as a soft grey shape against white, an inverted-contrast counterpart to the lit X. The user approved this look explicitly; it is not a defect to remove. See [the flow-loop log](project-log/2026-09-22-flow-loop.md) and [the loop-seam log](project-log/2026-09-22-loop-seam.md).

The procedural scene has no image-sized clip. The fixed-aspect X uses artwork coordinates, while moving shadow offsets and the final white expansion account for the full viewport extents. Thus a 390px X on a tall phone still has an animated white-to-dark background across the entire hero. The grain pattern remains stationary and fades out in the white stage. Reduced motion skips the sequence and shows the complete reference X. Timing and approved defaults live in `src/config/hero-light.ts`.

Local design toolbox: open `/design-preview/` on the Astro dev server, or use the floating “设计工具箱” link on a local site page. The toolbox uses an actual same-origin iframe viewport (390×844 mobile, 1440×900 desktop), scaled visually to fit the available screen, so site media queries run at the selected device width. It can be collapsed and follows the visible content region automatically. Only the homepage Hero currently has editable controls; other regions show their name and an explicit no-controls message.

The 380px toolbox is grouped into collapsible composition, grain and timing sections. Wide windows reserve space beside the preview; narrower windows use a collapsible floating panel. Desktop X height (default 650px), mobile first-screen minimum height and mobile X artwork height are separate controls, saved under `xions-preview-layout-v3`. The preview can grow beyond the chosen minimum if its text requires more room. The v3 settings adopt the approved 390px mobile / 650px desktop X, migrating only the separate minimum screen height from v2 (or v1). Further slider changes remain local review values until explicitly committed. Noise controls retain the existing `xions-hero-grain-v2` preferences. Approved website defaults are still 12% and 0.9px.

Each of the six stage durations can be edited independently in seconds (0–30 for holds, 1–30 for transitions). Timing changes immediately restart the sequence and persist under `xions-preview-timing-v2`. The timeline can be scrubbed to pause at a specific time, with the current stage and rotation angle displayed; playback and replay controls are available alongside it. These saved preferences affect this browser's local toolbox only. The runtime observes both the hero and poster dimensions so height changes update even when playback is paused.

The toolbox route and launcher are absent from built deployments. Local updates communicate through development-only custom events. The visitor-facing pause/resume button shows only its icon, with translated screen-reader text retained.

Rendering is capped at 30 fps, 1.5 device pixel ratio and 1600 pixels on the longest canvas edge. It stops when the hero leaves view, the tab becomes hidden, reduced motion is enabled, or the visitor presses pause. Reduced motion renders the fully revealed reference still without the animated lighting, including if enabled midway through the introduction; disabled JavaScript, unavailable WebGL or context loss leave the SVG visible. Context restoration recreates the renderer. Pause/resume controls are translated into English at build time.

Validation: project build, localized copy/links/metadata checks and Astro type checks; timing boundary/easing/reduced-motion assertions; browser inspection of the rotated X, full-frame white, live desktop height changes, timeline seeking and saved timing edits. The footer's single current-language link is checked across all localized pages and its matching font size/baseline inspected in the browser. Earlier resize/lifecycle checks covered fixed-ratio mobile artwork, offscreen/background suspension and fallbacks. This is not a physical iPhone GPU performance measurement.

The static SVG can be opened directly for a still reference. It is a separately drawn approximation of the shader, not an exported animation frame.
