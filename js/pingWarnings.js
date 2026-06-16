// Sirroco Marine Navigation - PING NAVAREA II & AVURNAV Warnings Integration
// Parses and displays S-124 XML navigation warnings from SHOM PING portal

import { state } from './state.js';
import { updateRecenterButtonUI } from './app.js';

const SERIES = [
  // NAVAREA
  { name: 'NAVAREA II', id: 'NAVAREA II', fallbackUrl: './data/navarea2.xml', enabled: true, type: 'navarea' },

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
    
    results.forEach(result => {
      if (!result) return;
      
      if (result.source === 'live') liveCount++;
      else localCount++;
      
      const xmlDoc = parser.parseFromString(result.xmlText, "application/xml");
      
      // Check for parse error
      const parseError = xmlDoc.getElementsByTagName("parsererror");
      if (parseError.length > 0) {
        console.error(`XML Parse error in series ${result.series.name}:`, parseError[0].textContent);
        return;
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
    });
    
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

// Map warning types to emojis
function getWarningEmoji(hazardType, textInfo = '') {
  const infoLower = textInfo.toLowerCase();
  const hazardLower = (hazardType || '').toLowerCase();
  
  if (hazardLower.includes('wreck') || infoLower.includes('épave') || infoLower.includes('wreck')) return '💥';
  if (hazardLower.includes('firing') || infoLower.includes('tir') || infoLower.includes('firing')) return '💣';
  if (hazardLower.includes('cable') || infoLower.includes('câble') || infoLower.includes('cable')) return '🔌';
  if (hazardLower.includes('rig') || hazardLower.includes('platform') || infoLower.includes('forage') || infoLower.includes('plateforme')) return '🏗️';
  if (hazardLower.includes('survey') || infoLower.includes('recherche') || infoLower.includes('scientifique')) return '🔬';
  if (hazardLower.includes('light') || infoLower.includes('feu éteint') || infoLower.includes('phare')) return '🏮';
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
    const title = `${p.nameOfSeries || 'NAVAREA II'} - n° ${p.warningNumber || ''}/${p.year || ''}`;
    const dateStr = p.publicationDate ? new Date(p.publicationDate).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '';
    
    const isAvinav = warn.type === 'avinav';
    
    const color = isAvinav ? '#f59e0b' : '#ef4444'; // Yellow-Orange for AVINAV, Red for all AVURNAV and NAVAREA types
    const headerColor = isAvinav ? '#d97706' : '#ef4444';
    
    const popupContent = `
      <div style="font-family: var(--font-family, sans-serif); line-height: 1.4; color: var(--text-color); max-width: 240px; font-size: 0.75rem;">
        <strong style="color: ${headerColor}; font-size: 0.85rem;">${emoji} ${title}</strong><br>
        <span style="font-size: 0.7rem; color: var(--text-muted); font-weight: 600;">📅 Publié le : ${dateStr}</span>
        <hr style="margin: 4px 0; border-color: var(--border-color);">
        <div style="font-weight: 700; margin-bottom: 2px;">📍 ${p.generalArea || ''}</div>
        <div style="font-style: italic; color: var(--text-muted); font-size: 0.7rem; margin-bottom: 4px;">Type: ${warn.hazardTypeDetails || p.hazardTypeGeneral || 'Alerte'}</div>
        <p style="white-space: pre-wrap; background: rgba(0,0,0,0.03); border: 1px solid var(--border-color); padding: 4px; border-radius: 3px; font-family: monospace; font-size: 0.65rem; max-height: 100px; overflow-y: auto; margin: 4px 0;">${warn.information}</p>
      </div>
    `;
    
    let mapLayer = null;
    
    if (warn.geometry.type === 'Point') {
      mapLayer = L.circleMarker(warn.geometry.coordinates, {
        radius: 7,
        fillColor: color,
        color: '#ffffff',
        weight: 1.5,
        fillOpacity: 0.85
      });
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
    }
    
    if (mapLayer) {
      mapLayer.bindPopup(popupContent, { maxWidth: 250 });
      
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
    } else if (warn.geometry.type === 'Polygon' || warn.geometry.type === 'LineString') {
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

// Expose callbacks globally
window.zoomToWarning = zoomToWarning;
window.toggleSingleWarningVisibility = toggleSingleWarningVisibility;
