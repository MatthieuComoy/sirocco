import { writable } from 'svelte/store';
import type { TideData } from '../services/tides';

export interface CurrentConditions {
  windSpeedKts: number | null;
  windDirDeg: number | null;
  windGustsKts: number | null;
  pressureMsl: number | null;
  tempC: number | null;
  waveHeightM: number | null;
  waveDirDeg: number | null;
  wavePeriodS: number | null;
}

export interface WeatherLatLon {
  lat: number;
  lon: number;
}

export interface WeatherState {
  loading: boolean;
  locationName: string | null;
  conditions: CurrentConditions | null;
  lastFetched: WeatherLatLon | null;
}

export const weather = writable<WeatherState>({
  loading: false,
  locationName: null,
  conditions: null,
  lastFetched: null,
});

export const tideData = writable<TideData | null>(null);
