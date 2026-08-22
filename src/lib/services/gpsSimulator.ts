// Ported from legacy/js/gpsSimulator.js — no DOM access, writes to stores instead.
import { get } from 'svelte/store';
import { telemetry } from '../stores/telemetry';
import { gpsMode, simulatorSettings, type GpsMode } from '../stores/gpsMode';
import { simOptionsEnabled } from '../stores/settings';

let simTimer: ReturnType<typeof setInterval> | null = null;
let realWatchId: number | null = null;

function startSimLoop() {
  if (simTimer) return;
  simTimer = setInterval(() => {
    const { speedKts, headingDeg } = get(simulatorSettings);
    const current = get(telemetry);

    // 1 knot = 0.514444 m/s. Flat-earth projection is fine for 1s steps.
    const dt = 1;
    const speedMs = speedKts * 0.514444;
    const distanceMeters = speedMs * dt;
    const bearingRad = (headingDeg * Math.PI) / 180;

    const deltaLat = (distanceMeters * Math.cos(bearingRad)) / 111111;
    const deltaLon =
      (distanceMeters * Math.sin(bearingRad)) /
      (111111 * Math.cos((current.lat * Math.PI) / 180));

    telemetry.set({
      ...current,
      lat: current.lat + deltaLat,
      lon: current.lon + deltaLon,
      speedKts,
      headingDeg,
    });
  }, 1000);
}

function stopSimLoop() {
  if (simTimer) {
    clearInterval(simTimer);
    simTimer = null;
  }
}

function startRealGPS() {
  if (!('geolocation' in navigator)) {
    alert('Geolocation API not supported. Switched to Simulation Mode.');
    setGpsMode('simulated');
    return;
  }

  realWatchId = navigator.geolocation.watchPosition(
    (position) => {
      const coords = position.coords;
      const speedKts = coords.speed ? coords.speed * 1.94384 : 0;
      const headingDeg = coords.heading ?? 0;
      telemetry.update((t) => ({
        ...t,
        lat: coords.latitude,
        lon: coords.longitude,
        speedKts,
        headingDeg,
      }));
    },
    (error) => {
      console.error('GPS Watch error: ', error);
      alert('GPS Signal failed. Switched to Simulation Mode.');
      setGpsMode('simulated');
    },
    { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
  );
}

function stopRealGPS() {
  if (realWatchId !== null) {
    navigator.geolocation.clearWatch(realWatchId);
    realWatchId = null;
  }
}

/**
 * Single entry point for switching GPS source. Deliberately imperative and
 * synchronous (not a store subscription reacting to `gpsMode`) so the
 * real-GPS/simulator timers are guaranteed mutually exclusive — see
 * architecture plan §2 / §8 risk #2.
 */
export function setGpsMode(mode: GpsMode) {
  if (mode === 'simulated') {
    stopRealGPS();
    startSimLoop();
  } else {
    stopSimLoop();
    startRealGPS();
  }
  gpsMode.set(mode);
}

export function triggerSimulatorDrift() {
  simulatorSettings.set({ speedKts: 8.0, headingDeg: 180, isDrifting: true });
}

let simOptionsSyncStarted = false;

/** Disabling "simulation options" also forces real GPS, same as legacy —
 *  but only in reaction to the user actually flipping the toggle, not on
 *  the initial subscribe (the app defaults to the simulator regardless of
 *  this setting, matching legacy js/state.js: isSimulating = true). */
export function initSimOptionsSync() {
  if (simOptionsSyncStarted) return;
  simOptionsSyncStarted = true;
  let first = true;
  simOptionsEnabled.subscribe((enabled) => {
    if (first) {
      first = false;
      return;
    }
    if (!enabled && get(gpsMode) === 'simulated') {
      setGpsMode('real');
    }
  });
}
