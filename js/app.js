// Sirroco Marine Navigation Core Logic - Entry Point & Orchestrator

import { state } from './state.js';
import { translations, translateUI } from './i18n.js';
import { calculateHaversineDistance, getPointOfSail, getSimulatedDepth } from './utils.js';
import { renderZoneList, checkDangerZoneProximity } from './dangerZones.js';
import { updateAnchorLocation, checkAnchorAlarm, deactivateAnchorAlarm } from './anchorAlarm.js';
import { toggleSimulator, startRealGPS, stopRealGPS } from './gpsSimulator.js';
import { updateWeatherAndTides, updateBoatSails, onMapMove } from './weatherTides.js';
import { fetchHarborsInViewport, clearHarborMarkers, onMapMoveHarbors, renderHarborListAndMarkers } from './harbors.js';
import { startRouteTracking, stopRouteTracking, clearHistory, renderSavedTracks } from './tracking.js';

// Update recenter button styling based on auto-centering state
export function updateRecenterButtonUI() {
  const btn = document.querySelector('.recenter-control-btn');
  if (btn) {
    if (state.autoCenter) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  }
}

// Leaflet Map Setup
export function initMap() {
  // Center on Toulon
  state.map = L.map('map', {
    center: [state.currentLat, state.currentLon],
    zoom: 13,
    zoomControl: true
  });

  // Base Layers
  state.osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap contributors'
  });

  // Add OSM as default base layer
  state.osm.addTo(state.map);

  // Overlays
  state.openseamap = L.tileLayer('https://tiles.openseamap.org/seamark/{z}/{x}/{y}.png', {
    attribution: '© OpenSeaMap'
  });
  state.openseamap.addTo(state.map);

  // Danger zone layer - color-coded
  import('./dangerZones.js').then(({ dangerZoneGeoJSON }) => {
    state.dangerZoneLayer = L.geoJSON(dangerZoneGeoJSON, {
      style: function (feature) {
        const type = feature.properties.type;
        let color = '#ef4444'; // Firing zone
        let fillOpacity = 0.25;
        
        if (type === 'military_restricted') color = '#f97316';
        else if (type === 'nato_exercise') { color = '#a855f7'; fillOpacity = 0.15; }
        else if (type === 'anchoring_prohibited') color = '#eab308';
        else if (type === 'restricted_navigation') color = '#3b82f6';

        return {
          color: color,
          weight: 2,
          fillColor: color,
          fillOpacity: fillOpacity
        };
      },
      onEachFeature: function (feature, layer) {
        const p = feature.properties;
        const statusLabel = p.status === 'permanent' ? '🔴 Permanent' : '🟡 Périodique';
        
        const popupContent = `
          <div style="font-family: var(--font-family, sans-serif); line-height: 1.4; color: var(--text-color);">
            <strong style="color: #ef4444; font-size: 0.95rem;">⚠️ ${p.name}</strong><br>
            <span style="font-size: 0.75rem; text-transform: uppercase; font-weight: 600; color: var(--text-muted);">${p.authority}</span>
            <hr style="margin: 4px 0; border-color: var(--border-color);">
            <p style="font-size: 0.8rem; margin: 4px 0;">${p.description}</p>
            <div style="font-size: 0.75rem; font-weight: 700; margin-top: 4px;">Statut : ${statusLabel}</div>
          </div>
        `;
        layer.bindPopup(popupContent, { maxWidth: 220 });
      }
    }).addTo(state.map);
  });

  // AVURNAV Warnings Overlay via SHOM WMS service
  state.pingWmsLayer = L.tileLayer.wms('https://services.ping-info-nautique.fr/wms', {
    layers: 'avurnav_active_zones',
    format: 'image/png',
    transparent: true,
    attribution: '© SHOM - Portail PING'
  });

  // Harbors group layer
  state.harborsLayer = L.layerGroup().addTo(state.map);

  // Boat/User position marker with SVG icon
  const userIcon = L.divIcon({
    className: 'boat-marker-container',
    html: `
      <div class="boat-outer-ring">
        <svg id="boat-svg" class="boat-marker-svg" viewBox="0 0 100 100" style="transform: rotate(${state.currentHeading}deg);">
          <!-- Hull -->
          <path class="boat-hull" d="M50,10 C62,35 65,70 50,90 C35,70 38,35 50,10 Z" />
          <!-- Mast & Boom -->
          <line class="boat-mast" x1="50" y1="45" x2="50" y2="85" />
          <!-- Mainsail (Grand Voile) -->
          <path id="boat-mainsail" class="boat-sail" d="M50,45 C50,45 28,65 50,80" />
          <!-- Jib / Genoa (Foc) -->
          <path id="boat-jib" class="boat-sail" d="M50,15 C50,15 32,32 50,43" />
        </svg>
      </div>
    `,
    iconSize: [44, 44],
    iconAnchor: [22, 22]
  });

  state.userMarker = L.marker([state.currentLat, state.currentLon], { icon: userIcon }).addTo(state.map);

  // Track drawing line
  state.trackLine = L.polyline([], { color: '#06b6d4', weight: 4, opacity: 0.85 }).addTo(state.map);

  // Recenter control button
  L.Control.Recenter = L.Control.extend({
    onAdd: function(m) {
      const container = L.DomUtil.create('div', 'leaflet-bar leaflet-control');
      const btn = L.DomUtil.create('a', 'recenter-control-btn', container);
      btn.href = '#';
      btn.title = state.currentLang === 'fr' ? 'Centrer sur la position' : 'Recenter to boat position';
      btn.innerHTML = '📍';
      
      L.DomEvent.disableClickPropagation(btn);
      L.DomEvent.disableScrollPropagation(btn);
      
      L.DomEvent.on(btn, 'click', function(e) {
        L.DomEvent.preventDefault(e);
        L.DomEvent.stopPropagation(e);
        state.autoCenter = true;
        m.setView([state.currentLat, state.currentLon], m.getZoom());
        updateRecenterButtonUI();
      });
      return container;
    },
    onRemove: function(m) {}
  });
  L.control.recenter = function(opts) { return new L.Control.Recenter(opts); };
  L.control.recenter({ position: 'topleft' }).addTo(state.map);

  // Stop auto-following if the user manually drags/pans the map
  state.map.on('dragstart', () => {
    state.autoCenter = false;
    updateRecenterButtonUI();
  });

  // Set initial recenter button active status
  updateRecenterButtonUI();

  // Weather & tides scroll update listener
  state.map.on('moveend', onMapMove);

  // Harbors viewport update listener
  state.map.on('moveend', onMapMoveHarbors);
}

