import { writable } from 'svelte/store';

export type Theme = 'dark' | 'light';

// Stored as a plain string (not JSON-encoded) under the same key as the
// legacy app (localStorage.setItem('sirroco_theme', 'light')) so an existing
// user's preference still loads correctly.
const STORAGE_KEY = 'sirroco_theme';

function readInitial(): Theme {
  if (typeof localStorage === 'undefined') return 'dark';
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved === 'light' ? 'light' : 'dark';
}

export const theme = writable<Theme>(readInitial());

if (typeof localStorage !== 'undefined') {
  theme.subscribe((value) => {
    localStorage.setItem(STORAGE_KEY, value);
  });
}

export function toggleTheme() {
  theme.update((t) => (t === 'dark' ? 'light' : 'dark'));
}
