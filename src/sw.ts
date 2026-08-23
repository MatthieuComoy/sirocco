/// <reference lib="webworker" />
import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { CacheFirst, NetworkFirst } from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';

declare let self: ServiceWorkerGlobalScope;

// App shell + build assets, injected by vite-plugin-pwa at build time.
precacheAndRoute(self.__WB_MANIFEST);

self.skipWaiting();
self.addEventListener('activate', () => self.clients.claim());

// Cache Storage name shared with src/lib/services/offlineMaps.ts — regions
// downloaded there for offline use must be checked before the dynamic
// tile cache below, so a downloaded region is served even once its
// dynamic-cache entry has been evicted by the FIFO limit.
const OFFLINE_TILE_CACHE = 'sirroco-offline-tiles-v1';
const TILE_CACHE_NAME = 'sirroco-tiles-v1';

const isTileRequest = (url: URL) =>
  url.hostname.includes('tile.openstreetmap.org') ||
  url.hostname.includes('tiles.openseamap.org') ||
  url.href.includes('emodnet-bathymetry') ||
  url.hostname.includes('ping-info-nautique.fr');

registerRoute(
  ({ url, request }) => request.method === 'GET' && isTileRequest(url),
  async (options) => {
    const offlineCache = await caches.open(OFFLINE_TILE_CACHE);
    const offlineMatch = await offlineCache.match(options.request);
    if (offlineMatch) return offlineMatch;

    return new CacheFirst({
      cacheName: TILE_CACHE_NAME,
      plugins: [
        new CacheableResponsePlugin({ statuses: [0, 200] }),
        new ExpirationPlugin({ maxEntries: 400 }),
      ],
    }).handle(options);
  }
);

// Weather/tide/geocoding APIs — network-first, cached for offline fallback.
registerRoute(
  ({ url }) =>
    url.hostname.includes('api.open-meteo.com') ||
    url.hostname.includes('marine-api.open-meteo.com') ||
    url.hostname.includes('nominatim.openstreetmap.org'),
  new NetworkFirst({
    cacheName: 'sirroco-api-v1',
    plugins: [new CacheableResponsePlugin({ statuses: [200] })],
  })
);

// SPA fallback: any other navigation request that misses the network (and
// isn't already precached) falls back to the cached app shell.
registerRoute(
  ({ request }) => request.mode === 'navigate',
  new NetworkFirst({ cacheName: 'sirroco-nav-v1' })
);
