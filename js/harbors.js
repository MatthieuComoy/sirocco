// Sirroco Marine Navigation - Marinas & Harbors Fetcher (OSM Overpass API integration)

import { state } from './state.js';
import { translations } from './i18n.js';
import { calculateHaversineDistance } from './utils.js';
import { updateRecenterButtonUI } from './app.js';

export function displayHarborMessage(msg) {
  const container = document.getElementById('harbors-list-container');
  if (container) {
    container.innerHTML = `
      <div style="padding: 1.25rem; text-align: center; color: var(--text-muted); font-size: 0.85rem; font-style: italic; line-height: 1.4;">
        ${msg}
      </div>
    `;
  }
}

export function clearHarborMarkers() {
  state.harborMarkers.forEach(m => {
    if (state.harborsLayer) state.harborsLayer.removeLayer(m);
  });
  state.harborMarkers = [];
  state.currentHarbors = [];
}

export function parseAndCacheHarbors(elements) {
  if (!elements) return;

  elements.forEach(el => {
    const tags = el.tags || {};
    // Extract a valid harbor name or bypass
    const name = tags.name || tags["name:fr"] || tags["name:en"];
    if (!name) return;

    const lat = el.lat || (el.center && el.center.lat);
    const lon = el.lon || (el.center && el.center.lon);
    if (!lat || !lon) return;

    // Contact details parsing
    const phone = tags["contact:phone"] || tags["phone"] || "-";
    const email = tags["contact:email"] || tags["email"] || "-";
    const website = tags["contact:website"] || tags["website"] || tags["url"] || "";
    
    // VHF radio channels
    const vhf = tags["communication:vhf"] || tags["vhf"] || tags["seamark:communication:vhf"] || tags["seamark:harbour:vhf"] || "-";
    
    // Berth capacities
    const berths = tags["capacity"] || tags["capacity:harbour"] || tags["harbour:capacity"] || tags["capacity:pleasure_boat"] || "-";
    
    // Draft & Length restrictions
    const maxDraft = parseFloat(tags["maxdraft"] || tags["draft_max"] || tags["seamark:harbour:max_draft"] || tags["seamark:harbour:draft_max"] || "0");
    const maxLength = parseFloat(tags["maxlength"] || tags["length_max"] || tags["seamark:harbour:max_length"] || "0");

    // Map boolean osm flags to localized amenities/services text list
    const servicesList = [];
    const isFr = (state.currentLang === 'fr');
    if (tags["fuel"] === "yes" || tags["fuel:marine"] === "yes" || tags["seamark:harbour:fuel"] === "yes") {
      servicesList.push(isFr ? "Carburant" : "Fuel");
    }
    if (tags["water"] === "yes" || tags["drinking_water"] === "yes" || tags["seamark:harbour:water"] === "yes") {
      servicesList.push(isFr ? "Eau douce" : "Fresh Water");
    }
    if (tags["electricity"] === "yes" || tags["power_supply"] === "yes") {
      servicesList.push(isFr ? "Électricité" : "Electricity");
    }
    if (tags["toilets"] === "yes" || tags["toilet"] === "yes") {
      servicesList.push(isFr ? "Toilettes" : "Toilets");
    }
    if (tags["shower"] === "yes" || tags["showers"] === "yes") {
      servicesList.push(isFr ? "Douches" : "Showers");
    }
    if (tags["waste_disposal"] === "yes" || tags["pump_out"] === "yes") {
      servicesList.push(isFr ? "Déchets" : "Waste Disposal");
    }
    if (tags["wifi"] === "yes" || tags["internet_access"] === "wlan") {
      servicesList.push("Wi-Fi");
    }
    const services = servicesList.join(', ') || "-";

    const info = tags["description"] || tags["note"] || "";

    const newHarbor = {
      name: name.trim(),
      lat,
      lng: lon,
      phone: phone.trim(),
      email: email.trim(),
      website: website.trim(),
      address: "-",
      vhf: vhf.trim(),
      berths: berths.toString().trim(),
      maxLength: maxLength > 0 ? maxLength : null,
      maxDraft: maxDraft > 0 ? maxDraft : null,
      services,
      info: info.trim()
    };

    // Build physical address line from individual OSM address tags
    const street = tags["addr:street"] || "";
    const housenumber = tags["addr:housenumber"] || "";
    const postcode = tags["addr:postcode"] || "";
    const city = tags["addr:city"] || "";
    let address = tags["addr:full"] || "";
    if (!address) {
      const parts = [];
      if (housenumber || street) parts.push(`${housenumber} ${street}`.trim());
      if (postcode || city) parts.push(`${postcode} ${city}`.trim());
      address = parts.join(', ') || "-";
    }
    newHarbor.address = address.trim();

    // Deduplicate: check if there's an existing cache record with same name within 1 km
    let existingHarbor = null;
    let existingKey = null;
    for (let [key, val] of state.allHarborsCache.entries()) {
      if (val.name.toLowerCase() === newHarbor.name.toLowerCase()) {
        const dist = calculateHaversineDistance(newHarbor.lat, newHarbor.lng, val.lat, val.lng);
        if (dist < 1000) {
          existingHarbor = val;
          existingKey = key;
          break;
        }
      }
    }

    if (existingHarbor) {
      // Merge values, keeping the most detailed parameters
      if (existingHarbor.phone === '-' && newHarbor.phone !== '-') existingHarbor.phone = newHarbor.phone;
      if (existingHarbor.email === '-' && newHarbor.email !== '-') existingHarbor.email = newHarbor.email;
      if (!existingHarbor.website && newHarbor.website) existingHarbor.website = newHarbor.website;
      if (existingHarbor.vhf === '-' && newHarbor.vhf !== '-') existingHarbor.vhf = newHarbor.vhf;
      if (existingHarbor.berths === '-' && newHarbor.berths !== '-') existingHarbor.berths = newHarbor.berths;
      if (existingHarbor.address === '-' && newHarbor.address !== '-') existingHarbor.address = newHarbor.address;
      if (!existingHarbor.maxLength && newHarbor.maxLength) existingHarbor.maxLength = newHarbor.maxLength;
      if (!existingHarbor.maxDraft && newHarbor.maxDraft) existingHarbor.maxDraft = newHarbor.maxDraft;
      if (newHarbor.services !== '-') {
        existingHarbor.services = existingHarbor.services !== '-' ? 
          Array.from(new Set([...existingHarbor.services.split(', '), ...newHarbor.services.split(', ')])).join(', ') : 
          newHarbor.services;
      }
      if (!existingHarbor.info && newHarbor.info) existingHarbor.info = newHarbor.info;
    } else {
      const uniqueKey = `${el.type}-${el.id}`;
      state.allHarborsCache.set(uniqueKey, newHarbor);
    }
  });
}

