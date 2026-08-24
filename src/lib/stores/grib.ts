import { writable } from 'svelte/store';

export type GribOverlayType = 'wind' | 'temp';

export interface GribLocation {
  latitude: number;
  longitude: number;
  hourly: {
    temperature_2m: number[];
    wind_speed_10m: number[];
    wind_direction_10m: number[];
  };
}

export interface GribBoundsLike {
  north: number;
  south: number;
  east: number;
  west: number;
}

export interface GribState {
  overlayType: GribOverlayType;
  activeTimeIndex: number;
  data: GribLocation[] | null;
  bounds: GribBoundsLike | null;
  isPlaying: boolean;
  active: boolean;
}

export const grib = writable<GribState>({
  overlayType: 'wind',
  activeTimeIndex: 0,
  data: null,
  bounds: null,
  isPlaying: false,
  active: false,
});
