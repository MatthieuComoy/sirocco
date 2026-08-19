// Sirroco Marine Navigation - PING NAVAREA II & AVURNAV Warnings Integration
// Parses and displays S-124 XML navigation warnings from SHOM PING portal

import { state } from './state.js';
import { updateRecenterButtonUI } from './app.js';

const SERIES = [
  // NAVAREA
  { name: 'NAVAREA II', id: 'NAVAREA II', fallbackUrl: './data/navarea2.xml', enabled: false, type: 'navarea' },

  // Métropole - AVURNAV
  { name: 'AVURNAV Toulon', id: 'AVURNAV TOULON', fallbackUrl: './data/toulon.xml', enabled: true, type: 'avurnav' },
  { name: 'AVURNAV Brest', id: 'AVURNAV BREST', fallbackUrl: './data/brest.xml', enabled: true, type: 'avurnav' },
  { name: 'AVURNAV Cherbourg', id: 'AVURNAV CHERBOURG', fallbackUrl: './data/cherbourg.xml', enabled: true, type: 'avurnav' },

  // Métropole - AVINAV
  { name: 'AVINAV Toulon', id: 'AVINAV TOULON', fallbackUrl: './data/avinav_toulon.xml', enabled: true, type: 'avinav' },
  { name: 'AVINAV Brest', id: 'AVINAV BREST', fallbackUrl: './data/avinav_brest.xml', enabled: true, type: 'avinav' },
  { name: 'AVINAV Cherbourg', id: 'AVINAV CHERBOURG', fallbackUrl: './data/avinav_cherbourg.xml', enabled: true, type: 'avinav' },

  // Métropole - AVURNAV Local
  { name: 'AVURNAV Local Toulon', id: 'AVURNAV LOCAL TOULON', fallbackUrl: './data/avurnav_local_toulon.xml', enabled: true, type: 'avurnav_local' },
  { name: 'AVURNAV Local Brest', id: 'AVURNAV LOCAL BREST', fallbackUrl: './data/avurnav_local_brest.xml', enabled: true, type: 'avurnav_local' },
  { name: 'AVURNAV Local Cherbourg', id: 'AVURNAV LOCAL CHERBOURG', fallbackUrl: './data/avurnav_local_cherbourg.xml', enabled: true, type: 'avurnav_local' },

  // Outre-mer - AVURNAV
  { name: 'AVURNAV Antilles', id: 'AVURNAV ANTILLES', fallbackUrl: './data/antilles.xml', enabled: true, type: 'avurnav' },
  { name: 'AVURNAV Guyane', id: 'AVURNAV GUYANE', fallbackUrl: './data/guyane.xml', enabled: true, type: 'avurnav' },
  { name: 'AVURNAV Réunion', id: 'AVURNAV REUNION', fallbackUrl: './data/reunion.xml', enabled: true, type: 'avurnav' },
  { name: 'AVURNAV Mayotte', id: 'AVURNAV MAYOTTE', fallbackUrl: './data/mayotte.xml', enabled: true, type: 'avurnav' },
  { name: 'AVURNAV Nouvelle Calédonie', id: 'AVURNAV NOUVELLE CALEDONIE', fallbackUrl: './data/nouvelle_caledonie.xml', enabled: true, type: 'avurnav' },
  { name: 'AVURNAV Polynésie', id: 'AVURNAV POLYNESIE', fallbackUrl: './data/polynesie.xml', enabled: true, type: 'avurnav' },
  { name: 'AVURNAV St Pierre et Miquelon', id: 'AVURNAV ST PIERRE ET MIQUELON', fallbackUrl: './data/st_pierre_miquelon.xml', enabled: true, type: 'avurnav' },

  // Outre-mer - AVINAV
  { name: 'AVINAV Antilles', id: 'AVINAV ANTILLES', fallbackUrl: './data/avinav_antilles.xml', enabled: true, type: 'avinav' },
  { name: 'AVINAV Guyane', id: 'AVINAV GUYANE', fallbackUrl: './data/avinav_guyane.xml', enabled: true, type: 'avinav' },
  { name: 'AVINAV Réunion', id: 'AVINAV REUNION', fallbackUrl: './data/avinav_reunion.xml', enabled: true, type: 'avinav' },
  { name: 'AVINAV Mayotte', id: 'AVINAV MAYOTTE', fallbackUrl: './data/avinav_mayotte.xml', enabled: true, type: 'avinav' },
  { name: 'AVINAV Nouvelle Calédonie', id: 'AVINAV NOUVELLE CALEDONIE', fallbackUrl: './data/avinav_nouvelle_caledonie.xml', enabled: true, type: 'avinav' },
  { name: 'AVINAV Polynésie', id: 'AVINAV POLYNESIE', fallbackUrl: './data/avinav_polynesie.xml', enabled: true, type: 'avinav' },
  { name: 'AVINAV St Pierre et Miquelon', id: 'AVINAV ST PIERRE ET MIQUELON', fallbackUrl: './data/avinav_st_pierre_miquelon.xml', enabled: true, type: 'avinav' },

  // Outre-mer - AVURNAV Local
  { name: 'AVURNAV Local Antilles', id: 'AVURNAV LOCAL ANTILLES', fallbackUrl: './data/avurnav_local_antilles.xml', enabled: true, type: 'avurnav_local' },
  { name: 'AVURNAV Local Guyane', id: 'AVURNAV LOCAL GUYANE', fallbackUrl: './data/avurnav_local_guyane.xml', enabled: true, type: 'avurnav_local' },
  { name: 'AVURNAV Local Réunion', id: 'AVURNAV LOCAL REUNION', fallbackUrl: './data/avurnav_local_reunion.xml', enabled: true, type: 'avurnav_local' },
  { name: 'AVURNAV Local Mayotte', id: 'AVURNAV LOCAL MAYOTTE', fallbackUrl: './data/avurnav_local_mayotte.xml', enabled: true, type: 'avurnav_local' },
  { name: 'AVURNAV Local Nouvelle Calédonie', id: 'AVURNAV LOCAL NOUVELLE CALEDONIE', fallbackUrl: './data/avurnav_local_nouvelle_caledonie.xml', enabled: true, type: 'avurnav_local' },
  { name: 'AVURNAV Local Polynésie', id: 'AVURNAV LOCAL POLYNESIE', fallbackUrl: './data/avurnav_local_polynesie.xml', enabled: true, type: 'avurnav_local' },
  { name: 'AVURNAV Local St Pierre et Miquelon', id: 'AVURNAV LOCAL ST PIERRE ET MIQUELON', fallbackUrl: './data/avurnav_local_st_pierre_miquelon.xml', enabled: true, type: 'avurnav_local' },
];

