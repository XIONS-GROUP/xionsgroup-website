# Homepage X light

The French and English homepages now share a procedural monochrome X light animation. The hero no longer uses the `home-desktop` / `home-mobile` photo placeholders; those asset slots are retained in the visual inventory for a possible future photographic variant.

- Component: `src/components/HeroLight.astro`.
- Rendering and motion: `src/scripts/hero-light.ts` (native WebGL, no added dependencies or external services).
- Static fallback: `public/images/home/xionsgroup-hero-light.svg`.
- Homepage text and placement: `src/components/HomePage.astro`.

The light has a 24-second periodic motion. `center`, `width`, `softness` and `illumination` in the shader control placement, shape, edge softness and brightness. The X is fixed at the viewport centre. Its coordinate system uses the reference aspect ratio (2876:1580) with uniform contain scaling on every viewport: narrow screens add dark space above and below instead of stretching or cropping the X. The waist is 20% of the reference width. The silhouette is fixed; only illumination changes. Text uses difference blending instead of a backdrop gradient, preserving the light field. The reconstruction is analytic, not a pixel-identical copy of the reference.

In the local Astro development server, open “Réglages du grain” at the upper right of the hero. Intensity is 0–100%, and grain size is 0.5–4 CSS pixels. Values redraw immediately, including when paused, and persist in localStorage for that browser/origin. These preferences do not change committed defaults (12%, 1 px). Controls are omitted from built deployments; no-JavaScript/WebGL fallbacks have no adjustable grain.

Rendering is capped at 30 fps, 1.5 device pixel ratio and 1600 pixels on the longest canvas edge. It stops when the hero leaves view, the tab becomes hidden, reduced motion is enabled, or the visitor presses pause. Reduced motion renders one still frame; disabled JavaScript, unavailable WebGL or context loss leave the SVG visible. Context restoration recreates the renderer. Pause/resume controls are translated into English at build time.

Validation: project build, localized copy/links/metadata checks and Astro type checks; browser inspection of French desktop and English/French narrow layouts; pause/resume UI. A mocked lifecycle harness additionally checks offscreen/background suspension, reduced motion, context loss/restoration, no-WebGL fallback and disposal. This is not a physical iPhone GPU performance measurement.

The static SVG can be opened directly for a still reference. It is a separately drawn approximation of the shader, not an exported animation frame.
