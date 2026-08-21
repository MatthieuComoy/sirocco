import { derived, writable } from 'svelte/store';
import { telemetry } from './telemetry';
import { calculateHaversineDistance } from '../services/utils';

export interface AnchorLatLng {
  lat: number;
  lon: number;
}

export interface AnchorState {
  active: boolean;
  latLng: AnchorLatLng | null;
  radiusNm: number;
}

// Default radius matches the legacy app (js/state.js: alarmRadius = 0.030 NM ≈ 55m).
export const anchor = writable<AnchorState>({
  active: false,
  latLng: null,
  radiusNm: 0.03,
});

export const driftDistanceNm = derived([anchor, telemetry], ([$anchor, $telemetry]) => {
  if (!$anchor.latLng) return 0;
  const meters = calculateHaversineDistance(
    $telemetry.lat,
    $telemetry.lon,
    $anchor.latLng.lat,
    $anchor.latLng.lon
  );
  return meters / 1852;
});

export const isAlarmTriggered = derived(
  [anchor, driftDistanceNm],
  ([$anchor, $drift]) => $anchor.active && $drift > $anchor.radiusNm
);