// Dynamically build liveUrl for enabled series
SERIES.forEach(s => {
  if (s.enabled) {
    s.liveUrl = `https://services.ping-info-nautique.fr/nw/v1/Get_NW_Messages?nameOfSeries=${encodeURIComponent(s.id)}&lang=fr`;
  }
});

// Coordinate projection from EPSG:3857 (Web Mercator) to EPSG:4326 (WGS 84)
export function mercatorToWgs84(x, y) {
  const rMajor = 6378137; // Equatorial radius of Earth in meters
  const lon = (x / rMajor) * (180 / Math.PI);
  const lat = (180 / Math.PI) * (2 * Math.atan(Math.exp(y / rMajor)) - Math.PI / 2);
  return [lon, lat];
}

// Parses coordinates from a GML coordinates tag
function parseGmlCoordinates(coordStr) {
  const coords = [];
  if (!coordStr) return coords;
  
  const tokens = coordStr.trim().split(/\s+/);
  for (const token of tokens) {
    if (!token) continue;
    const parts = token.split(',');
    if (parts.length === 2) {
      const x = parseFloat(parts[0]);
      const y = parseFloat(parts[1]);
      if (!isNaN(x) && !isNaN(y)) {
        const [lon, lat] = mercatorToWgs84(x, y);
        coords.push([lat, lon]); // Leaflet format: [lat, lon]
      }
    }
  }
  return coords;
}

// Helper to query element list with or without namespace prefix
function getElements(parent, localName) {
  let elms = parent.getElementsByTagName('S124:' + localName);
  if (elms.length === 0) {
    elms = parent.getElementsByTagName(localName);
  }
  if (elms.length === 0) {
    elms = parent.getElementsByTagName('S100:' + localName);
  }
  if (elms.length === 0) {
    elms = parent.getElementsByTagName('gml:' + localName);
  }
  return Array.from(elms);
}

// Helper to get element text value
function getElementValue(parent, localName, defaultValue = '') {
  const elms = getElements(parent, localName);
  return elms.length > 0 ? elms[0].textContent.trim() : defaultValue;
}

// Global list of parsed warnings
let parsedWarnings = [];
let lastSourceInfo = "mixed";

// Toggle WMS and vector layers visibility based on checkbox status
export function updatePingLayersVisibility() {
  if (!state.map) return;
  
  const showAll = document.getElementById('layer-all-warnings')?.checked ?? true;
  const showAvurnav = document.getElementById('layer-avurnav')?.checked ?? true;
  const showAvurnavLocal = document.getElementById('layer-avurnav-local')?.checked ?? true;
  const showAvinav = document.getElementById('layer-avinav')?.checked ?? true;
  
  // Toggles the raster WMS layer if master is checked and at least one category is checked
  if (state.pingWmsLayer) {
    if (showAll && (showAvurnav || showAvurnavLocal || showAvinav)) {
      state.pingWmsLayer.addTo(state.map);
    } else {
      state.map.removeLayer(state.pingWmsLayer);
    }
  }
  
  // Re-draw/filter vector warnings
  plotWarningsOnMap();
}

