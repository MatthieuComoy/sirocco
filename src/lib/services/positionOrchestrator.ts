// Cross-domain reactions to telemetry updates. This is the only service that
// observes `telemetry` and touches multiple domains at once — it replaces the
// legacy app.js::updatePosition() without the app.js <-> gpsSimulator.js
// circular import (see architecture plan §2).
import { get } from 'svelte/store';
import { gpsMode } from '../stores/gpsMode';
import { setGpsMode } from './gpsSimulator';
import { telemetry } from '../stores/telemetry';
import { appMode } from '../stores/appMode';
import { boatProfile } from '../stores/boatProfile';
import { advanceNavigationDistance, navigationSession } from '../stores/navigationSession';
import { dangerWarning } from '../stores/dangerWarning';
import { calculateHaversineDistance, getSimulatedDepth } from './utils';

let started = false;

export function initPositionTracking() {
  if (started) return;
  started = true;
  // Legacy default (js/state.js: isSimulating = true).
  setGpsMode(get(gpsMode));

  telemetry.subscribe((t) => {
    if (get(appMode) !== 'navigation') {
      if (get(dangerWarning) !== null) dangerWarning.set(null);
      return;
    }

    const session = get(navigationSession);
    if (session.lastLatLng) {
      const step = calculateHaversineDistance(
        t.lat,
        t.lon,
        session.lastLatLng.lat,
        session.lastLatLng.lon
      );
      advanceNavigationDistance(step, { lat: t.lat, lon: t.lon });
    }

    const depth = getSimulatedDepth(t.lat, t.lon);
    const profile = get(boatProfile);
    const criticalDepth = profile.draft + profile.clearance;

    if (depth <= profile.draft) {
      dangerWarning.set(`⚠️ ÉCHOUEMENT PROCHE ! Sondeur: ${depth.toFixed(1)}m`);
    } else if (depth <= criticalDepth) {
      dangerWarning.set(`⚠️ PROFONDEUR BASSE ! Sondeur: ${depth.toFixed(1)}m`);
    } else {
      dangerWarning.set(null);
    }
  });
}

/** Current simulated depth at the boat's position — read by the HUD. */
export function currentDepth(): number {
  const t = get(telemetry);
  return getSimulatedDepth(t.lat, t.lon);
}
