import { defineConfig } from 'astro/config';
import { designPresets } from './scripts/design-presets-dev.mjs';

export default defineConfig({
  srcDir: './src',
  publicDir: './public',
  outDir: './dist',
  site: 'https://www.xionsgroup.com',
  trailingSlash: 'always',
  vite: { plugins: [designPresets()] }
});