export function updatePosition(lat, lng, speedKts, headingDeg) {
  state.currentLat = lat;
  state.currentLon = lng;
  state.currentSpeed = speedKts;
  state.currentHeading = headingDeg;

  // Update telemetry text elements
  const telLat = document.getElementById('telemetry-lat');
  const telLon = document.getElementById('telemetry-lon');
  const telSpeed = document.getElementById('telemetry-speed');
  const telCog = document.getElementById('telemetry-cog');
  
  if (telLat) telLat.textContent = lat.toFixed(5);
  if (telLon) telLon.textContent = lng.toFixed(5);
  if (telSpeed) telSpeed.textContent = speedKts.toFixed(1);
  if (telCog) telCog.textContent = Math.round(headingDeg).toString().padStart(3, '0');

  // Update map marker
  const newLatLng = L.latLng(lat, lng);
  if (state.userMarker) {
    state.userMarker.setLatLng(newLatLng);
    // Rotate boat icon
    const boatSvg = document.getElementById('boat-svg');
    if (boatSvg) {
      boatSvg.style.transform = `rotate(${headingDeg}deg)`;
      updateBoatSails(headingDeg, state.currentWindDirection);
    }
  }

  // Active navigation HUD updates and auto-centering
  if (state.appMode === 'navigation') {
    if (state.lastNavLatLng) {
      const step = calculateHaversineDistance(lat, lng, state.lastNavLatLng.lat, state.lastNavLatLng.lng);
      state.navigationDistance += step;
    }
    state.lastNavLatLng = newLatLng;

    // Update SOG, COG, Depth, Distance in HUD
    const hudSpeed = document.getElementById('hud-speed');
    const hudCog = document.getElementById('hud-cog');
    const hudDepth = document.getElementById('hud-depth');
    const hudDistance = document.getElementById('hud-distance');

    if (hudSpeed) hudSpeed.textContent = speedKts.toFixed(1);
    if (hudCog) hudCog.textContent = Math.round(headingDeg).toString().padStart(3, '0');
    
    const depth = getSimulatedDepth(lat, lng);
    if (hudDepth) hudDepth.textContent = depth.toFixed(1);

    const distNM = state.navigationDistance / 1852;
    if (hudDistance) hudDistance.textContent = distNM.toFixed(2) + " NM";

    // Relative wind arrow rotation (Simulating wind from WNW 290deg at 12 Kts)
    const hudWindVal = document.getElementById('hud-wind-val');
    if (hudWindVal) hudWindVal.textContent = "12 kts";
    const windArrow = document.getElementById('hud-wind-arrow');
    if (windArrow) {
      const relativeAngle = 290 - headingDeg;
      windArrow.style.transform = `rotate(${relativeAngle}deg)`;
    }

    // Auto-follow position in navigation mode if auto-center is active
    if (state.autoCenter && state.map) {
      state.map.panTo(newLatLng);
    }

    // Safety and proximity checks for warnings banner
    let warningText = null;
    const criticalDepth = state.boatProfile.draft + state.boatProfile.clearance;
    if (depth <= state.boatProfile.draft) {
      warningText = state.currentLang === 'fr' ? `⚠️ ÉCHOUEMENT PROCHE ! Sondeur: ${depth.toFixed(1)}m` : `⚠️ GROUNDING RISK! Depth: ${depth.toFixed(1)}m`;
    } else if (depth <= criticalDepth) {
      warningText = state.currentLang === 'fr' ? `⚠️ PROFONDEUR BASSE ! Sondeur: ${depth.toFixed(1)}m` : `⚠️ SHALLOW DEPTH! Depth: ${depth.toFixed(1)}m`;
    }

    if (!warningText) {
      const prox = checkDangerZoneProximity(lat, lng);
      if (prox.warningText) {
        warningText = `⚠️ ${prox.warningText}`;
      }
    }

    const banner = document.getElementById('danger-warning-banner');
    const bannerText = document.getElementById('danger-warning-text');
    if (warningText) {
      if (banner) banner.style.display = 'flex';
      if (bannerText) bannerText.textContent = warningText;
    } else {
      if (banner) banner.style.display = 'none';
    }
  }

  // Active tracking
  if (state.isTracking) {
    const windDir = state.currentWindDirection !== null ? state.currentWindDirection : 290;
    const allure = getPointOfSail(headingDeg, windDir);
    state.currentTrack.push({
      lat: lat,
      lng: lng,
      time: Date.now(),
      speed: speedKts,
      heading: headingDeg,
      windDir: windDir,
      pointOfSail: allure
    });
    state.trackLine.setLatLngs(state.currentTrack.map(p => [p.lat, p.lng]));
  }

  // Check anchor alarm
  checkAnchorAlarm();
}

