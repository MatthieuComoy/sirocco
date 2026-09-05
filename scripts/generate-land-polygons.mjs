#!/usr/bin/env node
// Generates the bundled land data used by the route-planning feature to
// guarantee a computed route never crosses land (see
// src/lib/services/routing/). Re-run this whenever the regions or
// simplification settings below change — it's not part of the normal build,
// same spirit as scripts/refresh-warnings-data.mjs.
//
// Source: Natural Earth 1:10m physical vectors (public domain), fetched as
// the official shapefiles from Natural Earth's own S3 bucket and converted
// with the `shapefile` package (its GitHub GeoJSON mirror turned out
// unreliable to reason about directly — same underlying data, worse to trust
// blindly).
//
// A non-obvious wrinkle in Natural Earth's `ne_10m_land` shapefile, verified
// empirically before writing this script (do not "simplify" this away
// without re-checking): it ships 11 top-level features, not one land
// polygon. 10 of them are real, ADDITIVE tiers of detail — feature 0
// (scalerank 0, min_zoom 0) holds the ~97 major landmasses, and the rest add
// progressively smaller islands meant to appear at higher zoom levels — plus
// one "Null island" 1-vertex artifact at index 10 to discard. There is no
// single "complete" feature to cherry-pick: the correct complete dataset is
// the union of all 10 real features (confirmed by point-in-polygon testing
// a France coordinate — it's only found once no other feature is skipped).
//
// Each region is clipped to a bbox only — deliberately NOT narrowed to a
// coastal corridor. An earlier version of this script buffered the
// coastline and intersected it with the land to keep only a slim coastal
// fringe, on the theory that deep inland land is irrelevant to routing. That
// broke the "is this destination even reachable by boat" check: a search
// result like Paris sits outside any coastal buffer, so it would read as
// "not on land" and the routing algorithm could draw a straight line clean
// through the middle of France undetected. The full bbox-clipped landmass —
// inland included — is what `isPointOnLand()` needs to be correct
// everywhere in the bbox. Keeping the routing graph itself small is instead
// the job of `buildVisibilityGraph()`'s search envelope at query time (see
// src/lib/services/routing/visibilityGraph.ts), not the bundled data.

import { writeFile, mkdir, mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import AdmZip from 'adm-zip';
import * as shapefile from 'shapefile';
import * as turf from '@turf/turf';

const LAND_ZIP_URL = 'https://naturalearth.s3.amazonaws.com/10m_physical/ne_10m_land.zip';
const SIMPLIFY_TOLERANCE = 0.0008; // degrees (~90m at mid-latitudes) — tune for output size vs fidelity

// Matches the AVURNAV/AVINAV series this app already covers (see
// src/lib/services/pingWarnings.ts) — Mayotte, Nouvelle Calédonie and
// St Pierre et Miquelon are excluded from v1 the same way those series are
// left `enabled: false` there.
const REGIONS = [
  { file: 'metropole.geojson', bbox: [-5.5, 41.3, 9.7, 51.1] },
  { file: 'antilles.geojson', bbox: [-63.2, 14.0, -60.5, 18.2] },
  { file: 'guyane.geojson', bbox: [-54.6, 2.0, -51.5, 6.0] },
  { file: 'reunion.geojson', bbox: [55.0, -21.5, 55.9, -20.7] },
  { file: 'polynesie.geojson', bbox: [-155.5, -28.5, -134.0, -7.5] },
];

const OUTPUT_DIR = new URL('../public/data/land-polygons/', import.meta.url);

async function downloadZip(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} fetching ${url}`);
  return Buffer.from(await res.arrayBuffer());
}

/** Extracts a Natural Earth shapefile zip and reads every feature from it. */
async function readShapefileZip(zipBuffer, baseName) {
  const dir = await mkdtemp(join(tmpdir(), 'ne-shp-'));
  try {
    new AdmZip(zipBuffer).extractAllTo(dir, true);
    const source = await shapefile.open(join(dir, `${baseName}.shp`), join(dir, `${baseName}.dbf`));
    const features = [];
    let result = await source.read();
    while (!result.done) {
      features.push(result.value);
      result = await source.read();
    }
    return features;
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
}

function cleanFeatureClass(properties) {
  return (properties?.featurecla || '').replace(/\0/g, '').trim();
}

/** Every real land polygon part, flattened to single Polygons — see the
 *  file-level comment on why this is a union of all 10 real top-level
 *  features rather than one of them. */
function flattenAllLandParts(landFeatures) {
  const real = landFeatures.filter((f) => cleanFeatureClass(f.properties) !== 'Null island');
  return real.flatMap((f) => turf.flatten(f).features);
}

function unionAll(features) {
  if (features.length === 0) return null;
  if (features.length === 1) return features[0];
  return turf.union(turf.featureCollection(features));
}

function clipRegion(landParts, bbox) {
  const bboxPoly = turf.bboxPolygon(bbox);
  const relevantParts = landParts.filter((f) => turf.booleanIntersects(turf.bboxPolygon(turf.bbox(f)), bboxPoly));
  const clippedParts = relevantParts
    .map((f) => turf.bboxClip(f, bbox))
    .filter((f) => f.geometry.coordinates.length > 0);
  return unionAll(clippedParts);
}

async function main() {
  console.log('Downloading Natural Earth land shapefile...');
  const landZip = await downloadZip(LAND_ZIP_URL);
  const landFeatures = await readShapefileZip(landZip, 'ne_10m_land');
  const landParts = flattenAllLandParts(landFeatures);
  console.log(`Loaded ${landParts.length} land polygon parts.`);

  await mkdir(OUTPUT_DIR, { recursive: true });

  for (const region of REGIONS) {
    const clipped = clipRegion(landParts, region.bbox);
    if (!clipped) {
      console.warn(`WARN  ${region.file}: no land found in this bbox — check the bbox is correct.`);
      continue;
    }
    const simplified = turf.simplify(clipped, { tolerance: SIMPLIFY_TOLERANCE, highQuality: true });
    const output = turf.featureCollection([simplified]);
    const json = JSON.stringify(output);
    await writeFile(new URL(region.file, OUTPUT_DIR), json, 'utf-8');
    console.log(`OK    ${region.file} (${(json.length / 1024).toFixed(0)} KB)`);
  }
}

main().catch((err) => {
  console.error('Failed to generate land polygons:', err);
  process.exitCode = 1;
});
