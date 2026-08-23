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

export default app!;
