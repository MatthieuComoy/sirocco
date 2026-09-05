// Route-planning entrypoint. Computes the shortest water route between two
// points, guaranteed not to cross land.
//
// A previous route-planning feature (js/routing.js, legacy vanilla-JS app,
// removed in commit bcfbebf) was deleted for two reasons this module must
// not repeat: (1) it used a hardcoded graph of ~40 waypoints covering only
// two small regions, useless anywhere else — this module instead works
// anywhere within the bundled land data's coverage (metropolitan France +
// the same French overseas territories the app's AVURNAV/AVINAV data
// already covers). (2) its land-avoidance safety check was gated on a field
// (`node.type === 'port'`) that nothing ever set, so it silently never ran
// and routes could cut across land undetected — here, land-avoidance is an
// actual geometric segment-vs-polygon test (geometry.ts) run
// unconditionally, not a distance heuristic that can be silently skipped.
import { distanceMeters, isPointOnLand, segmentIntersectsAnyLand } from './geometry';
import { loadLandPolygons } from './landData';
import { buildVisibilityGraph, dijkstra } from './visibilityGraph';
import type { Bbox, Point, RouteResult } from './types';

// How many times to widen the search envelope around the direct start→
// destination line before giving up. Handles routes that must detour
// further than the initial padding allows (e.g. a long peninsula) — a real
// case, not just theoretical: a due-north/due-south route past Cap Sizun
// needed padding out to 8x the (near-zero, same-longitude) direct-line
// bbox before a path existed. Doubling from 1x for 5 attempts reaches 16x,
// comfortably past that.
const MAX_ENVELOPE_ATTEMPTS = 5;
const INITIAL_PADDING_FRACTION = 1;

function bboxOf(a: Point, b: Point): Bbox {
  return [Math.min(a[0], b[0]), Math.min(a[1], b[1]), Math.max(a[0], b[0]), Math.max(a[1], b[1])];
}

function padBbox(bbox: Bbox, fraction: number): Bbox {
  // A direct line that's a single point or runs due N-S/E-W has a
  // near-zero-width bbox on one axis — fall back to a fixed absolute pad
  // (~0.3° ≈ 30km) so the envelope isn't degenerate on that axis and can
  // still reach a real detour distance as fraction grows.
  const width = bbox[2] - bbox[0] || 0.3;
  const height = bbox[3] - bbox[1] || 0.3;
  const padX = width * fraction;
  const padY = height * fraction;
  return [bbox[0] - padX, bbox[1] - padY, bbox[2] + padX, bbox[3] + padY];
}

function pathLength(coordinates: Point[]): number {
  let total = 0;
  for (let i = 1; i < coordinates.length; i++) total += distanceMeters(coordinates[i - 1], coordinates[i]);
  return total;
}

/**
 * Computes the shortest water route from `start` to `destination`.
 *
 * Known v1 limitations (stated, not silently glossed over):
 * - Outside the 5 bundled regions there is no land data at all, so a point
 *   there can't be distinguished from "open ocean, fine" vs. "there's a
 *   landmass we have no data for" — an 'ok' result there isn't a full
 *   guarantee the way it is within the bundled regions.
 * - A destination inside a dense archipelago could pull in enough obstacle
 *   vertices to hit buildVisibilityGraph's node cap; this returns
 *   'unreachable' rather than building an unbounded graph.
 * - None of the 5 bundled regions cross the antimeridian, so no ±180°
 *   wraparound handling exists here — don't "fix" that without re-checking
 *   scripts/generate-land-polygons.mjs's region bboxes first.
 */
export async function computeRoute(start: Point, destination: Point): Promise<RouteResult> {
  const polygons = await loadLandPolygons();

  if (isPointOnLand(start, polygons)) return { status: 'start_on_land' };
  if (isPointOnLand(destination, polygons)) return { status: 'destination_on_land' };

  // Fast path: most open-water routes need no detour at all.
  if (!segmentIntersectsAnyLand(start, destination, polygons)) {
    return { status: 'ok', coordinates: [start, destination], distanceMeters: distanceMeters(start, destination) };
  }

  const baseBbox = bboxOf(start, destination);
  let paddingFraction = INITIAL_PADDING_FRACTION;
  for (let attempt = 0; attempt < MAX_ENVELOPE_ATTEMPTS; attempt++) {
    const envelope = padBbox(baseBbox, paddingFraction);
    const { nodes, adjacency } = buildVisibilityGraph(start, destination, polygons, envelope);
    const pathIndices = dijkstra(nodes.length, adjacency, 0, 1);
    if (pathIndices) {
      const coordinates = pathIndices.map((i) => nodes[i]);
      return { status: 'ok', coordinates, distanceMeters: pathLength(coordinates) };
    }
    paddingFraction *= 2;
  }

  return { status: 'unreachable' };
}
