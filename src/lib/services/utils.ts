// Pure calculation helpers — ported from legacy/js/utils.js. Tide math lives
// in tides.ts instead (see architecture plan §1).
import L from 'leaflet';

export function calculateHaversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371000; // Earth radius in meters
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // meters
}

const WIND_CARDINALS = [
  'N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE',
  'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW',
] as const;

export function getWindCardinal(degrees: number): string {
  const index = Math.round(degrees / 22.5) % 16;
  return WIND_CARDINALS[index];
}

export type PointOfSail =
  | 'Bout au vent'
  | 'Près'
  | 'Bon plein'
  | 'Travers'
  | 'Largue'
  | 'Grand largue'
  | 'Vent arrière';

export function getPointOfSail(
  heading: number | null | undefined,
  windDir: number | null | undefined
): PointOfSail {
  if (heading === null || windDir === null || heading === undefined || windDir === undefined) {
    return 'Bout au vent';
  }

  let diff = Math.abs(heading - windDir) % 360;
  if (diff > 180) diff = 360 - diff;

  if (diff < 35) return 'Bout au vent';
  if (diff < 55) return 'Près';
  if (diff < 80) return 'Bon plein';
  if (diff < 110) return 'Travers';
  if (diff < 145) return 'Largue';
  if (diff < 165) return 'Grand largue';
  return 'Vent arrière';
}

export function formatDurationShort(ms: number): string {
  const totalSecs = Math.floor(ms / 1000);
  const hrs = Math.floor(totalSecs / 3600);
  const mins = Math.floor((totalSecs % 3600) / 60);
  const secs = totalSecs % 60;

  if (hrs > 0) return `${hrs}h ${mins}m`;
  if (mins > 0) return `${mins}m ${secs}s`;
  return `${secs}s`;
}

export function escapeXml(unsafe: string | null | undefined): string {
  if (!unsafe) return '';
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
}

export function hexToRgb(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r},${g},${b}`;
}

/**
 * Fake depth sounder: deeper offshore, shoaling near a fixed point close to
 * Toulon harbour. Not a real sensor — reproduced as-is from the legacy app.
 */
export function getSimulatedDepth(lat: number, lng: number): number {
  const harborCenter = L.latLng(43.115, 5.93);
  const dist = calculateHaversineDistance(lat, lng, harborCenter.lat, harborCenter.lng);

  let depth = 15.0 - 13.0 * Math.max(0, 1.0 - dist / 2500);
  if (depth < 1.2) depth = 1.2;
  return depth;
}
