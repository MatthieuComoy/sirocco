import { get } from 'svelte/store';
import { appMode, type AppMode } from '../stores/appMode';
import { telemetry } from '../stores/telemetry';
import { startNavigationSession, stopNavigationSession } from '../stores/navigationSession';
import { autoCenter } from '../stores/autoCenter';
import { dangerWarning } from '../stores/dangerWarning';

/** Single entry point for changing app mode — centralizes the cross-store
 *  side effects the legacy app.js::setAppMode() used to do via ~25 direct
 *  DOM writes (see architecture plan §5, Phase 3). Map-specific effects
 *  (setView, recenter control) react to the `appMode` store independently
 *  from NavigationMapEffects.svelte, which owns the Leaflet map context. */
export function switchAppMode(mode: AppMode) {
  const previous = get(appMode);
  if (previous === mode) return;

  if (mode === 'navigation') {
    const t = get(telemetry);
    startNavigationSession({ lat: t.lat, lon: t.lon });
    autoCenter.set(true);
  } else if (previous === 'navigation') {
    stopNavigationSession();
    dangerWarning.set(null);
  }

  appMode.set(mode);
}
