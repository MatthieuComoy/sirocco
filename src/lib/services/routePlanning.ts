import { get } from 'svelte/store';
import { routePlan, type RoutePlanError } from '../stores/routePlan';
import { telemetry } from '../stores/telemetry';
import { loadLandPolygons } from './routing/landData';
import { computeRoute } from './routing/routePlanner';

/** Idle-prefetches the land-polygon data so the first "Valider" click
 *  doesn't have to wait on it. Failures are swallowed here and surfaced
 *  again (as a real error) when validateRoute() actually needs the data. */
export function initRoutePlanningData() {
  loadLandPolygons().catch(() => {});
}

export function setDestination(lat: number, lon: number, label: string) {
  routePlan.update((s) => ({ ...s, destination: { lat, lon, label }, route: null, error: null }));
}

export function setStartOverride(lat: number, lon: number, label: string) {
  routePlan.update((s) => ({ ...s, start: { lat, lon, label }, uiState: 'idle', route: null, error: null }));
}

export function useCurrentPositionAsStart() {
  routePlan.update((s) => ({ ...s, start: null, route: null, error: null }));
}

export function beginPickStartOnMap() {
  routePlan.update((s) => ({ ...s, uiState: 'picking_start' }));
}

export function cancelPickStartOnMap() {
  routePlan.update((s) => ({ ...s, uiState: 'idle' }));
}

export async function validateRoute() {
  const state = get(routePlan);
  if (!state.destination) return;

  const t = get(telemetry);
  const start = state.start ?? { lat: t.lat, lon: t.lon, label: '' };

  routePlan.update((s) => ({ ...s, uiState: 'computing', error: null }));

  const result = await computeRoute([start.lon, start.lat], [state.destination.lon, state.destination.lat]);

  if (result.status === 'ok') {
    routePlan.update((s) => ({
      ...s,
      uiState: 'ready',
      error: null,
      route: {
        coordinates: result.coordinates!.map(([lon, lat]) => [lat, lon]),
        distanceMeters: result.distanceMeters!,
      },
    }));
  } else {
    routePlan.update((s) => ({ ...s, uiState: 'idle', route: null, error: result.status as RoutePlanError }));
  }
}

export function clearRoutePlan() {
  routePlan.set({ start: null, destination: null, route: null, uiState: 'idle', error: null });
}
