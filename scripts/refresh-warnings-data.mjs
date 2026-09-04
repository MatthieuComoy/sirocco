#!/usr/bin/env node
// Refreshes the bundled offline fallback data in public/data/ from the live
// APIs. The app only ever falls back to these files when a live fetch fails
// (see src/lib/services/pingWarnings.ts) — but ping-info-nautique.fr sends
// no CORS headers at all, so every browser-side fetch fails and the app
// always ends up here. Left unrefreshed, these files just get older
// forever; run this periodically (manually for now, or from a scheduled CI
// job later) to keep that fallback reasonably current.
//
// Keep SERIES in sync with the SERIES array in
// src/lib/services/pingWarnings.ts (only its `enabled: true` entries, minus
// NAVAREA II which is disabled there and never actually fetched by the app).
//
// The overseas series are named after the issuing MRCC, not the territory —
// e.g. Réunion is "LA REUNION", Guyane is "CAYENNE", Antilles is "FORT DE
// FRANCE", Polynésie is "PAPEETE". No working name was found for Mayotte,
// Nouvelle Calédonie or St Pierre et Miquelon (every guess returned the
// API's "nameOfSeries is unknown" error) — their local files have always
// been empty stubs, so they're skipped here too rather than left broken.

import { writeFile } from 'node:fs/promises';

const SERIES = [
  { id: 'AVURNAV TOULON', file: 'toulon.xml' },
  { id: 'AVURNAV BREST', file: 'brest.xml' },
  { id: 'AVURNAV CHERBOURG', file: 'cherbourg.xml' },
  { id: 'AVINAV TOULON', file: 'avinav_toulon.xml' },
  { id: 'AVINAV BREST', file: 'avinav_brest.xml' },
  { id: 'AVINAV CHERBOURG', file: 'avinav_cherbourg.xml' },
  { id: 'AVURNAV LOCAL TOULON', file: 'avurnav_local_toulon.xml' },
  { id: 'AVURNAV LOCAL BREST', file: 'avurnav_local_brest.xml' },
  { id: 'AVURNAV LOCAL CHERBOURG', file: 'avurnav_local_cherbourg.xml' },
  { id: 'AVURNAV FORT DE FRANCE', file: 'antilles.xml' },
  { id: 'AVURNAV CAYENNE', file: 'guyane.xml' },
  { id: 'AVURNAV LA REUNION', file: 'reunion.xml' },
  { id: 'AVURNAV PAPEETE', file: 'polynesie.xml' },
  { id: 'AVINAV FORT DE FRANCE', file: 'avinav_antilles.xml' },
  { id: 'AVINAV CAYENNE', file: 'avinav_guyane.xml' },
  { id: 'AVINAV LA REUNION', file: 'avinav_reunion.xml' },
  { id: 'AVINAV PAPEETE', file: 'avinav_polynesie.xml' },
  { id: 'AVURNAV LOCAL FORT DE FRANCE', file: 'avurnav_local_antilles.xml' },
  { id: 'AVURNAV LOCAL CAYENNE', file: 'avurnav_local_guyane.xml' },
  { id: 'AVURNAV LOCAL LA REUNION', file: 'avurnav_local_reunion.xml' },
  { id: 'AVURNAV LOCAL PAPEETE', file: 'avurnav_local_polynesie.xml' },
];

const NGA_URL = 'https://msi.nga.mil/api/publications/broadcast-warn?status=active&output=json';
const DATA_DIR = new URL('../public/data/', import.meta.url);
const REQUEST_DELAY_MS = 200; // be polite to the API between requests

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function refreshSeries({ id, file }) {
  const url = `https://services.ping-info-nautique.fr/nw/v1/Get_NW_Messages?nameOfSeries=${encodeURIComponent(id)}&lang=fr`;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const xml = await response.text();
  if (!xml.trimStart().startsWith('<?xml') || !xml.includes('ExchangeSet')) {
    throw new Error('response does not look like S-124 XML');
  }
  await writeFile(new URL(file, DATA_DIR), xml, 'utf-8');
  return xml.length;
}

async function refreshNga() {
  const response = await fetch(NGA_URL);
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const data = await response.json();
  const items = data['broadcast-warn'] || [];
  await writeFile(new URL('nga_warnings.json', DATA_DIR), JSON.stringify(items, null, 2) + '\n', 'utf-8');
  return items.length;
}

async function main() {
  let failures = 0;

  for (const series of SERIES) {
    try {
      const bytes = await refreshSeries(series);
      console.log(`OK    ${series.file} (${bytes} bytes)`);
    } catch (err) {
      failures++;
      console.error(`FAIL  ${series.file}: ${err.message}`);
    }
    await sleep(REQUEST_DELAY_MS);
  }

  try {
    const count = await refreshNga();
    console.log(`OK    nga_warnings.json (${count} items)`);
  } catch (err) {
    failures++;
    console.error(`FAIL  nga_warnings.json: ${err.message}`);
  }

  if (failures > 0) {
    console.error(`\n${failures} source(s) failed to refresh — check the warnings above.`);
    process.exitCode = 1;
  }
}

main();
