// Forward geocoding for the route-planning search UI. Same Nominatim host
// already used for reverse geocoding in weather.ts (nominatim.openstreetmap.org
// works directly from the browser — no CORS proxy needed, and no
// service-worker change either: its existing hostname-matched cache rule in
// src/sw.ts already covers this path too).
export interface PlaceResult {
  lat: number;
  lon: number;
  label: string;
}

interface NominatimSearchResult {
  lat: string;
  lon: string;
  display_name: string;
}

export async function searchPlaces(query: string, signal?: AbortSignal): Promise<PlaceResult[]> {
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=6&accept-language=fr`;
  const response = await fetch(url, {
    headers: { 'User-Agent': 'SirrocoMarineNavigation/1.0' },
    signal,
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const data = (await response.json()) as NominatimSearchResult[];
  return data.map((d) => ({
    lat: parseFloat(d.lat),
    lon: parseFloat(d.lon),
    label: d.display_name.split(',').slice(0, 2).join(','),
  }));
}
