import { writable } from 'svelte/store';

export interface Telemetry {
  lat: number;
  lon: number;
  speedKts: number;
  headingDeg: number;
  windDirectionDeg: number | null;
}

// Îles Glénan — sensible fallback shown until/unless real GPS is available
// (the app defaults to following the user's actual position; this is just
// where the map centers before that first fix arrives, or if it never does).
export const telemetry = writable<Telemetry>({
  lat: 47.7167,
  lon: -4.0167,
  speedKts: 0,
  headingDeg: 0,
  windDirectionDeg: null,
});
