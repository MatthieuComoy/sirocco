import { writable, type Writable } from 'svelte/store';

/** A writable store mirrored to localStorage under `key`, seeded from any
 *  previously saved value so existing users don't lose their settings. */
export function persisted<T>(key: string, initial: T): Writable<T> {
  let startValue = initial;
  if (typeof localStorage !== 'undefined') {
    const saved = localStorage.getItem(key);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        startValue =
          typeof initial === 'object' && initial !== null && !Array.isArray(initial)
            ? { ...initial, ...parsed }
            : parsed;
      } catch {
        startValue = initial;
      }
    }
  }

  const store = writable<T>(startValue);

  if (typeof localStorage !== 'undefined') {
    store.subscribe((value) => {
      localStorage.setItem(key, JSON.stringify(value));
    });
  }

  return store;
}
