const CACHE_NAME = 'sirroco-nav-v16';
const ASSETS = [
  './',
  './index.html',
  './style.css',
  './js/app.js',
  './js/state.js',
  './js/utils.js',
  './js/i18n.js',
  './js/dangerZones.js',
  './js/anchorAlarm.js',
  './js/gpsSimulator.js',
  './js/weatherTides.js',
  './js/harbors.js',
  './js/tracking.js',
  './manifest.json',
  './favicon.ico',
  './favicon-16x16.png',
  './favicon-32x32.png',
  './apple-touch-icon.png',
  './safari-pinned-tab.svg',
  './mstile-150x150.png',
  './browserconfig.xml',
  './icon-192.png',
  './icon-512.png',
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
          if (key !== CACHE_NAME) {
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
  
  // Skip caching for external map tile servers dynamically since they are too large, 
  // but let browser caching handle standard tile requests or fallback gracefully.
  const url = event.request.url;
  if (url.includes('tile.openstreetmap') || url.includes('openseamap') || url.includes('emodnet-bathymetry')) {
    event.respondWith(
      fetch(event.request).catch(() => caches.match(event.request))
    );
    return;
  }
  
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
        if (event.request.headers.get('accept').includes('text/html')) {
          return caches.match('./index.html');
        }
      });
    })
  );
});
