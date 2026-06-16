const CACHE_NAME = 'sirroco-nav-v28';
const TILE_CACHE_NAME = 'sirroco-tiles-v1';
const API_CACHE_NAME = 'sirroco-api-v1';

// Helper to limit cache size (FIFO)
function limitCacheSize(cacheName, maxItems) {
  caches.open(cacheName).then(cache => {
    cache.keys().then(keys => {
      if (keys.length > maxItems) {
        cache.delete(keys[0]).then(() => {
          limitCacheSize(cacheName, maxItems);
        });
      }
    });
  });
}

const ASSETS = [
  './',
  './index.html',
  './style.css',
  './js/app.js',
  './js/state.js',
  './js/utils.js',
  './js/i18n.js',
  './js/anchorAlarm.js',
  './js/gpsSimulator.js',
  './js/weatherTides.js',
  './js/harbors.js',
  './js/tracking.js',
  './js/pingWarnings.js',
  './data/navarea2.xml',
  './data/toulon.xml',
  './data/brest.xml',
  './data/cherbourg.xml',
  './data/antilles.xml',
  './data/guyane.xml',
  './data/reunion.xml',
  './data/mayotte.xml',
  './data/nouvelle_caledonie.xml',
  './data/polynesie.xml',
  './data/st_pierre_miquelon.xml',
  './data/avinav_toulon.xml',
  './data/avinav_brest.xml',
  './data/avinav_cherbourg.xml',
  './data/avinav_antilles.xml',
  './data/avinav_guyane.xml',
  './data/avinav_reunion.xml',
  './data/avinav_mayotte.xml',
  './data/avinav_nouvelle_caledonie.xml',
  './data/avinav_polynesie.xml',
  './data/avinav_st_pierre_miquelon.xml',
  './data/avurnav_local_toulon.xml',
  './data/avurnav_local_brest.xml',
  './data/avurnav_local_cherbourg.xml',
  './data/avurnav_local_antilles.xml',
  './data/avurnav_local_guyane.xml',
  './data/avurnav_local_reunion.xml',
  './data/avurnav_local_mayotte.xml',
  './data/avurnav_local_nouvelle_caledonie.xml',
  './data/avurnav_local_polynesie.xml',
  './data/avurnav_local_st_pierre_miquelon.xml',
  './manifest.json',
  './icons/favicon.ico',
  './icons/favicon-16x16.png',
  './icons/favicon-32x32.png',
  './icons/apple-touch-icon.png',
  './icons/safari-pinned-tab.svg',
  './icons/mstile-150x150.png',
  './browserconfig.xml',
  './icons/icon-192.png',
  './icons/icon-512.png',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
];


// Install Event
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('[Service Worker] Caching app shell');
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate Event
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME && key !== TILE_CACHE_NAME && key !== API_CACHE_NAME) {
            console.log('[Service Worker] Clearing old cache', key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

// Fetch Event (Cache First, Network Fallback)
self.addEventListener('fetch', event => {
  // Only handle GET requests and local/cdn assets
  if (event.request.method !== 'GET') return;
  
  const url = event.request.url;

  // 1. Handle Map Tiles with Stale-While-Revalidate and size limit
  if (url.includes('tile.openstreetmap.org') || url.includes('tiles.openseamap.org') || url.includes('emodnet-bathymetry') || url.includes('ping-info-nautique.fr')) {
    event.respondWith(
      caches.match(event.request).then(cachedResponse => {
        const fetchPromise = fetch(event.request).then(networkResponse => {
          if (networkResponse && (networkResponse.status === 200 || networkResponse.status === 0)) {
            const responseToCache = networkResponse.clone();
            caches.open(TILE_CACHE_NAME).then(cache => {
              cache.put(event.request, responseToCache);
              limitCacheSize(TILE_CACHE_NAME, 400);
            });
          }
          return networkResponse;
        }).catch(() => {
          // Silently catch fetch errors (meaning we're offline)
        });
        
        return cachedResponse || fetchPromise;
      })
    );
    return;
  }

  // 2. Handle Weather and Geocoding APIs with Network-First
  if (url.includes('api.open-meteo.com') || url.includes('marine-api.open-meteo.com') || url.includes('nominatim.openstreetmap.org')) {
    event.respondWith(
      fetch(event.request).then(networkResponse => {
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(API_CACHE_NAME).then(cache => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      }).catch(() => {
        return caches.match(event.request);
      })
    );
    return;
  }
  
  // 3. Handle Local/App Shell assets with Cache-First, Network-Fallback
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).then(networkResponse => {
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
          return networkResponse;
        }
        
        // Cache new dynamically requested local files
        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, responseToCache);
        });
        
        return networkResponse;
      }).catch(() => {
        // Offline fallback for html
        if (event.request.headers.get('accept') && event.request.headers.get('accept').includes('text/html')) {
          return caches.match('./index.html');
        }
      });
    })
  );
});