// Update currentHarbors from global map cache filtering by the map bounds
export function updateCurrentHarborsFromCache(bounds) {
  const viewportHarbors = [];
  state.allHarborsCache.forEach(harbor => {
    if (bounds.contains([harbor.lat, harbor.lng])) {
      viewportHarbors.push(harbor);
    }
  });

  // Sort alphabetically
  viewportHarbors.sort((a, b) => a.name.localeCompare(b.name));
  state.currentHarbors = viewportHarbors;
  renderHarborListAndMarkers();
}

// Query OSM Overpass API for harbors within current map view coordinates
export async function fetchHarborsInViewport() {
  if (!state.map) return;

  const layerHarbors = document.getElementById('layer-harbors');
  if (layerHarbors && !layerHarbors.checked) {
    displayHarborMessage(state.currentLang === 'fr' ? "Activez le calque 'Ports de plaisance' pour voir la liste." : "Enable 'Marinas' layer to see the list.");
    clearHarborMarkers();
    return;
  }

  const zoom = state.map.getZoom();
  if (zoom < 11) {
    const zoomPrompt = translations[state.currentLang]?.harbor_zoom_prompt || translations.en.harbor_zoom_prompt;
    displayHarborMessage(zoomPrompt);
    clearHarborMarkers();
    return;
  }

  const bounds = state.map.getBounds();
  
  // Instantly draw from local cached data to avoid latency
  updateCurrentHarborsFromCache(bounds);

  // If already querying, let the existing fetch finish
  if (state.isFetchingHarbors) return;

  state.isFetchingHarbors = true;

  // Show loading indicator in sidebar list if we don't have cached harbors in view
  if (state.currentHarbors.length === 0) {
    const loadingText = translations[state.currentLang]?.harbor_loading || translations.en.harbor_loading;
    displayHarborMessage(loadingText);
  }

  const south = bounds.getSouth();
  const west = bounds.getWest();
  const north = bounds.getNorth();
  const east = bounds.getEast();
  const bbox = `${south},${west},${north},${east}`;

  const query = `[out:json][timeout:15];
(
  node["harbour"](${bbox});
  node["marina"](${bbox});
  node["seamark:type"="harbour"](${bbox});
  node["seamark:type"="marina"](${bbox});
  way["harbour"](${bbox});
  way["marina"](${bbox});
  way["seamark:type"="harbour"](${bbox});
  way["seamark:type"="marina"](${bbox});
);
out body center;`;

  const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("Overpass request failed");
    const data = await res.json();

    parseAndCacheHarbors(data.elements);
    updateCurrentHarborsFromCache(bounds);
  } catch (err) {
    console.warn("OSM harbor search failed/offline:", err);
    // Offline / API error fallback: display whatever we have cached
    if (state.currentHarbors.length === 0) {
      displayHarborMessage(state.currentLang === 'fr' ? "Erreur de connexion aux données des ports." : "Error connecting to harbors database.");
    }
  } finally {
    state.isFetchingHarbors = false;
  }
}