// Main initialization function
export function initPingWarnings() {
  // Create Leaflet layer group for warnings
  state.pingWarningsLayer = L.layerGroup();
  
  const toggleAll = document.getElementById('layer-all-warnings');
  const toggleAvurnav = document.getElementById('layer-avurnav');
  const toggleAvurnavLocal = document.getElementById('layer-avurnav-local');
  const toggleAvinav = document.getElementById('layer-avinav');
  
  if (toggleAll) {
    toggleAll.addEventListener('change', (e) => {
      const checked = e.target.checked;
      if (toggleAvurnav) toggleAvurnav.checked = checked;
      if (toggleAvurnavLocal) toggleAvurnavLocal.checked = checked;
      if (toggleAvinav) toggleAvinav.checked = checked;
      updatePingLayersVisibility();
    });
  }
  
  const handleSubChange = () => {
    if (toggleAll && toggleAvurnav && toggleAvurnavLocal && toggleAvinav) {
      // If all are unchecked, uncheck the master. If any is checked, check the master.
      const anyChecked = toggleAvurnav.checked || toggleAvurnavLocal.checked || toggleAvinav.checked;
      toggleAll.checked = anyChecked;
    }
    updatePingLayersVisibility();
  };
  
  if (toggleAvurnav) toggleAvurnav.addEventListener('change', handleSubChange);
  if (toggleAvurnavLocal) toggleAvurnavLocal.addEventListener('change', handleSubChange);
  if (toggleAvinav) toggleAvinav.addEventListener('change', handleSubChange);
  
  // Start loading warnings automatically on startup
  loadAvurnavWarnings();
}

// Fetch helper for a single series (with local file fallback)
async function fetchXml(series) {
  let xmlText = "";
  let source = "live";
  
  try {
    const response = await fetch(series.liveUrl);
    if (!response.ok) throw new Error("CORS or Server Error");
    xmlText = await response.text();
  } catch (err) {
    console.warn(`Could not fetch live ${series.name} XML (likely due to CORS or offline). Falling back to local copy.`, err);
    const response = await fetch(series.fallbackUrl);
    if (!response.ok) throw new Error("Local fallback file not found");
    xmlText = await response.text();
    source = "local";
  }
  
  return { series, xmlText, source };
}

// Load and parse all warning series
export async function loadAvurnavWarnings() {
  renderWarningListMessage("Téléchargement des alertes PING en cours...");
  
  // Reset existing layers
  if (state.pingWarningsLayer) {
    state.pingWarningsLayer.clearLayers();
  }
  parsedWarnings = [];
  
  let liveCount = 0;
  let localCount = 0;
  
  try {
    const activeSeries = SERIES.filter(s => s.enabled);
    // Fetch all active series in parallel
    const results = await Promise.all(activeSeries.map(s => fetchXml(s).catch(err => {
      console.error(`Failed to fetch ${s.name}:`, err);
      return null;
    })));
    
    const parser = new DOMParser();
    
    for (const result of results) {
      if (!result) continue;
      
      if (result.source === 'live') liveCount++;
      else localCount++;
      
      // Yield execution to the main thread to keep UI interactive
      await new Promise(resolve => setTimeout(resolve, 0));
      
      const xmlDoc = parser.parseFromString(result.xmlText, "application/xml");
      
      // Check for parse error
      const parseError = xmlDoc.getElementsByTagName("parsererror");
      if (parseError.length > 0) {
        console.error(`XML Parse error in series ${result.series.name}:`, parseError[0].textContent);
        continue;
      }
      
      // Parse Preambles
      const preambles = new Map();
      getElements(xmlDoc, 'NWPreamble').forEach(preamble => {
        const gmlId = preamble.getAttribute('gml:id') || preamble.getAttribute('id') || getElementValue(preamble, 'id');
        const seriesId = getElements(preamble, 'messageSeriesIdentifier')[0];
        const nameOfSeries = seriesId ? getElementValue(seriesId, 'nameOfSeries') : result.series.name;
        const warningNumber = seriesId ? getElementValue(seriesId, 'warningNumber') : '';
        const year = seriesId ? getElementValue(seriesId, 'year') : '';
        const publicationDate = getElementValue(preamble, 'publicationDate');
        
        const areaTexts = [];
        getElements(preamble, 'generalArea').forEach(area => {
          getElements(area, 'locationName').forEach(loc => {
            const txt = getElementValue(loc, 'text');
            if (txt) areaTexts.push(txt);
          });
        });
        const generalArea = areaTexts.join(' > ') || 'Zone inconnue';
        
        const hazardTypeGeneral = getElementValue(preamble, 'warningHazardTypeGeneral');
        
        preambles.set(gmlId, {
          gmlId,
          nameOfSeries,
          warningNumber,
          year,
          publicationDate,
          generalArea,
          hazardTypeGeneral
        });
      });
      
      // Parse Features
      getElements(xmlDoc, 'NavigationalWarningFeaturePart').forEach(part => {
        const gmlId = part.getAttribute('gml:id') || part.getAttribute('id');
        
        const header = getElements(part, 'header')[0];
        let preambleHref = header ? (header.getAttribute('xlink:href') || header.getAttribute('href') || '') : '';
        if (preambleHref.startsWith('#')) {
          preambleHref = preambleHref.substring(1);
        }
        const preamble = preambles.get(preambleHref);
        
        const warnInfo = getElements(part, 'warningInformation')[0];
        const hazardTypeDetails = warnInfo ? getElementValue(warnInfo, 'warningHazardTypeDetails') : '';
        const information = warnInfo ? getElementValue(warnInfo, 'information') : getElementValue(part, 'information');
        
        // Skip index bulletins that don't represent real physical warnings
        if (preamble && preamble.hazardTypeGeneral === 'IN_FORCE_BULLETIN') {
          return;
        }
        
        // Parse geometry
        let geometry = null;
        const pointElms = getElements(part, 'Point');
        const polyElms = getElements(part, 'Polygon');
        const lineElms = getElements(part, 'LineString');
        
        if (pointElms.length > 0) {
          const coordStr = getElementValue(pointElms[0], 'coordinates');
          const coords = parseGmlCoordinates(coordStr);
          if (coords.length > 0) {
            geometry = { type: 'Point', coordinates: coords[0] };
          }
        } else if (polyElms.length > 0) {
          const coordStr = getElementValue(polyElms[0], 'coordinates');
          const coords = parseGmlCoordinates(coordStr);
          if (coords.length > 0) {
            geometry = { type: 'Polygon', coordinates: coords };
          }
        } else if (lineElms.length > 0) {
          const coordStr = getElementValue(lineElms[0], 'coordinates');
          const coords = parseGmlCoordinates(coordStr);
          if (coords.length > 0) {
            geometry = { type: 'LineString', coordinates: coords };
          }
        }
        
        if (!geometry && information) {
          const parsedCoords = parseCoordsFromText(information);
          geometry = determineGeometry(parsedCoords, information);
        }

        parsedWarnings.push({
          gmlId,
          preamble,
          hazardTypeDetails,
          information,
          geometry,
          visible: true, // Visible on the map by default
          type: result.series.type
        });
      });
    }
    
    // Load and append global NAVAREA warnings from NGA API
    try {
      await loadNgaWarnings();
    } catch (ngaErr) {
      console.error("Failed to load global NAVAREA warnings:", ngaErr);
    }
    
    // Set source info summary
    const totalActive = activeSeries.length;
    if (liveCount === totalActive) lastSourceInfo = "live";
    else if (localCount === totalActive) lastSourceInfo = "local";
    else lastSourceInfo = `live (${liveCount}) + offline (${localCount})`;
    
    console.log(`Parsed ${parsedWarnings.length} total warnings (source: ${lastSourceInfo})`);
    
    // Draw warnings on the map
    plotWarningsOnMap();
    
    // Update the UI list
    renderWarningList();
    
    // Ensure layers are active on the map if either checkbox is checked
    const toggleAvurnav = document.getElementById('layer-avurnav');
    const toggleAvinav = document.getElementById('layer-avinav');
    const shouldAddLayer = (toggleAvurnav && toggleAvurnav.checked) || (toggleAvinav && toggleAvinav.checked);
    if (shouldAddLayer && state.pingWarningsLayer && state.map) {
      state.pingWarningsLayer.addTo(state.map);
    }
    
  } catch (err) {
    console.error("Failed to load/parse NAVAREA & AVURNAV warnings XML:", err);
    renderWarningListMessage("❌ Erreur de chargement des alertes.");
  }
}

