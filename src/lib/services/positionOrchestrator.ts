// Cross-domain reactions to telemetry updates. This is the only service that
// observes `telemetry` and touches multiple domains at once — it replaces the
// legacy app.js::updatePosition() without the app.js <-> gpsSimulator.js
// circular import (see architecture plan §2).
import { get } from 'svelte/store';
import { gpsMode } from '../stores/gpsMode';
import { setGpsMode } from './gpsSimulator';

let started = false;

export function initPositionTracking() {
  if (started) return;
  started = true;
  // Legacy default (js/state.js: isSimulating = true).
  setGpsMode(get(gpsMode));
}
