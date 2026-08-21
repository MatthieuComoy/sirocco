import { writable } from 'svelte/store';
import { persisted } from './persisted';
import type { PointOfSail } from '../services/utils';

export interface TrackPoint {
  lat: number;
  lng: number;
  time: number;
  speed: number;
  heading: number;
  windDir: number;
  pointOfSail: PointOfSail;
}

export type PointsOfSailRecap = Record<PointOfSail, number>;

export interface SavedTrack {
  name: string;
  date: string;
  coordinates: TrackPoint[];
  distance: number; // meters
  avgSpeed: number; // knots
  maxSpeed: number; // knots
  pointsOfSailRecap: PointsOfSailRecap;
}

export const isTracking = writable(false);
export const currentTrack = writable<TrackPoint[]>([]);

// Same storage key as the legacy app (localStorage 'sirroco_saved_tracks') so
// existing installs keep their recorded tracks.
export const savedTracks = persisted<SavedTrack[]>('sirroco_saved_tracks', []);
