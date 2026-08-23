import { mount } from 'svelte';
import './app.css';
import { i18nReady } from './lib/i18n';
import App from './App.svelte';

let app: ReturnType<typeof mount>;

i18nReady.then(() => {
  app = mount(App, {
    target: document.getElementById('app')!,
  });
});

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch((err) => {
      console.error('Service worker registration failed', err);
    });
  });
}

export default app!;
