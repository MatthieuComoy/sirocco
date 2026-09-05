// Classic visibility-graph shortest path: candidate nodes are the query
// points plus every nearby obstacle vertex, edges connect any pair with a
// clear line of sight, and the shortest path through that graph is the
// shortest path that goes around the obstacles — the same principle behind
// real polygon-avoidance pathfinding tools, hand-rolled here since the graph
// stays small (a handful of coastal polygons' worth of vertices near the
// direct line, not the whole bundled dataset).
import { bboxesIntersect, distanceMeters, segmentIntersectsAnyLand } from './geometry';
import type { Bbox, LandPolygon, Point } from './types';

export interface GraphBuildOptions {
  /** Hard cap on total graph size — see the note in routePlanner.ts about
   *  dense archipelagos. Above this, computeRoute() reports 'unreachable'
   *  rather than building a graph large enough to be slow. */
  maxNodes?: number;
}

export interface VisibilityGraph {
  nodes: Point[];
  adjacency: Map<number, { to: number; weight: number }[]>;
}

const DEFAULT_MAX_NODES = 400;

function addEdge(adjacency: Map<number, { to: number; weight: number }[]>, from: number, to: number, weight: number) {
  const existing = adjacency.get(from);
  if (existing) existing.push({ to, weight });
  else adjacency.set(from, [{ to, weight }]);
}

function isInBbox(pt: Point, bbox: Bbox): boolean {
  return pt[0] >= bbox[0] && pt[0] <= bbox[2] && pt[1] >= bbox[1] && pt[1] <= bbox[3];
}

export function buildVisibilityGraph(
  start: Point,
  destination: Point,
  polygons: LandPolygon[],
  envelope: Bbox,
  opts: GraphBuildOptions = {}
): VisibilityGraph {
  const maxNodes = opts.maxNodes ?? DEFAULT_MAX_NODES;
  const relevantPolygons = polygons.filter((p) => bboxesIntersect(p.bbox, envelope));

  const candidateVertices: Point[] = [];
  for (const polygon of relevantPolygons) {
    for (const ring of polygon.rings) {
      for (const vertex of ring) {
        if (isInBbox(vertex, envelope)) candidateVertices.push(vertex);
      }
    }
  }

  const nodes: Point[] = [start, destination, ...candidateVertices.slice(0, Math.max(0, maxNodes - 2))];
  const adjacency = new Map<number, { to: number; weight: number }[]>();

  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      if (!segmentIntersectsAnyLand(nodes[i], nodes[j], relevantPolygons)) {
        const weight = distanceMeters(nodes[i], nodes[j]);
        addEdge(adjacency, i, j, weight);
        addEdge(adjacency, j, i, weight);
      }
    }
  }

  return { nodes, adjacency };
}

/** Hand-written O(N^2) Dijkstra — no priority-queue dependency needed at the
 *  node counts this graph stays at (see maxNodes above). Returns the path
 *  as a list of node indices, or null if unreachable. */
export function dijkstra(
  nodeCount: number,
  adjacency: Map<number, { to: number; weight: number }[]>,
  startIdx: number,
  endIdx: number
): number[] | null {
  const dist = new Array<number>(nodeCount).fill(Infinity);
  const prev = new Array<number>(nodeCount).fill(-1);
  const visited = new Array<boolean>(nodeCount).fill(false);
  dist[startIdx] = 0;

  for (let iter = 0; iter < nodeCount; iter++) {
    let u = -1;
    let best = Infinity;
    for (let i = 0; i < nodeCount; i++) {
      if (!visited[i] && dist[i] < best) {
        best = dist[i];
        u = i;
      }
    }
    if (u === -1 || u === endIdx) break;
    visited[u] = true;
    for (const edge of adjacency.get(u) ?? []) {
      const alt = dist[u] + edge.weight;
      if (alt < dist[edge.to]) {
        dist[edge.to] = alt;
        prev[edge.to] = u;
      }
    }
  }

  if (dist[endIdx] === Infinity) return null;

  const path: number[] = [];
  for (let cur = endIdx; cur !== -1; cur = prev[cur]) path.unshift(cur);
  return path;
}
