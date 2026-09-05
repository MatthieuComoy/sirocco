// Loads the bundled land polygon data (see scripts/generate-land-polygons.mjs)
// and memoizes it for the session. Unlike pingWarnings.ts there's no live
// counterpart to fall back from here — this data has no "live" version, so
// there's nothing to race against a live fetch for.
import type { Bbox, LandPolygon, Point } from './types';

const REGION_FILES = [
  '/data/land-polygons/metropole.geojson',
  '/data/land-polygons/antilles.geojson',
  '/data/land-polygons/guyane.geojson',
  '/data/land-polygons/reunion.geojson',
  '/data/land-polygons/polynesie.geojson',
];

interface GeoJsonPolygonGeometry {
  type: 'Polygon';
  coordinates: Point[][];
}
interface GeoJsonMultiPolygonGeometry {
  type: 'MultiPolygon';
  coordinates: Point[][][];
}
interface GeoJsonFeatureCollection {
  type: 'FeatureCollection';
  features: { geometry: GeoJsonPolygonGeometry | GeoJsonMultiPolygonGeometry }[];
}

function ringsBbox(rings: Point[][]): Bbox {
  let [minLon, minLat, maxLon, maxLat] = [Infinity, Infinity, -Infinity, -Infinity];
  for (const ring of rings) {
    for (const [lon, lat] of ring) {
      if (lon < minLon) minLon = lon;
      if (lat < minLat) minLat = lat;
      if (lon > maxLon) maxLon = lon;
      if (lat > maxLat) maxLat = lat;
    }
  }
  return [minLon, minLat, maxLon, maxLat];
}

function toLandPolygons(fc: GeoJsonFeatureCollection): LandPolygon[] {
  const polygons: LandPolygon[] = [];
  for (const feature of fc.features) {
    const polygonRingSets = feature.geometry.type === 'Polygon' ? [feature.geometry.coordinates] : feature.geometry.coordinates;
    for (const rings of polygonRingSets) {
      polygons.push({ rings, bbox: ringsBbox(rings) });
    }
  }
  return polygons;
}

let cached: Promise<LandPolygon[]> | null = null;

/** Fetches and flattens all bundled region files into one list of land
 *  polygons (one entry per polygon "part" — a region file's MultiPolygon is
 *  split so bbox-based rejection in geometry.ts can skip irrelevant islands
 *  individually instead of always testing a whole region at once). */
export function loadLandPolygons(): Promise<LandPolygon[]> {
  if (!cached) {
    cached = Promise.all(
      REGION_FILES.map(async (url) => {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Failed to load ${url}: HTTP ${response.status}`);
        const fc = (await response.json()) as GeoJsonFeatureCollection;
        return toLandPolygons(fc);
      })
    ).then((lists) => lists.flat());
  }
  return cached;
}
