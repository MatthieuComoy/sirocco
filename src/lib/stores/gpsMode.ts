import { writable } from 'svelte/store';

export type GpsMode = 'real' | 'simulated';

/** Mirror of the current GPS source — UI reads this, but only gpsSimulator.ts's
 *  setGpsMode() is allowed to write it (see architecture plan §2: this store
 *  must stay a mirror, not the trigger, to guarantee only one timer runs at a time). */
export const gpsMode = writable<GpsMode>('simulated');

export interface SimulatorSettings {
  speedKts: number;
  headingDeg: number;
  isDrifting: boolean;
}

// Defaults match the legacy app (js/state.js: simSpeed/simHeading).
export const simulatorSettings = writable<SimulatorSettings>({
  speedKts: 4.5,
  headingDeg: 180,
  isDrifting: false,
});
