import { defineConfig } from 'astro/config';

export default defineConfig({
  srcDir: './src',
  publicDir: './public',
  outDir: './dist',
  site: 'https://www.xionsgroup.com',
  trailingSlash: 'always'
});
