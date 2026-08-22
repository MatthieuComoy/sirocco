// Ported from legacy/js/offlineMaps.js — tile math, URL generation and the
// concurrent download queue are pure/unchanged. Per-region "installed" flag
// keeps the exact same localStorage key (`offline_region_${id}`) as the
// legacy app so existing downloads on a returning user's device still show
// as installed instead of silently reappearing as "not downloaded".
import { get } from 'svelte/store';
import { offlineMaps } from '../stores/offlineMaps';

export interface OfflineRegion {
  id: string;
  name: string;
  desc: string;
  bounds: { minLat: number; maxLat: number; minLng: number; maxLng: number }[];
  minZoom: number;
  maxZoom: number;
}

export const OFFLINE_REGIONS: OfflineRegion[] = [
  {
    id: 'europe',
    name: 'Toute l’Europe (Vue générale)',
    desc: 'Idéal pour la navigation générale. Zoom 4 à 8 (grandes échelles).',
    bounds: [{ minLat: 34.0, maxLat: 70.0, minLng: -25.0, maxLng: 35.0 }],
    minZoom: 4,
    maxZoom: 8,
  },
  {
    id: 'france',
    name: 'Côtes de France',
    desc: 'Manche, Atlantique, Méditerranée & Corse. Zoom 5 à 10.',
    bounds: [
      { minLat: 43.0, maxLat: 51.2, minLng: -6.0, maxLng: 3.0 },
      { minLat: 41.3, maxLat: 44.0, minLng: 2.5, maxLng: 7.8 },
      { minLat: 41.3, maxLat: 43.1, minLng: 8.5, maxLng: 9.6 },
    ],
    minZoom: 5,
    maxZoom: 10,
  },
  {
    id: 'uk_ireland',
    name: 'Côtes R.-U. & Irlande',
    desc: 'Angleterre, Écosse, Pays de Galles & Irlande. Zoom 5 à 10.',
    bounds: [{ minLat: 49.8, maxLat: 61.0, minLng: -11.0, maxLng: 2.0 }],
    minZoom: 5,
    maxZoom: 10,
  },
  {
    id: 'spain_portugal',
    name: 'Côtes Espagne & Portugal',
    desc: 'Péninsule Ibérique et Îles Baléares. Zoom 5 à 10.',
    bounds: [{ minLat: 35.8, maxLat: 44.0, minLng: -10.0, maxLng: 4.5 }],
    minZoom: 5,
    maxZoom: 10,
  },
  {
    id: 'italy',
    name: 'Côtes d’Italie',
    desc: 'Italie continentale, Sicile et Sardaigne. Zoom 5 à 10.',
    bounds: [{ minLat: 35.2, maxLat: 45.8, minLng: 6.5, maxLng: 19.0 }],
    minZoom: 5,
    maxZoom: 10,
  },
  {
    id: 'greece',
    name: 'Côtes de Grèce & Égée',
    desc: 'Mer Égée, mer Ionienne, Crète et Cyclades. Zoom 5 à 10.',
    bounds: [{ minLat: 34.5, maxLat: 42.0, minLng: 19.0, maxLng: 28.5 }],
    minZoom: 5,
    maxZoom: 10,
  },
  {
    id: 'north_sea_baltic',
    name: 'Mer du Nord & Baltique (Sud)',
    desc: 'Belgique, Pays-Bas, Allemagne et Danemark. Zoom 5 à 10.',
    bounds: [{ minLat: 53.0, maxLat: 58.0, minLng: 2.5, maxLng: 15.0 }],
    minZoom: 5,
    maxZoom: 10,
  },
];

const CACHE_NAME = 'sirroco-offline-tiles-v1';