// Set Mode switching function
export function setAppMode(mode) {
  state.appMode = mode;
  document.body.setAttribute('data-app-mode', mode);
  
  const consBtn = document.getElementById('mode-consultation-btn');
  const navBtn = document.getElementById('mode-navigation-btn');
  const weatherBtn = document.getElementById('mode-weather-btn');
  const sidebar = document.getElementById('sidebar-drawer');
  const hud = document.getElementById('navigation-hud');
  const telemetry = document.getElementById('telemetry-overlay');
  const warnBanner = document.getElementById('danger-warning-banner');
  
  const sidebarTabs = document.querySelector('.sidebar-tabs');
  const weatherHeader = document.getElementById('weather-sidebar-header');

  // Deactivate all mode buttons
  if (consBtn) consBtn.classList.remove('active');
  if (navBtn) navBtn.classList.remove('active');
  if (weatherBtn) weatherBtn.classList.remove('active');

  if (mode === 'navigation') {
    if (navBtn) navBtn.classList.add('active');
    
    // Auto collapse sidebar
    if (sidebar) sidebar.classList.add('collapsed');
    
    // Toggle overlays
    if (hud) hud.style.display = 'flex';
    if (telemetry) telemetry.style.display = 'none';

    // Start auto track
    startRouteTracking();
    
    // Reset stats
    state.navigationStartTime = Date.now();
    state.navigationDistance = 0;
    state.lastNavLatLng = L.latLng(state.currentLat, state.currentLon);
    
    // Update Boat Name in HUD
    const hudBoatName = document.getElementById('hud-boat-name');
    if (hudBoatName) hudBoatName.textContent = state.boatProfile.name;
    
    // Set Map View zoom on user and enable auto-centering
    if (state.map) state.map.setView([state.currentLat, state.currentLon], 15);
    state.autoCenter = true;
    updateRecenterButtonUI();
    
    // Duration timer update loop
    if (state.navTimerInterval) clearInterval(state.navTimerInterval);
    state.navTimerInterval = setInterval(() => {
      if (!state.navigationStartTime) return;
      const elapsedMs = Date.now() - state.navigationStartTime;
      const seconds = Math.floor((elapsedMs / 1000) % 60);
      const minutes = Math.floor((elapsedMs / (1000 * 60)) % 60);
      const hours = Math.floor((elapsedMs / (1000 * 60 * 60)) % 24);
      
      const durationStr = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      const hudDur = document.getElementById('hud-duration');
      if (hudDur) hudDur.textContent = durationStr;
    }, 1000);

  } else if (mode === 'weather') {
    if (weatherBtn) weatherBtn.classList.add('active');

    // Expand sidebar
    if (sidebar) sidebar.classList.remove('collapsed');

    // Hide standard sidebar tabs and show weather specific title
    if (sidebarTabs) sidebarTabs.style.display = 'none';
    if (weatherHeader) weatherHeader.style.display = 'block';

    // Set panel-weather active and others inactive
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
    const weatherPanel = document.getElementById('panel-weather');
    if (weatherPanel) weatherPanel.classList.add('active');

    // Hide navigation overlays
    if (hud) hud.style.display = 'none';
    if (telemetry) telemetry.style.display = 'none';
    if (warnBanner) warnBanner.style.display = 'none';

    // Stop navigation timer
    if (state.navTimerInterval) {
      clearInterval(state.navTimerInterval);
      state.navTimerInterval = null;
    }

    // Immediately trigger weather update for the current map center
    if (state.map) {
      const center = state.map.getCenter();
      updateWeatherAndTides(center.lat, center.lng, true);
    }

  } else {
    // Mode Consultation
    if (consBtn) consBtn.classList.add('active');
    
    // Expand sidebar if on desktop
    if (sidebar && window.innerWidth > 768) {
      sidebar.classList.remove('collapsed');
    }
    
    // Show standard sidebar tabs and hide weather specific title
    if (sidebarTabs) sidebarTabs.style.display = 'flex';
    if (weatherHeader) weatherHeader.style.display = 'none';

    // Set panel-layers active in sidebar
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
    const layersBtn = document.querySelector('[data-target="panel-layers"]');
    const layersPanel = document.getElementById('panel-layers');
    if (layersBtn) layersBtn.classList.add('active');
    if (layersPanel) layersPanel.classList.add('active');

    // Toggle overlays
    if (hud) hud.style.display = 'none';
    if (telemetry) telemetry.style.display = 'flex';
    if (warnBanner) warnBanner.style.display = 'none';

    // Clear navigation timer
    if (state.navTimerInterval) {
      clearInterval(state.navTimerInterval);
      state.navTimerInterval = null;
    }
  }

  // Trigger map resize check to adapt to sidebar layout changes
  if (state.map) {
    state.map.invalidateSize();
    setTimeout(() => { if (state.map) state.map.invalidateSize(); }, 100);
    setTimeout(() => { if (state.map) state.map.invalidateSize(); }, 350);
  }
}

