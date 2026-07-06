// Sirroco Marine Navigation - Offline Maps Downloader Module

import { state } from './state.js';

// Bounding box definitions for Europe and country coastal zones
export const OFFLINE_REGIONS = [
  {
    id: 'europe',
    name: {
      fr: 'Toute l’Europe (Vue générale)',
      en: 'All Europe (General overview)'
    },
    desc: {
      fr: 'Idéal pour la navigation générale. Zoom 4 à 8 (grandes échelles).',
      en: 'Ideal for general navigation. Zoom 4 to 8 (large scales).'
    },
    bounds: [
      { minLat: 34.0, maxLat: 70.0, minLng: -25.0, maxLng: 35.0 }
    ],
    minZoom: 4,
    maxZoom: 8
  },
  {
    id: 'france',
    name: {
      fr: 'Côtes de France',
      en: 'Coasts of France'
    },
    desc: {
      fr: 'Manche, Atlantique, Méditerranée & Corse. Zoom 5 à 10.',
      en: 'English Channel, Atlantic, Mediterranean & Corsica. Zoom 5 to 10.'
    },
    bounds: [
      { minLat: 43.0, maxLat: 51.2, minLng: -6.0, maxLng: 3.0 }, // Atlantic & Channel
      { minLat: 41.3, maxLat: 44.0, minLng: 2.5, maxLng: 7.8 },  // Mediterranean
      { minLat: 41.3, maxLat: 43.1, minLng: 8.5, maxLng: 9.6 }   // Corsica
    ],
    minZoom: 5,
    maxZoom: 10
  },
  {
    id: 'uk_ireland',
    name: {
      fr: 'Côtes R.-U. & Irlande',
      en: 'UK & Ireland Coasts'
    },
    desc: {
      fr: 'Angleterre, Écosse, Pays de Galles & Irlande. Zoom 5 à 10.',
      en: 'England, Scotland, Wales & Ireland. Zoom 5 to 10.'
    },
    bounds: [
      { minLat: 49.8, maxLat: 61.0, minLng: -11.0, maxLng: 2.0 }
    ],
    minZoom: 5,
    maxZoom: 10
  },
  {
    id: 'spain_portugal',
    name: {
      fr: 'Côtes Espagne & Portugal',
      en: 'Spain & Portugal Coasts'
    },
    desc: {
      fr: 'Péninsule Ibérique et Îles Baléares. Zoom 5 à 10.',
      en: 'Iberian Peninsula and Balearic Islands. Zoom 5 to 10.'
    },
    bounds: [
      { minLat: 35.8, maxLat: 44.0, minLng: -10.0, maxLng: 4.5 }
    ],
    minZoom: 5,
    maxZoom: 10
  },
  {
    id: 'italy',
    name: {
      fr: 'Côtes d’Italie',
      en: 'Italian Coasts'
    },
    desc: {
      fr: 'Italie continentale, Sicile et Sardaigne. Zoom 5 à 10.',
      en: 'Mainland Italy, Sicily and Sardinia. Zoom 5 to 10.'
    },
    bounds: [
      { minLat: 35.2, maxLat: 45.8, minLng: 6.5, maxLng: 19.0 }
    ],
    minZoom: 5,
    maxZoom: 10
  },
  {
    id: 'greece',
    name: {
      fr: 'Côtes de Grèce & Égée',
      en: 'Greek Coasts & Aegean Sea'
    },
    desc: {
      fr: 'Mer Égée, mer Ionienne, Crète et Cyclades. Zoom 5 à 10.',
      en: 'Aegean Sea, Ionian Sea, Crete and Cyclades. Zoom 5 to 10.'
    },
    bounds: [
      { minLat: 34.5, maxLat: 42.0, minLng: 19.0, maxLng: 28.5 }
    ],
    minZoom: 5,
    maxZoom: 10
  },
  {
    id: 'north_sea_baltic',
    name: {
      fr: 'Mer du Nord & Baltique (Sud)',
      en: 'North Sea & South Baltic'
    },
    desc: {
      fr: 'Belgique, Pays-Bas, Allemagne et Danemark. Zoom 5 à 10.',
      en: 'Belgium, Netherlands, Germany and Denmark. Zoom 5 to 10.'
    },
    bounds: [
      { minLat: 53.0, maxLat: 58.0, minLng: 2.5, maxLng: 15.0 }
    ],
    minZoom: 5,
    maxZoom: 10
  }
];

const CACHE_NAME = 'sirroco-offline-tiles-v1';
const activeDownloads = {};