function latLngToTile(lat: number, lng: number, zoom: number) {
  const latRad = (lat * Math.PI) / 180;
  const n = Math.pow(2, zoom);
  const x = ((lng + 180) / 360) * n;
  const y = ((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) * n;
  return { x: Math.floor(x), y: Math.floor(y) };
}

export function generateTileUrlsForRegion(region: OfflineRegion): string[] {
  const urls: string[] = [];
  const subdomains = ['a', 'b', 'c'];

  for (const b of region.bounds) {
    for (let z = region.minZoom; z <= region.maxZoom; z++) {
      const tMin = latLngToTile(b.maxLat, b.minLng, z);
      const tMax = latLngToTile(b.minLat, b.maxLng, z);
      const xMin = Math.min(tMin.x, tMax.x);
      const xMax = Math.max(tMin.x, tMax.x);
      const yMin = Math.min(tMin.y, tMax.y);
      const yMax = Math.max(tMin.y, tMax.y);

      for (let x = xMin; x <= xMax; x++) {
        for (let y = yMin; y <= yMax; y++) {
          const s = subdomains[(x + y) % 3];
          urls.push(`https://${s}.tile.openstreetmap.org/${z}/${x}/${y}.png`);
          urls.push(`https://tiles.openseamap.org/seamark/${z}/${x}/${y}.png`);
        }
      }
    }
  }

  return [...new Set(urls)];
}

export function estimateRegionSizeMB(region: OfflineRegion): number {
  return (generateTileUrlsForRegion(region).length * 18) / 1024; // ~18KB/tile average
}

export function initOfflineMaps() {
  const installed: Record<string, boolean> = {};
  for (const region of OFFLINE_REGIONS) {
    installed[region.id] = localStorage.getItem(`offline_region_${region.id}`) === 'installed';
  }
  offlineMaps.update((s) => ({ ...s, installed }));
  updateStorageUsage();
}

export async function updateStorageUsage() {
  if (!navigator.storage?.estimate) {
    offlineMaps.update((s) => ({ ...s, storageUsedMB: null }));
    return;
  }
  try {
    const estimate = await navigator.storage.estimate();
    const usedMB = (estimate.usage ?? 0) / (1024 * 1024);
    offlineMaps.update((s) => ({ ...s, storageUsedMB: usedMB }));
  } catch {
    offlineMaps.update((s) => ({ ...s, storageUsedMB: null }));
  }
}

export async function startOfflineDownload(id: string) {
  const region = OFFLINE_REGIONS.find((r) => r.id === id);
  if (!region) return;

  const urls = generateTileUrlsForRegion(region);
  offlineMaps.update((s) => ({
    ...s,
    downloads: { ...s.downloads, [id]: { total: urls.length, current: 0, active: true, failed: 0 } },
  }));

  try {
    const cache = await caches.open(CACHE_NAME);
    const concurrency = 6;
    let urlIdx = 0;

    const bumpProgress = () => {
      offlineMaps.update((s) => {
        const dl = s.downloads[id];
        if (!dl) return s;
        return { ...s, downloads: { ...s.downloads, [id]: { ...dl, current: dl.current + 1 } } };
      });
    };

    const bumpFailed = () => {
      offlineMaps.update((s) => {
        const dl = s.downloads[id];
        if (!dl) return s;
        return { ...s, downloads: { ...s.downloads, [id]: { ...dl, failed: dl.failed + 1 } } };
      });
    };

    const isStillActive = () => get(offlineMaps).downloads[id]?.active === true;

    const worker = async () => {
      while (urlIdx < urls.length && isStillActive()) {
        const currentUrl = urls[urlIdx++];
        try {
          const match = await cache.match(currentUrl);
          if (match) {
            bumpProgress();
            continue;
          }
          const response = await fetch(currentUrl, { mode: 'cors', credentials: 'omit' });
          if (response.ok) {
            await cache.put(currentUrl, response);
          } else {
            bumpFailed();
          }
        } catch {
          bumpFailed();
        }
        bumpProgress();
      }
    };

    await Promise.all(Array.from({ length: concurrency }, () => worker()));

    if (isStillActive()) {
      localStorage.setItem(`offline_region_${id}`, 'installed');
      offlineMaps.update((s) => {
        const { [id]: _removed, ...restDownloads } = s.downloads;
        return { ...s, installed: { ...s.installed, [id]: true }, downloads: restDownloads };
      });
      updateStorageUsage();
    }
  } catch (err) {
    console.error('Offline download failed:', err);
    cancelOfflineDownload(id);
  }
}

export function cancelOfflineDownload(id: string) {
  offlineMaps.update((s) => {
    const { [id]: _removed, ...restDownloads } = s.downloads;
    return { ...s, downloads: restDownloads };
  });
}

export async function deleteOfflineRegion(id: string) {
  const region = OFFLINE_REGIONS.find((r) => r.id === id);
  if (!region) return;

  const urls = generateTileUrlsForRegion(region);
  try {
    const cache = await caches.open(CACHE_NAME);
    await Promise.all(urls.map((url) => cache.delete(url)));
    localStorage.removeItem(`offline_region_${id}`);
    offlineMaps.update((s) => ({ ...s, installed: { ...s.installed, [id]: false } }));
    updateStorageUsage();
  } catch (err) {
    console.error('Failed to delete offline region:', err);
  }
}