// Helper to draw a single text string message in the warning list container
function renderWarningListMessage(msg) {
  const container = document.getElementById('avurnav-list-container');
  if (container) {
    container.innerHTML = `
      <div style="font-size: 0.75rem; color: var(--text-muted); text-align: center; padding: 0.5rem 0;">
        ${msg}
      </div>
    `;
  }
}

// Create a custom Leaflet divIcon containing only the raw emoji icon
function createWarningIcon(emoji, isAvinav) {
  const html = `
    <div class="warning-map-marker" style="
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      font-size: 1.7rem;
      cursor: pointer;
      transition: transform 0.2s ease;
      filter: drop-shadow(0 2px 4px rgba(0,0,0,0.4));
    ">
      ${emoji}
    </div>
  `;
  
  return L.divIcon({
    html: html,
    className: 'custom-warning-div-icon',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16]
  });
}

// Map warning types to emojis based on hazard type and text content
function getWarningEmoji(hazardType, textInfo = '') {
  const infoLower = textInfo.toLowerCase();
  const hazardLower = (hazardType || '').toLowerCase();
  
  // Wreck / Epave
  if (hazardLower.includes('wreck') || infoLower.includes('épave') || infoLower.includes('wreck')) {
    return '⚓';
  }
  // Firing / Tirs / Exercices
  if (hazardLower.includes('firing') || infoLower.includes('tir') || infoLower.includes('firing') || infoLower.includes('exercise') || infoLower.includes('exercice')) {
    return '💣';
  }
  // Cable / Pipeline
  if (hazardLower.includes('cable') || infoLower.includes('câble') || infoLower.includes('cable') || infoLower.includes('pipeline')) {
    return '🔌';
  }
  // Drilling rig / Platform / Forage
  if (hazardLower.includes('rig') || hazardLower.includes('platform') || infoLower.includes('forage') || infoLower.includes('plateforme') || infoLower.includes('modu')) {
    return '🏗️';
  }
  // Drifting boat / Drifting object / Vessel / Derelict / Tow
  if (infoLower.includes('derive') || infoLower.includes('dérive') || infoLower.includes('drifting') || infoLower.includes('derelict') || infoLower.includes('vessel') || infoLower.includes('tow') || infoLower.includes('remorquage')) {
    return '🚨'; // Flashing siren for drifting/towing danger
  }
  // Shoal / Reef / Obstruction / Depth / Haut fond
  if (infoLower.includes('shoal') || infoLower.includes('reef') || infoLower.includes('haut fond') || infoLower.includes('obstruction') || infoLower.includes('danger') || infoLower.includes('obstruction')) {
    return '🪨';
  }
  // Light / Buoy / Beacon unlit or damaged
  if (hazardLower.includes('light') || infoLower.includes('feu') || infoLower.includes('phare') || infoLower.includes('buoy') || infoLower.includes('bouée') || infoLower.includes('beacon') || infoLower.includes('balise') || infoLower.includes('unlit') || infoLower.includes('éteint')) {
    return '🏮';
  }
  // Scientific survey / research
  if (hazardLower.includes('survey') || infoLower.includes('recherche') || infoLower.includes('scientifique') || infoLower.includes('scientific')) {
    return '🔬';
  }
  // Mooring / Anchor / Bouée de mouillage
  if (infoLower.includes('mooring') || infoLower.includes('corps-mort') || infoLower.includes('mouillage')) {
    return '⚓';
  }
  
  if (hazardLower.includes('bulletin')) return '📋';
  
  return '⚠️';
}

