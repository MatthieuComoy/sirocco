import { writable } from 'svelte/store';

export const online = writable<boolean>(typeof navigator === 'undefined' || navigator.onLine);
