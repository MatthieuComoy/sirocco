import { writable } from 'svelte/store';

export type RoutePlanUiState = 'idle' | 'picking_start' | 'computing' | 'ready';
export type RoutePlanError = 'start_on_land' | 'destination_on_land' | 'unreachable' | 'search_failed' | null;

export interface RoutePoint {
  lat: number;
  lon: number;
  label: string;
}

export interface RoutePlanState {
  /** null = use the live telemetry position (the default). */
  start: RoutePoint | null;
  destination: RoutePoint | null;
  route: { coordinates: [number, number][]; distanceMeters: number } | null;
  uiState: RoutePlanUiState;
  error: RoutePlanError;
}

// Plain writable, not persisted() — a stale destination/route left over from
// a past session is more likely to confuse than help on reload. This
// mirrors the `anchor` store's own choice, not `savedTracks`'s deliberately
// durable one.
export const routePlan = writable<RoutePlanState>({
  start: null,
  destination: null,
  route: null,
  uiState: 'idle',
  error: null,
});
