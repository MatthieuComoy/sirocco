// Offline port directory + fuzzy name/city search. Data starts out
// France-only (public/data/ports_fr.json) — the `country` field on each
// entry is there so a future European pack can be merged in without a
// schema change.
export interface Port {
  id: string;
  name: string;
  city: string;
  country: string;
  lat: number;
  lon: number;
  vhfChannel: number | null;
  phone: string | null;
  visitorBerths: number | null;
  description: string;
  // Cruising-relevant extras, all `null` when not confidently known rather
  // than guessed.
  fuelDock: boolean | null;
  lockGate: boolean | null;
  haulOut: boolean | null;
}

export interface PortSearchResult {
  port: Port;
  score: number;
}

let portsCache: Port[] | null = null;
let loadingPromise: Promise<Port[]> | null = null;

export async function loadPorts(): Promise<Port[]> {
  if (portsCache) return portsCache;
  if (!loadingPromise) {
    loadingPromise = fetch('/data/ports_fr.json')
      .then((r) => r.json())
      .then((data: Port[]) => {
        portsCache = data;
        return data;
      })
      .catch((err) => {
        loadingPromise = null;
        throw err;
      });
  }
  return loadingPromise;
}

function normalize(s: string): string {
  return s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim();
}

function levenshtein(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  if (m === 0) return n;
  if (n === 0) return m;

  let prevRow = new Array(n + 1);
  let currRow = new Array(n + 1);
  for (let j = 0; j <= n; j++) prevRow[j] = j;

  for (let i = 1; i <= m; i++) {
    currRow[0] = i;
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      currRow[j] = Math.min(
        currRow[j - 1] + 1, // insertion
        prevRow[j] + 1, // deletion
        prevRow[j - 1] + cost // substitution
      );
    }
    [prevRow, currRow] = [currRow, prevRow];
  }
  return prevRow[n];
}

// Scores a single field (already normalized) against the normalized query.
// Exact/prefix/substring matches on the whole field score highest; each word
// of a multi-word field (e.g. "la rochelle") is also checked individually so
// a query can hit any word, with a small typo-tolerance fallback via edit
// distance for near-misses (e.g. "brest" vs "brets").
function scoreText(field: string, q: string): number {
  if (!field) return 0;
  if (field === q) return 100;
  if (field.startsWith(q)) return 92;
  if (field.includes(q)) return 80;

  const words = field.split(/[\s'-]+/).filter(Boolean);
  let best = 0;
  for (const word of words) {
    if (word.startsWith(q)) {
      best = Math.max(best, 85);
      continue;
    }
    if (word.includes(q)) {
      best = Math.max(best, 70);
      continue;
    }
    const tolerance = q.length <= 4 ? 1 : q.length <= 7 ? 2 : 3;
    const dist = levenshtein(word, q);
    if (dist <= tolerance) {
      best = Math.max(best, 60 - dist * 12);
    }
  }
  return best;
}

export function searchPorts(ports: Port[], query: string, limit = 8): PortSearchResult[] {
  const q = normalize(query);
  if (q.length < 2) return [];

  const results: PortSearchResult[] = [];
  for (const port of ports) {
    const nameScore = scoreText(normalize(port.name), q);
    const cityScore = scoreText(normalize(port.city), q) * 0.9;
    const score = Math.max(nameScore, cityScore);
    if (score > 0) results.push({ port, score });
  }

  results.sort((a, b) => b.score - a.score);
  return results.slice(0, limit);
}