// Load and save boat profile
export function loadBoatProfile() {
  const saved = localStorage.getItem('sirroco_boat_profile');
  if (saved) {
    state.boatProfile = JSON.parse(saved);
  }
  
  // Populate form
  const bName = document.getElementById('boat-name');
  const bLen = document.getElementById('boat-length');
  const bWidth = document.getElementById('boat-width');
  const bDraft = document.getElementById('boat-draft');
  const bClearance = document.getElementById('boat-clearance');

  if (bName) bName.value = state.boatProfile.name;
  if (bLen) bLen.value = state.boatProfile.length;
  if (bWidth) bWidth.value = state.boatProfile.width;
  if (bDraft) bDraft.value = state.boatProfile.draft;
  if (bClearance) bClearance.value = state.boatProfile.clearance;
}

export function saveBoatProfile(profile) {
  state.boatProfile = profile;
  localStorage.setItem('sirroco_boat_profile', JSON.stringify(state.boatProfile));
  
  // Update display values
  const hudBoatName = document.getElementById('hud-boat-name');
  if (hudBoatName) hudBoatName.textContent = state.boatProfile.name;
  
  const draftDisp = document.getElementById('panel-boat-draft-display');
  if (draftDisp) draftDisp.textContent = state.boatProfile.draft.toFixed(1);

  // Re-evaluate anchorages (now harbors)
  renderHarborListAndMarkers();
}

