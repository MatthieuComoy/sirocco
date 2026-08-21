import { derived, readable, writable } from 'svelte/store';

export interface LatLon {
  lat: number;
  lon: number;
}

export interface NavigationSession {
  active: boolean;
  startTime: number | null;
  distanceMeters: number;
  lastLatLng: LatLon | null;
}

export const navigationSession = writable<NavigationSession>({
  active: false,
  startTime: null,
  distanceMeters: 0,
  lastLatLng: null,
});

export function startNavigationSession(origin: LatLon) {
  navigationSession.set({
    active: true,
    startTime: Date.now(),
    distanceMeters: 0,
    lastLatLng: origin,
  });
}

export function stopNavigationSession() {
  navigationSession.update((s) => ({ ...s, active: false }));
}

export function advanceNavigationDistance(stepMeters: number, newLatLng: LatLon) {
  navigationSession.update((s) => ({
    ...s,
    distanceMeters: s.distanceMeters + stepMeters,
    lastLatLng: newLatLng,
  }));
}

/** Ticks once a second — only while something (the HUD) actually subscribes. */
const now = readable(Date.now(), (set) => {
  const id = setInterval(() => set(Date.now()), 1000);
  return () => clearInterval(id);
});

export const navigationDurationStr = derived([navigationSession, now], ([$session, $now]) => {
  if (!$session.startTime) return '00:00:00';
  const elapsedMs = $now - $session.startTime;
  const seconds = Math.floor((elapsedMs / 1000) % 60);
  const minutes = Math.floor((elapsedMs / (1000 * 60)) % 60);
  const hours = Math.floor((elapsedMs / (1000 * 60 * 60)) % 24);
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
});