// Plot warnings on the Leaflet map
function plotWarningsOnMap() {
  if (!state.map || !state.pingWarningsLayer) return;
  
  state.pingWarningsLayer.clearLayers();
  
  const showAll = document.getElementById('layer-all-warnings')?.checked ?? true;
  const showAvurnav = document.getElementById('layer-avurnav')?.checked ?? true;
  const showAvurnavLocal = document.getElementById('layer-avurnav-local')?.checked ?? true;
  const showAvinav = document.getElementById('layer-avinav')?.checked ?? true;
  
  parsedWarnings.forEach(warn => {
    if (!warn.geometry) return;
    
    // Check filter status
    let isFilteredOut = !showAll;
    if (!isFilteredOut) {
      if (warn.type === 'avinav' && !showAvinav) isFilteredOut = true;
      if (warn.type === 'avurnav_local' && !showAvurnavLocal) isFilteredOut = true;
      if ((warn.type === 'avurnav' || warn.type === 'navarea') && !showAvurnav) isFilteredOut = true;
    }
    
    const p = warn.preamble || {};
    const emoji = getWarningEmoji(warn.hazardTypeDetails || p.hazardTypeGeneral, warn.information);
    const seriesTitle = p.nameOfSeries || 'NAVAREA';
    const warningNum = `${p.warningNumber || ''}/${p.year || ''}`;
    
    let formattedDate = '';
    if (p.publicationDate) {
      const pubDate = new Date(p.publicationDate);
      const day = String(pubDate.getUTCDate()).padStart(2, '0');
      const hour = String(pubDate.getUTCHours()).padStart(2, '0');
      const min = String(pubDate.getUTCMinutes()).padStart(2, '0');
      const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
      const month = months[pubDate.getUTCMonth()];
      const year = pubDate.getUTCFullYear();
      formattedDate = `${day}${hour}${min}z UTC ${month} ${year}`;
    }
    
    const isAvinav = warn.type === 'avinav';
    const color = isAvinav ? '#f59e0b' : '#ef4444'; // Yellow-Orange for AVINAV, Red for all AVURNAV and NAVAREA types
    const headerColor = isAvinav ? '#d97706' : '#ef4444';
    
    const popupContent = `
      <div style="font-family: var(--font-family, sans-serif); line-height: 1.45; color: var(--text-color); font-size: 0.8rem; width: 100%;">
        <div style="font-size: 1.3rem; font-weight: 500; font-family: 'Outfit', sans-serif; color: var(--text-color); margin-bottom: 0.4rem; display: flex; align-items: center; gap: 0.5rem;">
          <span>${emoji}</span>
          <span style="letter-spacing: -0.01em;">${seriesTitle}</span>
        </div>
        <hr style="margin: 6px 0; border: none; border-top: 1px solid var(--border-color); opacity: 0.4;">
        <div style="font-family: var(--mono-font), monospace; font-size: 0.78rem; font-weight: 700; color: ${headerColor}; display: flex; flex-direction: column; gap: 0.15rem; margin-bottom: 0.4rem;">
          <div>${warningNum}</div>
          <div style="color: var(--text-muted); font-size: 0.72rem; font-weight: 500;">${formattedDate}</div>
        </div>
        <hr style="margin: 6px 0; border: none; border-top: 1px solid var(--border-color); opacity: 0.4;">
        <div style="font-family: var(--mono-font), monospace; font-size: 0.75rem; white-space: pre-wrap; word-break: break-word; color: var(--text-color); line-height: 1.4; max-height: 220px; overflow-y: auto; margin: 6px 0; padding-right: 4px;">${warn.information}</div>
        <hr style="margin: 6px 0; border: none; border-top: 1px solid var(--border-color); opacity: 0.4;">
        <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.7rem; color: var(--text-muted);">
          <span>📍 ${p.generalArea || ''}</span>
          <span style="text-transform: uppercase; font-weight: 700; letter-spacing: 0.05em; color: ${headerColor}; font-size: 0.65rem;">${warn.hazardTypeDetails || p.hazardTypeGeneral || 'Alerte'}</span>
        </div>
      </div>
    `;
    
    let mapLayer = null;
    
    if (warn.geometry.type === 'Point') {
      const icon = createWarningIcon(emoji, isAvinav);
      mapLayer = L.marker(warn.geometry.coordinates, { icon: icon });
    } else if (warn.geometry.type === 'Polygon') {
      mapLayer = L.polygon(warn.geometry.coordinates, {
        color: color,
        weight: 2,
        fillColor: color,
        fillOpacity: 0.2
      });
    } else if (warn.geometry.type === 'LineString') {
      mapLayer = L.polyline(warn.geometry.coordinates, {
        color: color,
        weight: 3,
        opacity: 0.8
      });
    } else if (warn.geometry.type === 'MultiPoint') {
      const group = L.featureGroup();
      const icon = createWarningIcon(emoji, isAvinav);
      warn.geometry.coordinates.forEach(c => {
        L.marker(c, { icon: icon }).addTo(group);
      });
      mapLayer = group;
    }
    
    if (mapLayer) {
      mapLayer.bindPopup(popupContent, { maxWidth: 440, minWidth: 320 });
      
      // Only add to the layer if it's currently marked as visible and not filtered out
      if (warn.visible && !isFilteredOut) {
        state.pingWarningsLayer.addLayer(mapLayer);
      }
      
      warn.mapLayer = mapLayer;
    }
  });
}

