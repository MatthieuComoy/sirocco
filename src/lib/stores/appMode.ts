import { writable } from 'svelte/store';

export type AppMode = 'consultation' | 'navigation' | 'weather';

export const appMode = writable<AppMode>('consultation');
