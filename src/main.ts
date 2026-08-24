import { mount } from 'svelte';
import './app.css';
import { i18nReady } from './lib/i18n';
import App from './App.svelte';

let app: ReturnType<typeof mount>;

function start() {
  app = mount(App, {
    target: document.getElementById('app')!,
  });
}

// Don't let a failed/stalled locale fetch (flaky network, ad-blocker, CDN
// hiccup) leave the app permanently unmounted — fall back and start anyway.
i18nReady.then(start).catch((err) => {
  console.error('i18n init failed, starting without it', err);
  start();
});

// /sw.js only exists in a production build (vite-plugin-pwa's injectManifest
// output) — registering it under `vite dev` 404s into index.html and fails
// with an "unsupported MIME type" error.
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch((err) => {
      console.error('Service worker registration failed', err);
    });
  });
}

export default app!;
