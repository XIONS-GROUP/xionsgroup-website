# Homepage X light

The French and English homepages now share a procedural monochrome X light animation. The hero no longer uses the `home-desktop` / `home-mobile` photo placeholders; those asset slots are retained in the visual inventory for a possible future photographic variant.

- Component: `src/components/HeroLight.astro`.
- Rendering and motion: `src/scripts/hero-light.ts` (native WebGL, no added dependencies or external services).
- Static fallback: `public/images/home/xionsgroup-hero-light.svg`.
- Homepage text and placement: `src/components/HomePage.astro`.

The light has a 24-second periodic motion. `center`, `width`, `softness` and `illumination` in the shader control placement, shape, edge softness and brightness. Portrait layouts shift the light toward the right; the component overlays a dark gradient to preserve text contrast. The tiny stationary dither is below one 8-bit luminance step and is used for gradient banding, not a visible grain texture.

Rendering is capped at 30 fps, 1.5 device pixel ratio and 1600 pixels on the longest canvas edge. It stops when the hero leaves view, the tab becomes hidden, reduced motion is enabled, or the visitor presses pause. Reduced motion renders one still frame; disabled JavaScript, unavailable WebGL or context loss leave the SVG visible. Context restoration recreates the renderer. Pause/resume controls are translated into English at build time.

Validation: project build, localized copy/links/metadata checks and Astro type checks; browser inspection of French desktop and English/French narrow layouts; pause/resume UI. A mocked lifecycle harness additionally checks offscreen/background suspension, reduced motion, context loss/restoration, no-WebGL fallback and disposal. This is not a physical iPhone GPU performance measurement.

The static SVG can be opened directly for a still reference. It is a separately drawn approximation of the shader, not an exported animation frame.
