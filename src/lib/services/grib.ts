// Ported from legacy/js/weatherTides.js GRIB section — grid/interpolation/
// canvas logic is pure; only the DOM-driven timeline UI becomes reactive
// state in GribTimeline.svelte instead of manual element creation.
import { get } from 'svelte/store';
import type L from 'leaflet';
import { grib, type GribBoundsLike, type GribLocation } from '../stores/grib';
import { calculateHaversineDistance } from './utils';

export const GRIB_GRID_SIZE = 10;
const PLAY_STEP_HOURS = 3;
const PLAY_INTERVAL_MS = 1000;
const MAX_TIME_INDEX = 167;

export function toBoundsLike(bounds: L.LatLngBounds): GribBoundsLike {
  const sw = bounds.getSouthWest();
  const ne = bounds.getNorthEast();
  return { south: sw.lat, west: sw.lng, north: ne.lat, east: ne.lng };
}

function getGridCoords(bounds: GribBoundsLike): { lat: number; lng: number }[] {
  const size = GRIB_GRID_SIZE;
  const coords: { lat: number; lng: number }[] = [];
  for (let r = 0; r < size; r++) {
    const lat = bounds.south + (r / (size - 1)) * (bounds.north - bounds.south);
    for (let c = 0; c < size; c++) {
      const lng = bounds.west + (c / (size - 1)) * (bounds.east - bounds.west);
      coords.push({ lat, lng });
    }
  }
  return coords;
}

export function getWindColorArray(speed: number): [number, number, number, number] {
  if (speed <= 5) return [34, 197, 94, 90];
  if (speed <= 10) return [163, 230, 53, 90];
  if (speed <= 15) return [234, 179, 8, 100];
  if (speed <= 20) return [249, 115, 22, 110];
  if (speed <= 30) return [239, 68, 68, 120];
  return [168, 85, 247, 140];
}

export function getTempColorArray(temp: number): [number, number, number, number] {
  if (temp <= 0) return [59, 130, 246, 90];
  if (temp <= 10) return [34, 211, 238, 90];
  if (temp <= 18) return [34, 197, 94, 90];
  if (temp <= 25) return [234, 179, 8, 100];
  if (temp <= 32) return [249, 115, 22, 115];
  return [239, 68, 68, 130];
}

/** Bilinear-interpolates a 10x10 grid onto a canvas and returns it as a data URL. */
export function renderHeatmapDataUrl(
  gridValues: number[],
  type: 'wind' | 'temp',
  width = 120,
  height = 120
): string {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;
  const imgData = ctx.createImageData(width, height);
  const size = GRIB_GRID_SIZE;

  for (let y = 0; y < height; y++) {
    const gy = ((height - 1 - y) / (height - 1)) * (size - 1);
    const r0 = Math.floor(gy);
    const r1 = Math.min(size - 1, r0 + 1);
    const dy = gy - r0;

    for (let x = 0; x < width; x++) {
      const gx = (x / (width - 1)) * (size - 1);
      const c0 = Math.floor(gx);
      const c1 = Math.min(size - 1, c0 + 1);
      const dx = gx - c0;

      const v00 = gridValues[r0 * size + c0];
      const v10 = gridValues[r0 * size + c1];
      const v01 = gridValues[r1 * size + c0];
      const v11 = gridValues[r1 * size + c1];
      const val = v00 * (1 - dx) * (1 - dy) + v10 * dx * (1 - dy) + v01 * (1 - dx) * dy + v11 * dx * dy;

      const color = type === 'wind' ? getWindColorArray(val) : getTempColorArray(val);
      const idx = (y * width + x) * 4;
      imgData.data[idx] = color[0];
      imgData.data[idx + 1] = color[1];
      imgData.data[idx + 2] = color[2];
      imgData.data[idx + 3] = color[3];
    }
  }
  ctx.putImageData(imgData, 0, 0);
  return canvas.toDataURL();
}

