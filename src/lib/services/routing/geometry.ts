// Pure geometry primitives for land-avoidance routing. No dependency on
// turf or any geometry library client-side (see routePlanner.ts) — these
// are small, self-contained, and easy to reason about/test in isolation,
// which matters given the previous route-planning feature's bug was
// exactly a land-avoidance check that silently never ran (see the
// file-level comment in routePlanner.ts).
import { calculateHaversineDistance } from '../utils';
import type { Bbox, LandPolygon, Point } from './types';

// Treat a segment that only grazes a coastline vertex/edge as blocked
// rather than allowed — err conservative for a navigation safety feature.
// In degrees; ~1cm at these latitudes, far smaller than any real-world gap
// that should matter, but enough to swallow floating-point noise.
const EPSILON = 1e-7;

export function bboxesIntersect(a: Bbox, b: Bbox): boolean {
  return a[0] <= b[2] && a[2] >= b[0] && a[1] <= b[3] && a[3] >= b[1];
}

function segmentBbox(a: Point, b: Point): Bbox {
  return [Math.min(a[0], b[0]), Math.min(a[1], b[1]), Math.max(a[0], b[0]), Math.max(a[1], b[1])];
}

function orientation(p: Point, q: Point, r: Point): -1 | 0 | 1 {
  const val = (q[1] - p[1]) * (r[0] - q[0]) - (q[0] - p[0]) * (r[1] - q[1]);
  if (Math.abs(val) < EPSILON) return 0;
  return val > 0 ? 1 : -1;
}

/** Is q within p/r's bounding box, given p/q/r are (near-)collinear? */
function onSegment(p: Point, q: Point, r: Point): boolean {
  return (
    q[0] >= Math.min(p[0], r[0]) - EPSILON &&
    q[0] <= Math.max(p[0], r[0]) + EPSILON &&
    q[1] >= Math.min(p[1], r[1]) - EPSILON &&
    q[1] <= Math.max(p[1], r[1]) + EPSILON
  );
}

/** Standard orientation-based segment intersection test. Touching
 *  endpoints/collinear overlap count as intersecting (conservative). */
export function segmentsIntersect(p1: Point, q1: Point, p2: Point, q2: Point): boolean {
  const o1 = orientation(p1, q1, p2);
  const o2 = orientation(p1, q1, q2);
  const o3 = orientation(p2, q2, p1);
  const o4 = orientation(p2, q2, q1);

  if (o1 !== o2 && o3 !== o4) return true;

  if (o1 === 0 && onSegment(p1, p2, q1)) return true;
  if (o2 === 0 && onSegment(p1, q2, q1)) return true;
  if (o3 === 0 && onSegment(p2, p1, q2)) return true;
  if (o4 === 0 && onSegment(p2, q1, q2)) return true;

  return false;
}

/** Ray-casting point-in-ring test (even-odd rule). */
function pointInRing(pt: Point, ring: Point[]): boolean {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i];
    const [xj, yj] = ring[j];
    const crosses = yi > pt[1] !== yj > pt[1] && pt[0] < ((xj - xi) * (pt[1] - yi)) / (yj - yi) + xi;
    if (crosses) inside = !inside;
  }
  return inside;
}

/** Inside the outer ring and not inside any hole. */
export function pointInPolygon(pt: Point, polygon: LandPolygon): boolean {
  if (!pointInRing(pt, polygon.rings[0])) return false;
  for (let h = 1; h < polygon.rings.length; h++) {
    if (pointInRing(pt, polygon.rings[h])) return false;
  }
  return true;
}

function pointsApproxEqual(a: Point, b: Point): boolean {
  return Math.abs(a[0] - b[0]) < EPSILON && Math.abs(a[1] - b[1]) < EPSILON;
}

export function segmentIntersectsPolygon(a: Point, b: Point, polygon: LandPolygon): boolean {
  if (!bboxesIntersect(segmentBbox(a, b), polygon.bbox)) return false;

  for (const ring of polygon.rings) {
    for (let i = 0; i < ring.length - 1; i++) {
      const p = ring[i];
      const q = ring[i + 1];
      // Visibility-graph candidate nodes are themselves land polygon
      // vertices (see visibilityGraph.ts) — a query segment that starts or
      // ends exactly at one only *touches* that vertex's own two ring
      // edges there, it doesn't cross them. Without skipping those, every
      // sight line leaving a coastal vertex would register as blocked by
      // its own coastline.
      if (pointsApproxEqual(a, p) || pointsApproxEqual(a, q) || pointsApproxEqual(b, p) || pointsApproxEqual(b, q)) continue;
      if (segmentsIntersect(a, b, p, q)) return true;
    }
  }

  // No boundary crossing found — the segment is either entirely inside or
  // entirely outside the polygon. Any point on it (the midpoint) settles
  // which, since it can't cross the boundary partway through undetected.
  const midpoint: Point = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
  return pointInPolygon(midpoint, polygon);
}

export function segmentIntersectsAnyLand(a: Point, b: Point, polygons: LandPolygon[]): boolean {
  const bbox = segmentBbox(a, b);
  for (const polygon of polygons) {
    if (!bboxesIntersect(bbox, polygon.bbox)) continue;
    if (segmentIntersectsPolygon(a, b, polygon)) return true;
  }
  return false;
}

export function isPointOnLand(pt: Point, polygons: LandPolygon[]): boolean {
  for (const polygon of polygons) {
    if (pt[0] < polygon.bbox[0] || pt[0] > polygon.bbox[2] || pt[1] < polygon.bbox[1] || pt[1] > polygon.bbox[3]) continue;
    if (pointInPolygon(pt, polygon)) return true;
  }
  return false;
}

export function distanceMeters(a: Point, b: Point): number {
  return calculateHaversineDistance(a[1], a[0], b[1], b[0]);
}
