import type L from 'leaflet';
import type { Writable } from 'svelte/store';

/** Svelte context key used by MapCanvas to expose the live Leaflet map instance to headless layer components. */
export const MAP_CONTEXT_KEY = Symbol('leaflet-map');

export type MapStore = Writable<L.Map | null>;