// Initializations & Event Listeners
document.addEventListener("DOMContentLoaded", () => {
  // Load local settings
  const cachedLang = localStorage.getItem('sirroco_lang') || 'fr';
  const modalLangSelector = document.getElementById('lang-selector-modal');
  if (modalLangSelector) {
    modalLangSelector.value = cachedLang;
  }
  
  const savedHistory = localStorage.getItem('sirroco_saved_tracks');
  if (savedHistory) {
    state.savedTracks = JSON.parse(savedHistory);
  }

  // Load boat profile settings
  loadBoatProfile();

  // Init Map
  initMap();
  
  // Set Language
  translateUI(cachedLang);

  // Render initial harbors on map and list
  fetchHarborsInViewport();

  // Render history list
  renderSavedTracks();

  // Initial weather and tides fetch for current user position
  updateWeatherAndTides(state.currentLat, state.currentLon, true);

  // Render danger zone list in sidebar
  renderZoneList();

  // Mode Switcher Controls
  document.getElementById('mode-consultation-btn').addEventListener('click', () => {
    setAppMode('consultation');
  });

  document.getElementById('mode-navigation-btn').addEventListener('click', () => {
    setAppMode('navigation');
  });

  const modeWeatherBtn = document.getElementById('mode-weather-btn');
  if (modeWeatherBtn) {
    modeWeatherBtn.addEventListener('click', () => {
      setAppMode('weather');
    });
  }

  // Navigation HUD Stop Button
  document.getElementById('stop-nav-btn').addEventListener('click', () => {
    setAppMode('consultation');
    stopRouteTracking();
  });

  // Control Center Settings Modal Toggle
  const settingsModal = document.getElementById('settings-modal');
  document.getElementById('settings-toggle-btn').addEventListener('click', () => {
    if (settingsModal) settingsModal.style.display = 'flex';
  });

  document.getElementById('modal-close-btn').addEventListener('click', () => {
    if (settingsModal) settingsModal.style.display = 'none';
  });

  // Hide modal on background click
  if (settingsModal) {
    settingsModal.addEventListener('click', (e) => {
      if (e.target === settingsModal) {
        settingsModal.style.display = 'none';
      }
    });
  }

  // Anchor Direct Toggle
  const anchorToggleBtn = document.getElementById('anchor-toggle-btn');
  if (anchorToggleBtn) {
    anchorToggleBtn.addEventListener('click', () => {
      const activeText = state.currentLang === 'fr' ? "Activer l'alarme de mouillage (rayon : 0.030 NM) ?" : 
                        (state.currentLang === 'es' ? "¿Activar alarma de ancla (radio: 0.030 NM)?" : "Activate anchor alarm (radius: 0.030 NM)?");
      const deactiveText = state.currentLang === 'fr' ? "Désactiver l'alarme de mouillage ?" : 
                          (state.currentLang === 'es' ? "¿Desactivar alarma de ancla?" : "Deactivate anchor alarm?");
      
      if (!state.isAnchorAlarmActive) {
        if (confirm(activeText)) {
          state.isAnchorAlarmActive = true;
          state.alarmRadius = 0.030;
          
          // Update radius labels if they exist
          const radiusVal = document.getElementById('alarm-radius-val');
          if (radiusVal) radiusVal.textContent = state.alarmRadius.toFixed(3);
          const radiusInput = document.getElementById('alarm-radius-input');
          if (radiusInput) radiusInput.value = state.alarmRadius;
          
          updateAnchorLocation(state.currentLat, state.currentLon);
          
          anchorToggleBtn.classList.add('active');
          const anchorBadge = document.getElementById('status-anchor-badge');
          if (anchorBadge) anchorBadge.style.display = 'flex';
          
          const toggle = document.getElementById('anchor-alarm-toggle');
          if (toggle) toggle.checked = true;
          
          const statusText = document.getElementById('anchor-status-text');
          if (statusText) statusText.textContent = translations[state.currentLang].active;
          const statusIndicator = document.getElementById('anchor-status-indicator');
          if (statusIndicator) statusIndicator.className = "status-indicator active";
        }
      } else {
        if (confirm(deactiveText)) {
          deactivateAnchorAlarm();
        }
      }
    });
  }

  // Settings Modal Tabs selection
  const modalTabs = document.querySelectorAll('.modal-tab-btn');
  const modalPanes = document.querySelectorAll('.modal-pane');
  modalTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      modalTabs.forEach(t => t.classList.remove('active'));
      modalPanes.forEach(p => p.classList.remove('active'));

      tab.classList.add('active');
      const targetPane = tab.getAttribute('data-tab');
      const pane = document.getElementById(targetPane);
      if (pane) pane.classList.add('active');
    });
  });

  // Boat profile form submission
  document.getElementById('boat-profile-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const profile = {
      name: document.getElementById('boat-name').value,
      length: parseFloat(document.getElementById('boat-length').value) || 11.5,
      width: parseFloat(document.getElementById('boat-width').value) || 3.8,
      draft: parseFloat(document.getElementById('boat-draft').value) || 1.9,
      clearance: parseFloat(document.getElementById('boat-clearance').value) || 0.5
    };
    saveBoatProfile(profile);
    if (settingsModal) settingsModal.style.display = 'none';
  });

  // PING AVURNAV button: open portal in new tab
  const avurnavBtn = document.getElementById('show-avurnav-btn');
  if (avurnavBtn) {
    avurnavBtn.addEventListener('click', () => {
      window.open('https://portail.ping-info-nautique.fr/avurnav-notice', '_blank', 'noopener,noreferrer');
    });
  }

  // Overlays Custom Controls
  const layerDangers = document.getElementById('layer-dangers');
  if (layerDangers) {
    layerDangers.addEventListener('change', (e) => {
      if (!state.dangerZoneLayer || !state.map) return;
      if (e.target.checked) {
        state.dangerZoneLayer.addTo(state.map);
      } else {
        state.map.removeLayer(state.dangerZoneLayer);
      }
    });
  }

  const layerAvurnav = document.getElementById('layer-avurnav');
  if (layerAvurnav) {
    layerAvurnav.addEventListener('change', (e) => {
      if (!state.pingWmsLayer || !state.map) return;
      if (e.target.checked) {
        state.pingWmsLayer.addTo(state.map);
      } else {
        state.map.removeLayer(state.pingWmsLayer);
      }
    });
  }

  const layerHarbors = document.getElementById('layer-harbors');
  if (layerHarbors) {
    layerHarbors.addEventListener('change', (e) => {
      if (!state.harborsLayer || !state.map) return;
      if (e.target.checked) {
        state.harborsLayer.addTo(state.map);
        fetchHarborsInViewport();
      } else {
        state.map.removeLayer(state.harborsLayer);
        clearHarborMarkers();
        import('./harbors.js').then(({ displayHarborMessage }) => {
          displayHarborMessage(state.currentLang === 'fr' ? "Activez le calque 'Ports de plaisance' pour voir la liste." : "Enable 'Marinas' layer to see the list.");
        });
      }
    });
  }

  // Language selector inside Modal
  if (modalLangSelector) {
    modalLangSelector.addEventListener('change', (e) => {
      translateUI(e.target.value);
      renderHarborListAndMarkers(); // Re-render to update harbors list/markers on translation
    });
  }

  // Theme switcher inside Modal
  const themeBtnModal = document.getElementById('theme-toggle-modal');
  if (themeBtnModal) {
    themeBtnModal.addEventListener('click', () => {
      const currentTheme = document.body.getAttribute('data-theme');
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';
      document.body.setAttribute('data-theme', newTheme);
      localStorage.setItem('sirroco_theme', newTheme);
    });
  }

  // Set initial theme
  const cachedTheme = localStorage.getItem('sirroco_theme') || 'dark';
  document.body.setAttribute('data-theme', cachedTheme);

  // Sidebar Tabs Navigation (Consultation Mode)
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabPanels = document.querySelectorAll('.tab-panel');
  
  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      tabButtons.forEach(b => b.classList.remove('active'));
      tabPanels.forEach(p => p.classList.remove('active'));
      
      btn.classList.add('active');
      const targetPanel = btn.getAttribute('data-target');
      const panel = document.getElementById(targetPanel);
      if (panel) panel.classList.add('active');
      
      // Fetch fresh weather data when entering the weather panel
      if (targetPanel === 'panel-weather' && state.map) {
        const center = state.map.getCenter();
        updateWeatherAndTides(center.lat, center.lng);
      }
      
      // On small screens, if sidebar tab changes, keep open or toggle
      if (window.innerWidth <= 768) {
        document.getElementById('sidebar-drawer').classList.remove('collapsed');
      }
    });
  });

  // Sidebar Drawer Toggle for Mobile
  const drawerBtn = document.getElementById('drawer-toggle-btn');
  const sidebar = document.getElementById('sidebar-drawer');
  if (drawerBtn && sidebar) {
    drawerBtn.addEventListener('click', () => {
      sidebar.classList.toggle('collapsed');
    });
  }

  // Track Buttons
  document.getElementById('start-track-btn').addEventListener('click', startRouteTracking);
  document.getElementById('stop-track-btn').addEventListener('click', stopRouteTracking);
  document.getElementById('clear-tracks-btn').addEventListener('click', clearHistory);

  // Anchor Alarm Setup
  const anchorToggle = document.getElementById('anchor-alarm-toggle');
  anchorToggle.addEventListener('change', (e) => {
    state.isAnchorAlarmActive = e.target.checked;
    
    if (state.isAnchorAlarmActive) {
      const statusText = document.getElementById('anchor-status-text');
      const statusIndicator = document.getElementById('anchor-status-indicator');
      if (statusText) statusText.textContent = translations[state.currentLang].active;
      if (statusIndicator) statusIndicator.className = "status-indicator active";
      updateAnchorLocation(state.currentLat, state.currentLon);
      const btn = document.getElementById('anchor-toggle-btn');
      if (btn) btn.classList.add('active');
      const badge = document.getElementById('status-anchor-badge');
      if (badge) badge.style.display = 'flex';
    } else {
      deactivateAnchorAlarm();
    }
  });

  document.getElementById('alarm-radius-input').addEventListener('input', (e) => {
    state.alarmRadius = parseFloat(e.target.value) || 0.01;
    document.getElementById('alarm-radius-val').textContent = state.alarmRadius.toFixed(3);
    if (state.anchorCircle) {
      state.anchorCircle.setRadius(state.alarmRadius * 1852);
    }
    checkAnchorAlarm();
  });

  // Test siren play/stop inside Modal
  let isSirenTesting = false;
  const testSirenBtnModal = document.getElementById('test-siren-btn-modal');
  if (testSirenBtnModal) {
    testSirenBtnModal.addEventListener('click', (e) => {
      isSirenTesting = !isSirenTesting;
      if (isSirenTesting) {
        import('./anchorAlarm.js').then(({ playAlarmSound }) => playAlarmSound());
        e.target.classList.add('btn-danger');
        e.target.textContent = "Stop Test";
      } else {
        import('./anchorAlarm.js').then(({ stopAlarmSound }) => stopAlarmSound());
        e.target.classList.remove('btn-danger');
        e.target.textContent = translations[state.currentLang].siren_test;
      }
    });
  }

  // Clear alarm AND stop route tracking in one button
  document.getElementById('alarm-clear-all-btn').addEventListener('click', () => {
    deactivateAnchorAlarm();
    stopRouteTracking();
  });
  
  // Set default radius label text
  document.getElementById('alarm-radius-val').textContent = state.alarmRadius.toFixed(3);

  // GPS Simulator settings inside Modal
  const simToggleModal = document.getElementById('simulator-toggle-modal');
  if (simToggleModal) {
    simToggleModal.addEventListener('change', (e) => {
      toggleSimulator(e.target.checked);
    });
  }

  const speedSliderModal = document.getElementById('sim-speed-slider-modal');
  if (speedSliderModal) {
    speedSliderModal.addEventListener('input', (e) => {
      state.simSpeed = parseFloat(e.target.value);
      const valDisp = document.getElementById('sim-speed-val-modal');
      if (valDisp) valDisp.textContent = state.simSpeed.toFixed(1);
    });
  }

  const headingSliderModal = document.getElementById('sim-heading-slider-modal');
  if (headingSliderModal) {
    headingSliderModal.addEventListener('input', (e) => {
      state.simHeading = parseInt(e.target.value);
      const valDisp = document.getElementById('sim-heading-val-modal');
      if (valDisp) valDisp.textContent = state.simHeading.toString().padStart(3, '0');
    });
  }

  const simDriftBtnModal = document.getElementById('sim-drift-btn-modal');
  if (simDriftBtnModal) {
    simDriftBtnModal.addEventListener('click', () => {
      import('./gpsSimulator.js').then(({ triggerSimulatorDrift }) => triggerSimulatorDrift());
    });
  }

  // Window resize handler for Leaflet
  window.addEventListener('resize', () => {
    if (state.map) state.map.invalidateSize();
  });

  // Initialize Simulator Active by default
  toggleSimulator(true);
});

// PWA Service Worker Registration
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js')
      .then(reg => console.log('Service Worker Registered!', reg.scope))
      .catch(err => console.log('Service Worker failed to register', err));
  });
}
