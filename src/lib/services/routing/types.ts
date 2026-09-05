// Deliberately standard GeoJSON [lon, lat] with nested polygon rings here —
// NOT this app's WarningGeometry [lat, lon] flat-ring convention (see
// src/lib/stores/warnings.ts). The bundled land data (see
// scripts/generate-land-polygons.mjs) is produced by turf, which speaks
// GeoJSON natively, so there's no lat/lon transposition step between the
// generation script and this module — exactly the class of silent
// coordinate-order bug that sank the previous route-planning feature (see
// the file-level comment in routePlanner.ts). A future hazard-avoidance
// pass reusing Warning geometries should go through one explicit, named
// adapter (adapters.ts) rather than quietly mixing the two conventions.

/** [lon, lat] */
export type Point = [number, number];

/** [minLon, minLat, maxLon, maxLat] */
export type Bbox = [number, number, number, number];

export interface LandPolygon {
  /** rings[0] = outer boundary, rings[1..] = holes. Each ring is closed
   *  (first point === last point). */
  rings: Point[][];
  bbox: Bbox;
}

export type RouteStatus = 'ok' | 'start_on_land' | 'destination_on_land' | 'unreachable';

export interface RouteResult {
  status: RouteStatus;
  /** Only set when status === 'ok'. */
  coordinates?: Point[];
  /** Only set when status === 'ok'. */
  distanceMeters?: number;
}