// Mercator Projection Math helpers to map coordinates to map tiles
function latLngToTile(lat, lng, zoom) {
  const latRad = lat * Math.PI / 180;
  const n = Math.pow(2, zoom);
  const x = (lng + 180) / 360 * n;
  const y = (1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2 * n;
  return { x: Math.floor(x), y: Math.floor(y) };
}

// Generate the list of unique tile URLs for a region
function generateTileUrlsForRegion(region) {
  const urls = [];
  
  region.bounds.forEach(b => {
    for (let z = region.minZoom; z <= region.maxZoom; z++) {
      const tMin = latLngToTile(b.maxLat, b.minLng, z);
      const tMax = latLngToTile(b.minLat, b.maxLng, z);
      
      const xMin = Math.min(tMin.x, tMax.x);
      const xMax = Math.max(tMin.x, tMax.x);
      const yMin = Math.min(tMin.y, tMax.y);
      const yMax = Math.max(tMin.y, tMax.y);
      
      for (let x = xMin; x <= xMax; x++) {
        for (let y = yMin; y <= yMax; y++) {
          // 1. OpenStreetMap Background Tile
          const subdomains = ['a', 'b', 'c'];
          const s = subdomains[(x + y) % 3];
          urls.push(`https://${s}.tile.openstreetmap.org/${z}/${x}/${y}.png`);
          
          // 2. OpenSeaMap Marine Overlay Tile
          urls.push(`https://tiles.openseamap.org/seamark/${z}/${x}/${y}.png`);
        }
      }
    }
  });
  
  // Deduplicate URLs
  return [...new Set(urls)];
}

// Format the i18n text
function t(key, defaultVal = '') {
  const dict = state.currentLang === 'fr' ? {
    settings_offline_maps: "Cartes Hors-ligne",
    download_btn: "Télécharger",
    delete_btn: "Supprimer",
    cancel_btn: "Annuler",
    status_not_installed: "Non installée",
    status_installed: "Installée",
    status_downloading: "Téléchargement...",
    estimated_size: "Taille estimée",
    tiles_lbl: "tuiles"
  } : {
    settings_offline_maps: "Offline Maps",
    download_btn: "Download",
    delete_btn: "Delete",
    cancel_btn: "Cancel",
    status_not_installed: "Not installed",
    status_installed: "Installed",
    status_downloading: "Downloading...",
    estimated_size: "Estimated size",
    tiles_lbl: "tiles"
  };
  return dict[key] || defaultVal;
}

// Update the storage estimate display
async function updateStorageUsage() {
  const storageEl = document.getElementById('storage-status-text');
  if (!storageEl) return;
  
  if (navigator.storage && navigator.storage.estimate) {
    try {
      const estimate = await navigator.storage.estimate();
      const usedMB = (estimate.usage / (1024 * 1024)).toFixed(1);
      storageEl.textContent = `${usedMB} MB utilisés`;
    } catch (err) {
      storageEl.textContent = "Indisponible";
    }
  } else {
    storageEl.textContent = "Indisponible";
  }
}

// Renders the list of offline regions in settings panel
export function renderOfflineRegions() {
  const container = document.getElementById('offline-regions-list');
  if (!container) return;
  
  container.innerHTML = '';
  
  OFFLINE_REGIONS.forEach(region => {
    const tileUrls = generateTileUrlsForRegion(region);
    const estSizeMB = ((tileUrls.length * 18) / 1024).toFixed(1); // Average tile is ~18KB
    
    const isDownloaded = localStorage.getItem(`offline_region_${region.id}`) === 'installed';
    const isDownloading = activeDownloads[region.id] && activeDownloads[region.id].active;
    
    let statusClass = 'not-installed';
    let statusText = t('status_not_installed', 'Non installée');
    
    if (isDownloaded) {
      statusClass = 'installed';
      statusText = t('status_installed', 'Installée');
    } else if (isDownloading) {
      statusClass = 'downloading';
      const progress = activeDownloads[region.id];
      const pct = Math.round((progress.current / progress.total) * 100);
      statusText = `${t('status_downloading', 'Téléchargement...')} (${pct}%)`;
    }
    
    const nameText = region.name[state.currentLang] || region.name.en;
    const descText = region.desc[state.currentLang] || region.desc.en;
    
    const card = document.createElement('div');
    card.className = 'offline-region-card';
    card.innerHTML = `
      <div class="offline-region-header">
        <div>
          <span class="offline-region-title">${nameText}</span>
          <p class="offline-region-desc" style="margin: 0.15rem 0 0 0;">${descText}</p>
        </div>
        <span class="offline-region-status ${statusClass}">${statusText}</span>
      </div>
      
      <div class="offline-progress-container" id="progress-container-${region.id}" style="display: ${isDownloading ? 'block' : 'none'};">
        <div class="offline-progress-bar" id="progress-bar-${region.id}" style="width: ${isDownloading ? Math.round((activeDownloads[region.id].current / activeDownloads[region.id].total) * 100) : 0}%;"></div>
      </div>
      
      <div class="offline-region-meta">
        <span>${t('estimated_size', 'Taille estimée')} : <strong>${estSizeMB} MB</strong> (${tileUrls.length} ${t('tiles_lbl', 'tuiles')})</span>
        <div class="offline-actions">
          ${isDownloading ? `
            <button class="offline-btn cancel" data-id="${region.id}">${t('cancel_btn', 'Annuler')}</button>
          ` : isDownloaded ? `
            <button class="offline-btn delete" data-id="${region.id}">🗑️ ${t('delete_btn', 'Supprimer')}</button>
          ` : `
            <button class="offline-btn download" data-id="${region.id}">📥 ${t('download_btn', 'Télécharger')}</button>
          `}
        </div>
      </div>
    `;
    
    container.appendChild(card);
  });
  
  // Bind actions
  container.querySelectorAll('.offline-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = btn.getAttribute('data-id');
      if (btn.classList.contains('download')) {
        startOfflineDownload(id);
      } else if (btn.classList.contains('delete')) {
        deleteOfflineRegion(id);
      } else if (btn.classList.contains('cancel')) {
        cancelOfflineDownload(id);
      }
    });
  });
  
  updateStorageUsage();
}

