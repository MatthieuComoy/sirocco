// Not wired into computeRoute() yet — v1 only avoids land. Kept here as the
// one explicit, named place a future hazard-avoidance step would convert a
// navigation warning's zone into something segmentIntersectsAnyLand() can
// treat as an obstacle, so that step doesn't have to invent (or silently
// assume) a coordinate-order convention when it lands.
import type { WarningGeometry } from '../../stores/warnings';
import type { LandPolygon, Point } from './types';

export function warningGeometryToLandPolygon(geom: Extract<WarningGeometry, { type: 'Polygon' }>): LandPolygon {
  // Warning.geometry coordinates are [lat, lon] in a single flat ring (see
  // warnings.ts) — the opposite convention and ring shape from this
  // module's [lon, lat] nested rings (see types.ts). The flip happens here,
  // once, explicitly.
  const ring: Point[] = geom.coordinates.map(([lat, lon]) => [lon, lat]);

  let minLon = Infinity;
  let minLat = Infinity;
  let maxLon = -Infinity;
  let maxLat = -Infinity;
  for (const [lon, lat] of ring) {
    if (lon < minLon) minLon = lon;
    if (lat < minLat) minLat = lat;
    if (lon > maxLon) maxLon = lon;
    if (lat > maxLat) maxLat = lat;
  }

  return { rings: [ring], bbox: [minLon, minLat, maxLon, maxLat] };
}