// Render list of warnings in HTML sidebar
function renderWarningList() {
  const container = document.getElementById('avurnav-list-container');
  if (!container) return;
  
  if (parsedWarnings.length === 0) {
    container.innerHTML = `
      <div style="font-size: 0.75rem; color: var(--text-muted); text-align: center; padding: 0.5rem 0;">
        Aucune alerte en vigueur sur les côtes françaises.
      </div>
    `;
    return;
  }
  
  let badgeColor = '#22c55e';
  let badgeText = 'Direct';
  if (lastSourceInfo === 'local') {
    badgeColor = '#eab308';
    badgeText = 'Offline';
  } else if (lastSourceInfo.includes('offline')) {
    badgeColor = '#3b82f6';
    badgeText = 'Mixte';
  }
  
  let sourceBadge = `<span style="font-size: 0.6rem; padding: 1px 4px; background: ${badgeColor}22; border: 1px solid ${badgeColor}; color: ${badgeColor}; border-radius: 3px; float: right;">${badgeText}</span>`;
  
  container.innerHTML = `
    <div style="font-size: 0.65rem; color: var(--text-muted); margin-bottom: 0.4rem;">
      ${parsedWarnings.length} alertes actives ${sourceBadge}
    </div>
  ` + parsedWarnings.map((warn, index) => {
    const p = warn.preamble || {};
    const emoji = getWarningEmoji(warn.hazardTypeDetails || p.hazardTypeGeneral, warn.information);
    const title = `${p.nameOfSeries || 'Alerte'} - n° ${p.warningNumber || ''}/${p.year || ''}`;
    const area = p.generalArea || 'Zone indéterminée';
    const typeLabel = warn.hazardTypeDetails || p.hazardTypeGeneral || 'Alerte';
    const isHidden = !warn.visible;
    
    return `
      <div class="card avurnav-item" 
           style="margin-bottom: 0.4rem; padding: 0.5rem; border-left: 3px solid #ef4444; cursor: pointer; border-radius: var(--border-radius, 4px); transition: opacity 0.2s ease; ${isHidden ? 'opacity: 0.45; background: rgba(255,255,255,0.01);' : ''}"
           onclick="zoomToWarning(${index})">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.25rem;">
          <span style="font-size: 0.72rem; font-weight: 700; color: #ef4444; text-decoration: ${isHidden ? 'line-through' : 'none'};">${emoji} ${title}</span>
          <div style="display: flex; align-items: center; gap: 0.35rem; flex-shrink: 0;">
            <span style="font-size: 0.58rem; color: var(--text-muted); text-transform: uppercase;">${typeLabel}</span>
            <button class="toggle-single-warning-btn" 
                    style="background: none; border: none; padding: 0 2px; cursor: pointer; color: ${isHidden ? 'var(--text-muted)' : 'var(--accent-color)'}; font-size: 0.8rem; filter: grayscale(${isHidden ? 1 : 0});" 
                    title="${isHidden ? 'Afficher sur la carte' : 'Masquer sur la carte'}"
                    onclick="toggleSingleWarningVisibility(event, ${index})">
              ${isHidden ? '👁️‍🗨️' : '👁️'}
            </button>
          </div>
        </div>
        <div style="font-size: 0.7rem; font-weight: 600; margin-bottom: 0.2rem; color: var(--text-color);">📍 ${area}</div>
        <p style="font-size: 0.65rem; color: var(--text-muted); margin: 0; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; line-height: 1.3;">
          ${warn.information}
        </p>
      </div>
    `;
  }).join('');
}

// Toggle visibility of a single warning on the map
export function toggleSingleWarningVisibility(event, index) {
  event.stopPropagation(); // Stop click from propagating to zoomToWarning
  const warn = parsedWarnings[index];
  if (!warn || !state.pingWarningsLayer) return;
  
  warn.visible = !warn.visible;
  
  if (warn.mapLayer) {
    if (warn.visible) {
      state.pingWarningsLayer.addLayer(warn.mapLayer);
    } else {
      state.pingWarningsLayer.removeLayer(warn.mapLayer);
    }
  }
  
  // Redraw the list in the sidebar drawer to reflect opacity/icon updates
  renderWarningList();
}

