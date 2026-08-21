import { writable } from 'svelte/store';

export interface Telemetry {
  lat: number;
  lon: number;
  speedKts: number;
  headingDeg: number;
  windDirectionDeg: number | null;
}

// Toulon — same default the legacy app used (js/state.js: currentLat/currentLon).
export const telemetry = writable<Telemetry>({
  lat: 43.1167,
  lon: 5.9333,
  speedKts: 0,
  headingDeg: 0,
  windDirectionDeg: null,
});
