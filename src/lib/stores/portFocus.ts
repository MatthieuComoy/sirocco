import { writable } from 'svelte/store';
import type { Port } from '../services/portSearch';
import type { WikipediaSummary } from '../services/portEnrichment';

// Set by the port search modal when the user picks a result; PortFocusLayer
// (a MapCanvas child, so it has the Leaflet map in context) reacts by
// panning to the port and opening its info popup. A bump counter is needed
// alongside the port itself since re-selecting the same port twice in a row
// wouldn't otherwise change the store value and re-trigger the pan.
export interface PortFocusRequest {
  port: Port;
  requestId: number;
  // Populated only by the modal's online "search elsewhere" path — a wiki
  // summary/photo for the town, fetched after an offline pick has no reason
  // to make a network call at all.
  wiki?: WikipediaSummary | null;
}

export const portFocus = writable<PortFocusRequest | null>(null);

let nextRequestId = 1;

export function focusPort(port: Port, wiki?: WikipediaSummary | null) {
  portFocus.set({ port, requestId: nextRequestId++, wiki });
}
