import { writable } from 'svelte/store';
import type { SavedTrack } from './tracking';

/** Set by the sidebar's "show on map" action; TrackPreviewLayer.svelte (which
 *  owns the Leaflet map context) reacts by drawing + auto-clearing it. */
export const trackPreviewRequest = writable<SavedTrack | null>(null);