// Download a region's tiles using a throttled queue
async function startOfflineDownload(id) {
  const region = OFFLINE_REGIONS.find(r => r.id === id);
  if (!region) return;
  
  const urls = generateTileUrlsForRegion(region);
  
  activeDownloads[id] = {
    total: urls.length,
    current: 0,
    active: true,
    failed: 0
  };
  
  renderOfflineRegions();
  
  try {
    const cache = await caches.open(CACHE_NAME);
    const concurrency = 6;
    let urlIdx = 0;
    
    const worker = async () => {
      while (urlIdx < urls.length && activeDownloads[id] && activeDownloads[id].active) {
        const currentUrl = urls[urlIdx++];
        
        try {
          // Check if already cached
          const match = await cache.match(currentUrl);
          if (match) {
            if (activeDownloads[id]) {
              activeDownloads[id].current++;
              updateProgressUI(id);
            }
            continue;
          }
          
          // Fetch and cache
          const response = await fetch(currentUrl, {
            mode: 'cors',
            credentials: 'omit'
          });
          
          if (response.ok) {
            await cache.put(currentUrl, response);
          } else {
            if (activeDownloads[id]) activeDownloads[id].failed++;
          }
        } catch (err) {
          if (activeDownloads[id]) activeDownloads[id].failed++;
        }
        
        if (activeDownloads[id]) {
          activeDownloads[id].current++;
          updateProgressUI(id);
        }
      }
    };
    
    // Launch concurrent download workers
    const workers = Array(concurrency).fill(null).map(() => worker());
    await Promise.all(workers);
    
    if (activeDownloads[id] && activeDownloads[id].active) {
      // Completed successfully
      localStorage.setItem(`offline_region_${id}`, 'installed');
      delete activeDownloads[id];
      renderOfflineRegions();
    }
  } catch (err) {
    console.error("Offline download failed:", err);
    cancelOfflineDownload(id);
  }
}

// Update the progress UI directly for performance while downloading
function updateProgressUI(id) {
  const progress = activeDownloads[id];
  if (!progress) return;
  
  const pct = Math.round((progress.current / progress.total) * 100);
  
  const bar = document.getElementById(`progress-bar-${id}`);
  if (bar) bar.style.width = `${pct}%`;
  
  // Also update textual status if possible
  const card = document.getElementById(`progress-bar-${id}`)?.closest('.offline-region-card');
  const statusEl = card?.querySelector('.offline-region-status');
  if (statusEl) {
    statusEl.textContent = `${t('status_downloading', 'Téléchargement...')} (${pct}%)`;
  }
}

// Cancel / Pause a region download
function cancelOfflineDownload(id) {
  if (activeDownloads[id]) {
    activeDownloads[id].active = false;
    delete activeDownloads[id];
  }
  renderOfflineRegions();
}

// Delete cached tiles of a region
async function deleteOfflineRegion(id) {
  const region = OFFLINE_REGIONS.find(r => r.id === id);
  if (!region) return;
  
  const urls = generateTileUrlsForRegion(region);
  
  try {
    const cache = await caches.open(CACHE_NAME);
    const deletePromises = urls.map(url => cache.delete(url));
    await Promise.all(deletePromises);
    
    localStorage.removeItem(`offline_region_${id}`);
    renderOfflineRegions();
  } catch (err) {
    console.error("Failed to delete offline region:", err);
  }
}

// Initialize the offline maps interface and listen for language changes
export function initOfflineMaps() {
  renderOfflineRegions();
  
  // Re-render when language changes
  const langSelect = document.getElementById('lang-selector-modal');
  if (langSelect) {
    langSelect.addEventListener('change', () => {
      setTimeout(() => renderOfflineRegions(), 50);
    });
  }
}
