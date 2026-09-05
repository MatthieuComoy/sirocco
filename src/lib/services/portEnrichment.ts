// Online-only companion to portSearch.ts: geocodes a free-text place name
// (any town, not just the ones in the offline pack), checks whether one of
// our known ports is nearby, and pulls a short summary + photo from
// Wikipedia to enrich its popup. Everything here is best-effort — network
// failures degrade to "no enrichment" rather than surfacing an error, since
// this only ever supplements an offline search result that already works.
import { calculateHaversineDistance } from './utils';
import type { Port } from './portSearch';

const PROXIMITY_THRESHOLD_METERS = 10_000;
const FETCH_TIMEOUT_MS = 4000;

export interface GeocodedPlace {
  lat: number;
  lon: number;
  displayName: string;
}

export interface WikipediaSummary {
  title: string;
  extract: string;
  thumbnailUrl: string | null;
  pageUrl: string;
}

export interface NearbyPortMatch {
  port: Port;
  distanceMeters: number;
}

async function fetchJsonWithTimeout(url: string, headers?: Record<string, string>): Promise<unknown | null> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(url, { headers, signal: controller.signal });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  } finally {
    clearTimeout(timeoutId);
  }
}

export async function geocodeQuery(query: string): Promise<GeocodedPlace | null> {
  const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(query)}`;
  const data = (await fetchJsonWithTimeout(url, { 'User-Agent': 'SirrocoMarineNavigation/1.0' })) as
    | Array<{ lat: string; lon: string; display_name: string }>
    | null;
  const first = data?.[0];
  if (!first) return null;
  return { lat: parseFloat(first.lat), lon: parseFloat(first.lon), displayName: first.display_name };
}

export function findNearestKnownPort(ports: Port[], lat: number, lon: number): NearbyPortMatch | null {
  let best: NearbyPortMatch | null = null;
  for (const port of ports) {
    const distanceMeters = calculateHaversineDistance(lat, lon, port.lat, port.lon);
    if (distanceMeters <= PROXIMITY_THRESHOLD_METERS && (!best || distanceMeters < best.distanceMeters)) {
      best = { port, distanceMeters };
    }
  }
  return best;
}

export async function fetchWikipediaSummary(title: string): Promise<WikipediaSummary | null> {
  const url = `https://fr.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`;
  const data = (await fetchJsonWithTimeout(url)) as
    | {
        title?: string;
        extract?: string;
        thumbnail?: { source?: string };
        content_urls?: { desktop?: { page?: string } };
      }
    | null;
  if (!data?.extract) return null;
  return {
    title: data.title ?? title,
    extract: data.extract,
    thumbnailUrl: data.thumbnail?.source ?? null,
    pageUrl: data.content_urls?.desktop?.page ?? `https://fr.wikipedia.org/wiki/${encodeURIComponent(title)}`,
  };
}
