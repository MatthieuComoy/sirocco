import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    svelte(),
    VitePWA({
      // manifest.json and the icon set are hand-authored in public/ (and
      // already linked from index.html) rather than plugin-generated.
      manifest: false,
      injectRegister: false,
      strategies: 'injectManifest',
      srcDir: 'src',
      filename: 'sw.ts',
      injectManifest: {
        // Include the SHOM/NGA XML+JSON fallback data alongside the app
        // shell so the warnings service still has a local fallback on a
        // brand-new install that goes offline before its first fetch.
        // geojson is the bundled land-polygon data the route planner needs
        // to work fully offline (see scripts/generate-land-polygons.mjs).
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webmanifest,xml,json,geojson}'],
      },
      devOptions: {
        enabled: false,
      },
    }),
  ],
});