// Render harbors on map and update sidebar list under Calques
export function renderHarborListAndMarkers() {
  if (!state.map || !state.harborsLayer) return;

  // Clear previous markers
  state.harborMarkers.forEach(m => state.harborsLayer.removeLayer(m));
  state.harborMarkers = [];

  const listContainer = document.getElementById('harbors-list-container');
  if (listContainer) {
    listContainer.innerHTML = '';
  }

  if (state.currentHarbors.length === 0) {
    const noDataText = translations[state.currentLang]?.harbor_no_data || translations.en.harbor_no_data;
    displayHarborMessage(noDataText);
    return;
  }

  const t = translations[state.currentLang] || translations.en;
  
  const labelCapitainerie = t.harbor_capitainerie || "Capitainerie";
  const labelVHF = t.harbor_vhf || "VHF";
  const labelEmail = t.harbor_email || "Email";
  const labelAddress = t.harbor_address || "Adresse";
  const labelPlaces = t.harbor_places || "Places";
  const labelMaxLen = t.harbor_max_len || "Longueur Max";
  const labelMaxDraft = t.harbor_max_draft || "Tirant d'eau Max";
  const labelServices = t.harbor_services || "Services";
  const labelType = t.harbor_type || "Port de plaisance";

  state.currentHarbors.forEach((harbor, idx) => {
    // Check boat profile constraints
    const draftWarning = (harbor.maxDraft && state.boatProfile.draft > harbor.maxDraft);
    const lengthWarning = (harbor.maxLength && state.boatProfile.length > harbor.maxLength);

    const draftStyle = draftWarning ? "color: #ef4444; font-weight: 700;" : "";
    const lengthStyle = lengthWarning ? "color: #ef4444; font-weight: 700;" : "";
    
    const draftIcon = draftWarning ? "⚠️ " : "";
    const lengthIcon = lengthWarning ? "⚠️ " : "";

    const draftValText = harbor.maxDraft ? `${harbor.maxDraft.toFixed(1)} m` : "-";
    const lenValText = harbor.maxLength ? `${harbor.maxLength.toFixed(1)} m` : "-";

    // Build custom Leaflet DivIcon
    const borderCls = (draftWarning || lengthWarning) ? "#f97316" : "#06b6d4";
    const bgCls = (draftWarning || lengthWarning) ? "rgba(249, 115, 22, 0.15)" : "rgba(6, 182, 212, 0.15)";
    
    const harborIcon = L.divIcon({
      className: 'custom-harbor-marker',
      html: `
        <div style="background: ${bgCls}; border: 2.5px solid ${borderCls}; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 10px rgba(0,0,0,0.4); transition: all 0.3s ease;">
          <svg style="width: 16px; height: 16px; fill: none; stroke: ${borderCls}; stroke-width: 2.5; stroke-linecap: round; stroke-linejoin: round;" viewBox="0 0 24 24">
            <circle cx="12" cy="5" r="3"/>
            <line x1="12" y1="8" x2="12" y2="20"/>
            <line x1="6" y1="12" x2="18" y2="12"/>
            <path d="M6 12c0 6 12 6 12 0"/>
          </svg>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 16]
    });

    let websiteHtml = "";
    if (harbor.website) {
      websiteHtml = `<div><strong>🌐 Web:</strong> <a href="${harbor.website}" target="_blank" rel="noopener noreferrer" style="color: var(--accent-color); text-decoration: none;">${harbor.website.replace(/^https?:\/\/(www\.)?/, '')}</a></div>`;
    }

    let warningHtml = "";
    if (draftWarning || lengthWarning) {
      const warnMsg = state.currentLang === 'fr' ? "⚠️ Dépasse les limites de votre bateau" : "⚠️ Exceeds your boat's limits";
      warningHtml = `<div style="color: #ef4444; font-size: 0.75rem; font-weight: 600; margin-top: 0.35rem; text-align: center;">${warnMsg}</div>`;
    }

    const infoText = harbor.info || (state.currentLang === 'fr' ? "Aucune information supplémentaire." : "No additional information.");

    const popupContent = `
      <div style="font-family: var(--font-family, sans-serif); min-width: 240px; color: var(--text-color); line-height: 1.4;">
        <strong style="font-size: 1.05rem; color: var(--accent-color);">⚓ ${harbor.name}</strong><br>
        <span style="color: var(--text-muted); font-size: 0.75rem; text-transform: uppercase; font-weight: 600;">${labelType}</span>
        <hr style="margin: 6px 0; border-color: var(--border-color);">
        
        <div style="font-size: 0.85rem; margin-bottom: 0.75rem; display: flex; flex-direction: column; gap: 0.35rem;">
          <div><strong>📞 ${labelCapitainerie} :</strong> ${harbor.phone}</div>
          <div><strong>📡 ${labelVHF} :</strong> ${harbor.vhf}</div>
          ${harbor.email !== '-' ? `<div><strong>✉️ ${labelEmail} :</strong> <a href="mailto:${harbor.email}" style="color: var(--accent-color); text-decoration: none;">${harbor.email}</a></div>` : ''}
          ${websiteHtml}
          <div><strong>📍 ${labelAddress} :</strong> ${harbor.address}</div>
        </div>
        
        <div style="background: rgba(255,255,255,0.03); border: 1px solid var(--border-color); border-radius: 0.5rem; padding: 0.5rem; font-size: 0.8rem; margin-bottom: 0.75rem;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 0.2rem;"><span>${labelPlaces}:</span><strong>${harbor.berths}</strong></div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 0.2rem;"><span>${labelMaxLen}:</span><strong style="${lengthStyle}">${lengthIcon}${lenValText}</strong></div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 0.2rem;"><span>${labelMaxDraft}:</span><strong style="${draftStyle}">${draftIcon}${draftValText}</strong></div>
          <div style="border-top: 1px solid var(--border-color); padding-top: 0.3rem; margin-top: 0.3rem;">
            <strong>${labelServices} :</strong> ${harbor.services}
          </div>
          ${warningHtml}
        </div>
        
        <p style="font-size: 0.8rem; color: var(--text-muted); font-style: italic; margin-bottom: 0.2rem; line-height: 1.35;">
          ${infoText}
        </p>
      </div>
    `;

    const marker = L.marker([harbor.lat, harbor.lng], { icon: harborIcon }).bindPopup(popupContent, { maxWidth: 280 });
    marker.addTo(state.harborsLayer);
    state.harborMarkers.push(marker);

    // Sidebar list population
    if (listContainer) {
      const item = document.createElement('div');
      item.className = 'history-item';
      
      // Highlight sidebar item border in orange if boat constraints exceeded
      const borderTheme = (draftWarning || lengthWarning) ? "#f97316" : "var(--accent-color)";
      item.style.borderLeft = `3px solid ${borderTheme}`;
      
      const warnBadge = (draftWarning || lengthWarning) ? " ⚠️" : "";
      
      item.innerHTML = `
        <div class="history-info" onclick="zoomToHarbor(${idx})" style="cursor: pointer;">
          <div class="history-name" style="font-weight: 600;">${harbor.name}${warnBadge}</div>
          <div class="history-meta" style="font-size: 0.75rem; color: var(--text-muted); margin-top: 0.2rem;">
            📞 ${harbor.phone} | 📡 ${labelVHF} ${harbor.vhf}
          </div>
        </div>
        <button class="icon-btn" onclick="zoomToHarbor(${idx})" title="Zoom / Infos">
          <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
        </button>
      `;
      listContainer.appendChild(item);
    }
  });
}

// Zoom and focus on a selected harbor
export function zoomToHarbor(idx) {
  const harbor = state.currentHarbors[idx];
  const marker = state.harborMarkers[idx];
  if (!state.map || !harbor) return;
  state.map.setView([harbor.lat, harbor.lng], 15);
  if (marker) marker.openPopup();
  state.autoCenter = false;
  updateRecenterButtonUI();
  
  // Switch to map tab (Calques)
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
  const layersBtn = document.querySelector('[data-target="panel-layers"]');
  const layersPanel = document.getElementById('panel-layers');
  if (layersBtn) layersBtn.classList.add('active');
  if (layersPanel) layersPanel.classList.add('active');
}

export function onMapMoveHarbors() {
  if (state.harborsDebounceTimeout) clearTimeout(state.harborsDebounceTimeout);
  state.harborsDebounceTimeout = setTimeout(() => {
    fetchHarborsInViewport();
  }, 600);
}

// Expose zoomToHarbor globally for inline onclick
window.zoomToHarbor = zoomToHarbor;