// Zoom and open popup for a selected warning
export function zoomToWarning(index) {
  const warn = parsedWarnings[index];
  if (!warn || !state.map) return;
  
  // If the warning is currently hidden, automatically make it visible when the user selects it
  if (!warn.visible) {
    warn.visible = true;
    if (warn.mapLayer && state.pingWarningsLayer) {
      state.pingWarningsLayer.addLayer(warn.mapLayer);
    }
    renderWarningList();
  }
  
  if (warn.geometry) {
    if (warn.geometry.type === 'Point') {
      state.map.setView(warn.geometry.coordinates, 10);
    } else if (warn.geometry.type === 'Polygon' || warn.geometry.type === 'LineString' || warn.geometry.type === 'MultiPoint') {
      const bounds = L.latLngBounds(warn.geometry.coordinates);
      state.map.fitBounds(bounds, { padding: [40, 40] });
    }
    
    state.autoCenter = false;
    updateRecenterButtonUI();
    
    // Open Leaflet popup
    if (warn.mapLayer) {
      // Ensure the correct checkbox and master checkbox are checked so the layer is visible
      let checkboxId = 'layer-avurnav';
      if (warn.type === 'avinav') {
        checkboxId = 'layer-avinav';
      } else if (warn.type === 'avurnav_local') {
        checkboxId = 'layer-avurnav-local';
      }
      const toggleCheckbox = document.getElementById(checkboxId);
      const toggleAll = document.getElementById('layer-all-warnings');
      
      let needsUpdate = false;
      if (toggleCheckbox && !toggleCheckbox.checked) {
        toggleCheckbox.checked = true;
        needsUpdate = true;
      }
      if (toggleAll && !toggleAll.checked) {
        toggleAll.checked = true;
        needsUpdate = true;
      }
      
      if (needsUpdate) {
        state.pingWarningsLayer.addTo(state.map);
        updatePingLayersVisibility();
      }
      
      setTimeout(() => {
        warn.mapLayer.openPopup();
      }, 300);
    }
  } else {
    // Bulletin warning with no geography - display content directly
    alert(`Alerte Sans Géographie:\n\n${warn.preamble.nameOfSeries} n° ${warn.preamble.warningNumber}/${warn.preamble.year}\nZone: ${warn.preamble.generalArea}\n\n${warn.information}`);
  }
}

// Parse coords from text of a navigation warning (supporting various formats)
export function parseCoordsFromText(text) {
  if (!text) return [];
  const coords = [];
  
  // Pattern 1: DD-MM.MMN DDD-MM.MME (or with O/W for west)
  // e.g. 71-33.88N 072-09.40E, 69-46.60N 134-24.40W
  const regex1 = /\b(\d{1,2})-(\d{1,2}(?:\.\d+)?)\s*([NSns])\s+(\d{1,3})-(\d{1,2}(?:\.\d+)?)\s*([EOWewoO])\b/g;
  let match;
  while ((match = regex1.exec(text)) !== null) {
    const latDeg = parseInt(match[1], 10);
    const latMin = parseFloat(match[2]);
    const latDir = match[3].toUpperCase();
    
    const lngDeg = parseInt(match[4], 10);
    const lngMin = parseFloat(match[5]);
    const lngDir = match[6].toUpperCase();
    
    let lat = latDeg + latMin / 60.0;
    if (latDir === 'S') lat = -lat;
    
    let lng = lngDeg + lngMin / 60.0;
    if (lngDir === 'W' || lngDir === 'O') lng = -lng;
    
    coords.push([lat, lng]);
  }
  
  // Pattern 2: DD MM.MM N DDD MM.MM E
  const regex2 = /\b(\d{1,2})\s+(\d{1,2}(?:\.\d+)?)\s*([NSns])\s+(\d{1,3})\s+(\d{1,2}(?:\.\d+)?)\s*([EOWewoO])\b/g;
  while ((match = regex2.exec(text)) !== null) {
    const latDeg = parseInt(match[1], 10);
    const latMin = parseFloat(match[2]);
    const latDir = match[3].toUpperCase();
    
    const lngDeg = parseInt(match[4], 10);
    const lngMin = parseFloat(match[5]);
    const lngDir = match[6].toUpperCase();
    
    let lat = latDeg + latMin / 60.0;
    if (latDir === 'S') lat = -lat;
    
    let lng = lngDeg + lngMin / 60.0;
    if (lngDir === 'W' || lngDir === 'O') lng = -lng;
    
    coords.push([lat, lng]);
  }
  
  // Pattern 3: Simple decimal degrees: "43.123N, 5.456E" or "43.123 N 5.456 E"
  const regex3 = /\b(\d{1,2}(?:\.\d+)?)\s*([NSns])\b[\s,]*\b(\d{1,3}(?:\.\d+)?)\s*([EOWewoO])\b/g;
  while ((match = regex3.exec(text)) !== null) {
    let lat = parseFloat(match[1]);
    const latDir = match[2].toUpperCase();
    let lng = parseFloat(match[3]);
    const lngDir = match[4].toUpperCase();
    
    if (latDir === 'S') lat = -lat;
    if (lngDir === 'W' || lngDir === 'O') lng = -lng;
    
    coords.push([lat, lng]);
  }

  return coords;
}