export function getWindBarbSVG(speed: number, direction: number): string {
  const numFlags = Math.floor(speed / 50);
  let remain = speed % 50;
  const numLongFeathers = Math.floor(remain / 10);
  remain = remain % 10;
  const numShortFeathers = Math.floor(remain / 5);

  let path = 'M 16 28 L 16 4';
  let y = 4;
  const xLeft = 16;
  const xRight = 26;

  for (let i = 0; i < numFlags; i++) {
    path += ` M ${xLeft} ${y} L ${xRight} ${y + 3} L ${xLeft} ${y + 6} Z`;
    y += 8;
  }
  for (let i = 0; i < numLongFeathers; i++) {
    path += ` M ${xLeft} ${y} L ${xRight} ${y - 4}`;
    y += 5;
  }
  for (let i = 0; i < numShortFeathers; i++) {
    path += ` M ${xLeft} ${y} L ${16 + (xRight - 16) / 2} ${y - 2}`;
    y += 5;
  }

  return `<svg viewBox="0 0 32 32" style="width: 28px; height: 28px; transform: rotate(${direction}deg); overflow: visible; color: var(--color-text);">
    <circle cx="16" cy="28" r="1.5" fill="currentColor"/>
    <path d="${path}" stroke="currentColor" stroke-width="2" fill="currentColor" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`;
}

let playTimer: ReturnType<typeof setInterval> | null = null;

export async function fetchGribForBounds(bounds: GribBoundsLike, force = false) {
  const current = get(grib);
  if (!force && current.bounds) {
    const centerLat = (bounds.north + bounds.south) / 2;
    const centerLng = (bounds.east + bounds.west) / 2;
    const oldCenterLat = (current.bounds.north + current.bounds.south) / 2;
    const oldCenterLng = (current.bounds.east + current.bounds.west) / 2;
    const dist = calculateHaversineDistance(centerLat, centerLng, oldCenterLat, oldCenterLng);
    if (dist < 5.0) return;
  }

  grib.update((g) => ({ ...g, bounds }));
  const coords = getGridCoords(bounds);
  const latsStr = coords.map((c) => c.lat.toFixed(4)).join(',');
  const lngsStr = coords.map((c) => c.lng.toFixed(4)).join(',');

  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latsStr}&longitude=${lngsStr}&hourly=temperature_2m,wind_speed_10m,wind_direction_10m&wind_speed_unit=kn&timezone=auto`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('GRIB API fetch failed');
    const data = await res.json();
    const locations: GribLocation[] = Array.isArray(data) ? data : [data];
    grib.update((g) => ({ ...g, data: locations }));
  } catch (err) {
    console.error('Failed to fetch GRIB data:', err);
  }
}

export function setOverlayType(type: 'wind' | 'temp') {
  grib.update((g) => ({ ...g, overlayType: type }));
}

export function setActiveTimeStep(index: number) {
  grib.update((g) => ({ ...g, activeTimeIndex: index }));
}

export function togglePlay() {
  const isPlaying = get(grib).isPlaying;
  if (isPlaying) {
    if (playTimer) clearInterval(playTimer);
    playTimer = null;
    grib.update((g) => ({ ...g, isPlaying: false }));
  } else {
    grib.update((g) => ({ ...g, isPlaying: true }));
    playTimer = setInterval(() => {
      const next = get(grib).activeTimeIndex + PLAY_STEP_HOURS;
      setActiveTimeStep(next > MAX_TIME_INDEX ? 0 : next);
    }, PLAY_INTERVAL_MS);
  }
}

export function activateGribOverlay(bounds: GribBoundsLike) {
  grib.update((g) => ({ ...g, active: true }));
  fetchGribForBounds(bounds, true);
}

export function deactivateGribOverlay() {
  if (get(grib).isPlaying) togglePlay();
  grib.set({ overlayType: get(grib).overlayType, activeTimeIndex: get(grib).activeTimeIndex, data: null, bounds: null, isPlaying: false, active: false });
}

export interface WeatherAtPoint {
  windSpeed: number;
  windDir: number;
  temp: string;
}

export function getWeatherDataAtLatLng(lat: number, lng: number): WeatherAtPoint | null {
  const g = get(grib);
  if (!g.data || g.data.length === 0) return null;

  let closest: GribLocation | null = null;
  let minDistSq = Infinity;
  for (const loc of g.data) {
    const dLat = loc.latitude - lat;
    const dLng = loc.longitude - lng;
    const distSq = dLat * dLat + dLng * dLng;
    if (distSq < minDistSq) {
      minDistSq = distSq;
      closest = loc;
    }
  }
  if (!closest?.hourly) return null;

  const idx = g.activeTimeIndex;
  const windSpeed = closest.hourly.wind_speed_10m?.[idx] ?? 0;
  const windDir = closest.hourly.wind_direction_10m?.[idx] ?? 0;
  const temp = closest.hourly.temperature_2m?.[idx] ?? 0;

  return { windSpeed: Math.round(windSpeed), windDir, temp: temp.toFixed(1) };
}