// Determine the geometry type based on warning text clues
function determineGeometry(parsedCoords, text) {
  if (!parsedCoords || parsedCoords.length === 0) return null;
  if (parsedCoords.length === 1) {
    return { type: 'Point', coordinates: parsedCoords[0] };
  }
  
  // Strip 'navarea' substring to avoid matching 'area' within the word 'navarea'
  const textCleaned = (text || '').toLowerCase().replace(/navarea/g, '');
  
  const isLine = textCleaned.includes('line') || 
                 textCleaned.includes('cable') || 
                 textCleaned.includes('pipeline') || 
                 textCleaned.includes('track') || 
                 textCleaned.includes('tow') || 
                 textCleaned.includes('towing') || 
                 textCleaned.includes('transit');
                 
  const isArea = textCleaned.includes('area') || 
                 textCleaned.includes('bound') || 
                 textCleaned.includes('within') || 
                 textCleaned.includes('enclosed') || 
                 textCleaned.includes('polygon') || 
                 textCleaned.includes('firing') || 
                 textCleaned.includes('exercice') || 
                 textCleaned.includes('exercise') || 
                 textCleaned.includes('danger');
                 
  if (parsedCoords.length === 2) {
    return { type: isLine ? 'LineString' : 'MultiPoint', coordinates: parsedCoords };
  }
  
  if (isArea) {
    return { type: 'Polygon', coordinates: parsedCoords };
  } else if (isLine) {
    return { type: 'LineString', coordinates: parsedCoords };
  } else {
    return { type: 'MultiPoint', coordinates: parsedCoords };
  }
}

// Convert NGA warning object into unified S-124 Warning structure
function parseNgaWarning(ngaObj) {
  const text = ngaObj.text || '';
  const parsedCoords = parseCoordsFromText(text);
  const geometry = determineGeometry(parsedCoords, text);
  
  const issueDateStr = ngaObj.issueDate || '';
  let pubDate = new Date();
  const dateMatch = issueDateStr.match(/(\d{6})Z\s+([A-Z]{3})\s+(\d{4})/i);
  if (dateMatch) {
    const months = { JAN: 0, FEB: 1, MAR: 2, APR: 3, MAY: 4, JUN: 5, JUL: 6, AUG: 7, SEP: 8, OCT: 9, NOV: 10, DEC: 11 };
    const day = parseInt(dateMatch[1].substring(0, 2), 10);
    const month = months[dateMatch[2].toUpperCase()] || 0;
    const year = parseInt(dateMatch[3], 10);
    const hour = parseInt(dateMatch[1].substring(2, 4), 10);
    const min = parseInt(dateMatch[1].substring(4, 6), 10);
    pubDate = new Date(Date.UTC(year, month, day, hour, min));
  }

  let hazardType = 'Alerte';
  if (text.toLowerCase().includes('wreck') || text.toLowerCase().includes('épave')) hazardType = 'Wreck';
  else if (text.toLowerCase().includes('firing') || text.toLowerCase().includes('tir')) hazardType = 'Firing';
  else if (text.toLowerCase().includes('cable') || text.toLowerCase().includes('câble')) hazardType = 'Cable';
  else if (text.toLowerCase().includes('scientific') || text.toLowerCase().includes('survey')) hazardType = 'Scientific';
  else if (text.toLowerCase().includes('light') || text.toLowerCase().includes('phare')) hazardType = 'Light';

  return {
    gmlId: `nga-${ngaObj.msgYear || ngaObj.year || '2026'}-${ngaObj.msgNumber || ngaObj.number || '0'}`,
    type: 'navarea',
    preamble: {
      nameOfSeries: `NAVAREA ${ngaObj.navArea || ngaObj.area || ''}`,
      warningNumber: ngaObj.msgNumber || ngaObj.number || '',
      year: ngaObj.msgYear || ngaObj.year || '',
      publicationDate: pubDate.toISOString(),
      generalArea: text.split('\n')[0] || `NAVAREA ${ngaObj.navArea || ngaObj.area || ''}`,
      hazardTypeGeneral: hazardType
    },
    hazardTypeDetails: hazardType,
    information: text,
    geometry: geometry,
    visible: true,
    mapLayer: null
  };
}

// Fetch and load global NAVAREA warnings from NGA API (with local fallback)
async function loadNgaWarnings() {
  let warningsJson = null;
  let source = "live";
  
  try {
    const response = await fetch("https://msi.nga.mil/api/publications/broadcast-warn?status=active&output=json");
    if (!response.ok) throw new Error("CORS or Server Error");
    const data = await response.json();
    warningsJson = data["broadcast-warn"] || [];
  } catch (err) {
    console.warn("Could not fetch live NGA warnings. Falling back to local copy.", err);
    try {
      const response = await fetch("./data/nga_warnings.json");
      if (!response.ok) throw new Error("Local fallback file not found");
      warningsJson = await response.json();
      source = "local";
    } catch (localErr) {
      console.error("Failed to load local NGA fallback:", localErr);
    }
  }
  
  if (warningsJson) {
    let parsedCount = 0;
    warningsJson.forEach(w => {
      const parsed = parseNgaWarning(w);
      if (parsed) {
        parsedWarnings.push(parsed);
        parsedCount++;
      }
    });
    console.log(`Loaded ${parsedCount} NAVAREA warnings from NGA (${source}).`);
    if (source === "live") {
      lastSourceInfo = "live";
    }
  }
}

// Expose callbacks globally
window.zoomToWarning = zoomToWarning;
window.toggleSingleWarningVisibility = toggleSingleWarningVisibility;
