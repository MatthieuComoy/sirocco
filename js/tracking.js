// Sirroco Marine Navigation - Route Tracking, Statistics and GPX Export

import { state } from './state.js';
import { translations } from './i18n.js';
import { calculateHaversineDistance, getPointOfSail, formatDurationShort, escapeXml } from './utils.js';
import { updateRecenterButtonUI } from './app.js';

export function startRouteTracking() {
  if (state.isTracking) return;
  state.isTracking = true;
  const windDir = state.currentWindDirection !== null ? state.currentWindDirection : 290;
  const allure = getPointOfSail(state.currentHeading, windDir);
  state.currentTrack = [{
    lat: state.currentLat,
    lng: state.currentLon,
    time: Date.now(),
    speed: state.currentSpeed,
    heading: state.currentHeading,
    windDir: windDir,
    pointOfSail: allure
  }];
  state.trackLine.setLatLngs(state.currentTrack.map(p => [p.lat, p.lng]));
  
  const statusText = document.getElementById('track-status-text');
  const statusIndicator = document.getElementById('track-status-indicator');
  const startBtn = document.getElementById('start-track-btn');
  const stopBtn = document.getElementById('stop-track-btn');
  const trackBadge = document.getElementById('status-track-badge');
  const navRec = document.getElementById('nav-rec-indicator');

  if (statusText) statusText.textContent = translations[state.currentLang].active;
  if (statusIndicator) statusIndicator.className = "status-indicator active";
  if (startBtn) startBtn.style.display = 'none';
  if (stopBtn) stopBtn.style.display = 'inline-flex';
  if (trackBadge) trackBadge.style.display = 'flex';
  if (navRec) navRec.style.display = 'inline-flex';
}

export function stopRouteTracking() {
  if (!state.isTracking) return;
  state.isTracking = false;
  
  const statusText = document.getElementById('track-status-text');
  const statusIndicator = document.getElementById('track-status-indicator');
  const startBtn = document.getElementById('start-track-btn');
  const stopBtn = document.getElementById('stop-track-btn');
  const trackBadge = document.getElementById('status-track-badge');
  const navRec = document.getElementById('nav-rec-indicator');

  if (statusText) statusText.textContent = translations[state.currentLang].inactive;
  if (statusIndicator) statusIndicator.className = "status-indicator";
  if (startBtn) startBtn.style.display = 'inline-flex';
  if (stopBtn) stopBtn.style.display = 'none';
  if (trackBadge) trackBadge.style.display = 'none';
  if (navRec) navRec.style.display = 'none';

  if (state.currentTrack.length > 1) {
    const trackName = `Track ${new Date().toLocaleDateString('fr-FR')} ${new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`;
    
    // Calculate speed metrics
    const speeds = state.currentTrack.map(p => p.speed || 0);
    const maxSpeed = Math.max(...speeds, 0);
    const avgSpeed = speeds.length > 0 ? (speeds.reduce((a, b) => a + b, 0) / speeds.length) : 0;
    
    // Calculate max distance to shelter
    const maxShelterDist = calculateMaxDistanceToShelter(state.currentTrack);

    // Calculate time spent in each point of sail
    const recap = {
      'Bout au vent': 0,
      'Près': 0,
      'Bon plein': 0,
      'Travers': 0,
      'Largue': 0,
      'Grand largue': 0,
      'Vent arrière': 0
    };
    
    for (let i = 0; i < state.currentTrack.length - 1; i++) {
      const ptCurrent = state.currentTrack[i];
      const ptNext = state.currentTrack[i+1];
      const durationMs = ptNext.time - ptCurrent.time;
      if (durationMs > 0 && durationMs < 600000) { // Gaps < 10 mins
        const pos = ptCurrent.pointOfSail || 'Bout au vent';
        if (recap[pos] !== undefined) {
          recap[pos] += durationMs;
        }
      }
    }

    const trackGeoJSON = {
      name: trackName,
      date: new Date().toISOString(),
      coordinates: state.currentTrack,
      distance: calculateTrackDistance(state.currentTrack),
      avgSpeed: avgSpeed,
      maxSpeed: maxSpeed,
      maxShelterDist: maxShelterDist,
      pointsOfSailRecap: recap
    };
    state.savedTracks.push(trackGeoJSON);
    localStorage.setItem('sirroco_saved_tracks', JSON.stringify(state.savedTracks));
    renderSavedTracks();
  }
}

export function getCoordLatLng(coord) {
  if (!coord) return { lat: 0, lng: 0 };
  if (Array.isArray(coord)) {
    return { lat: coord[0], lng: coord[1] };
  }
  return { lat: coord.lat || 0, lng: coord.lng || 0 };
}

export function calculateTrackDistance(coords) {
  let totalDist = 0;
  for (let i = 0; i < coords.length - 1; i++) {
    const p1 = getCoordLatLng(coords[i]);
    const p2 = getCoordLatLng(coords[i+1]);
    totalDist += calculateHaversineDistance(p1.lat, p1.lng, p2.lat, p2.lng);
  }
  return totalDist; // returns meters
}

export function calculateMaxDistanceToShelter(coords) {
  if (!state.allHarborsCache || state.allHarborsCache.size === 0) return null;
  
  let maxMinDist = 0; // maximum of the minimum distances (meters)
  const harbors = Array.from(state.allHarborsCache.values());
  
  for (let i = 0; i < coords.length; i++) {
    const p = getCoordLatLng(coords[i]);
    let minDist = Infinity;
    
    for (let j = 0; j < harbors.length; j++) {
      const h = harbors[j];
      const dist = calculateHaversineDistance(p.lat, p.lng, h.lat, h.lng);
      if (dist < minDist) {
        minDist = dist;
      }
    }
    
    if (minDist !== Infinity && minDist > maxMinDist) {
      maxMinDist = minDist;
    }
  }
  
  return maxMinDist; // returns meters
}

export function exportTrackToGPX(index) {
  const track = state.savedTracks[index];
  if (!track) return;

  const name = track.name || `Track_${index}`;
  const dateStr = track.date || new Date().toISOString();
  
  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<gpx version="1.1" creator="Sirroco Marine" xmlns="http://www.topografix.com/GPX/1/1" xmlns:sirroco="https://sirroco.app/gpx/1/0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd">\n`;
  xml += `  <metadata>\n`;
  xml += `    <name>${escapeXml(name)}</name>\n`;
  xml += `    <time>${dateStr}</time>\n`;
  xml += `  </metadata>\n`;
  xml += `  <trk>\n`;
  xml += `    <name>${escapeXml(name)}</name>\n`;
  
  // Add global summary stats extensions
  xml += `    <extensions>\n`;
  if (track.distance !== undefined) {
    xml += `      <sirroco:distanceNM>${(track.distance / 1852).toFixed(2)}</sirroco:distanceNM>\n`;
  }
  if (track.avgSpeed !== undefined) {
    xml += `      <sirroco:avgSpeedKts>${track.avgSpeed.toFixed(2)}</sirroco:avgSpeedKts>\n`;
  }
  if (track.maxSpeed !== undefined) {
    xml += `      <sirroco:maxSpeedKts>${track.maxSpeed.toFixed(2)}</sirroco:maxSpeedKts>\n`;
  }
  if (track.maxShelterDist !== undefined && track.maxShelterDist !== null) {
    xml += `      <sirroco:maxShelterDistNM>${(track.maxShelterDist / 1852).toFixed(2)}</sirroco:maxShelterDistNM>\n`;
  }
  if (track.pointsOfSailRecap) {
    Object.entries(track.pointsOfSailRecap).forEach(([allure, ms]) => {
      if (ms > 0) {
        // Safe alphanumeric tag
        const tag = allure.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9]/g, "");
        xml += `      <sirroco:duration${tag}Ms>${ms}</sirroco:duration${tag}Ms>\n`;
      }
    });
  }
  xml += `    </extensions>\n`;
  
  xml += `    <trkseg>\n`;

  track.coordinates.forEach(pt => {
    const latLng = getCoordLatLng(pt);
    xml += `      <trkpt lat="${latLng.lat.toFixed(6)}" lon="${latLng.lng.toFixed(6)}">\n`;
    if (pt.time) {
      xml += `        <time>${new Date(pt.time).toISOString()}</time>\n`;
    }
    
    const hasExtensions = (pt.speed !== undefined || pt.heading !== undefined || pt.windDir !== undefined || pt.pointOfSail !== undefined);
    if (hasExtensions) {
      xml += `        <extensions>\n`;
      if (pt.speed !== undefined) {
        // standard speed is in m/s
        const speedMs = pt.speed * 0.514444;
        xml += `          <speed>${speedMs.toFixed(2)}</speed>\n`;
        xml += `          <sirroco:speedKts>${pt.speed.toFixed(1)}</sirroco:speedKts>\n`;
      }
      if (pt.heading !== undefined) {
        xml += `          <sirroco:heading>${Math.round(pt.heading)}</sirroco:heading>\n`;
      }
      if (pt.windDir !== undefined) {
        xml += `          <sirroco:windDir>${Math.round(pt.windDir)}</sirroco:windDir>\n`;
      }
      if (pt.pointOfSail !== undefined) {
        xml += `          <sirroco:pointOfSail>${escapeXml(pt.pointOfSail)}</sirroco:pointOfSail>\n`;
      }
      xml += `        </extensions>\n`;
    }
    xml += `      </trkpt>\n`;
  });

  xml += `    </trkseg>\n`;
  xml += `  </trk>\n`;
  xml += `</gpx>`;

  const blob = new Blob([xml], { type: 'application/gpx+xml' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.gpx`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function deleteTrack(index) {
  if (confirm(state.currentLang === 'fr' ? 'Supprimer cette trace ?' : 'Delete this track?')) {
    state.savedTracks.splice(index, 1);
    localStorage.setItem('sirroco_saved_tracks', JSON.stringify(state.savedTracks));
    renderSavedTracks();
  }
}

export function renderSavedTracks() {
  const container = document.getElementById('history-list');
  if (!container) return;
  container.innerHTML = '';

  if (state.savedTracks.length === 0) {
    container.innerHTML = `<p style="color: var(--text-muted); font-size: 0.85rem;" data-i18n="no_tracks">${translations[state.currentLang].no_tracks}</p>`;
    return;
  }

  // Language translation keys fallbacks
  const avgSpeedLabel = translations[state.currentLang].avg_speed || translations['en'].avg_speed;
  const maxSpeedLabel = translations[state.currentLang].max_speed || translations['en'].max_speed;
  const maxShelterLabel = translations[state.currentLang].max_shelter_dist || translations['en'].max_shelter_dist;

  state.savedTracks.forEach((track, index) => {
    const item = document.createElement('div');
    item.className = 'history-item';
    
    const distNM = (track.distance / 1852).toFixed(2);
    
    // Fallback for speed metrics if they don't exist (e.g. old format tracks)
    const avgSpeed = track.avgSpeed !== undefined ? track.avgSpeed.toFixed(1) : '--';
    const maxSpeed = track.maxSpeed !== undefined ? track.maxSpeed.toFixed(1) : '--';
    
    // Fallback for shelter distance
    let shelterDistStr = '--';
    if (track.maxShelterDist !== undefined && track.maxShelterDist !== null) {
      shelterDistStr = `${(track.maxShelterDist / 1852).toFixed(2)} NM`;
    }
    
    let alluresHtml = '';
    if (track.pointsOfSailRecap) {
      const recap = track.pointsOfSailRecap;
      const totalMs = Object.values(recap).reduce((sum, val) => sum + val, 0);
      
      if (totalMs > 0) {
        let rowsHtml = '';
        Object.entries(recap).forEach(([allure, ms]) => {
          if (ms > 0) {
            const pct = (ms / totalMs) * 100;
            const durationText = formatDurationShort(ms);
            
            let displayAllureName = allure;
            if (state.currentLang === 'en') {
              const engNames = {
                'Bout au vent': 'Head to Wind',
                'Près': 'Close-hauled',
                'Bon plein': 'Full and by',
                'Travers': 'Beam Reach',
                'Largue': 'Broad Reach',
                'Grand largue': 'Training Run',
                'Vent arrière': 'Running'
              };
              displayAllureName = engNames[allure] || allure;
            } else if (state.currentLang === 'es') {
              const espNames = {
                'Bout au vent': 'Proa al viento',
                'Près': 'Ceñida',
                'Bon plein': 'Buen viaje',
                'Travers': 'Través',
                'Largue': 'Largo',
                'Grand largue': 'Aleta',
                'Vent arrière': 'Empopada'
              };
              displayAllureName = espNames[allure] || allure;
            }
            
            rowsHtml += `
              <div class="allure-row">
                <div class="allure-label-row">
                  <span class="allure-name">⛵ ${displayAllureName}</span>
                  <span class="allure-value">${pct.toFixed(0)}% (${durationText})</span>
                </div>
                <div class="allure-progress-bar">
                  <div class="allure-progress-fill" style="width: ${pct}%"></div>
                </div>
              </div>
            `;
          }
        });
        
        if (rowsHtml) {
          const title = state.currentLang === 'fr' ? 'Allures (Récap)' : (state.currentLang === 'es' ? 'Rumbos de Vela' : 'Points of Sail');
          alluresHtml = `
            <div class="allures-recap-container">
              <div class="allures-recap-title">${title} :</div>
              ${rowsHtml}
            </div>
          `;
        }
      }
    }
    
    item.innerHTML = `
      <div class="history-info" style="width: 100%;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.35rem;">
          <span class="history-name">${track.name}</span>
          <div style="display: flex; gap: 0.35rem;">
            <button class="icon-btn compact-btn" onclick="showTrackOnMap(${index})" title="Zoom / Afficher">
              <svg viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
            </button>
            <button class="icon-btn compact-btn" onclick="exportTrackToGPX(${index})" title="Export GPX">
              <svg viewBox="0 0 24 24" style="fill: none; stroke: currentColor; stroke-width: 2.2; stroke-linecap: round; stroke-linejoin: round;"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
            </button>
            <button class="icon-btn compact-btn btn-danger-hover" onclick="deleteTrack(${index})" title="Supprimer">
              <svg viewBox="0 0 24 24"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
            </button>
          </div>
        </div>
        <div class="history-metrics-grid">
          <div>📏 Dist: <span class="metric-val">${distNM} NM</span></div>
          <div>⏱️ ${avgSpeedLabel}: <span class="metric-val">${avgSpeed} kts</span></div>
          <div>⚡ ${maxSpeedLabel}: <span class="metric-val">${maxSpeed} kts</span></div>
          <div>🛡️ ${maxShelterLabel}: <span class="metric-val">${shelterDistStr}</span></div>
        </div>
        ${alluresHtml}
      </div>
    `;
    container.appendChild(item);
  });
}

export function showTrackOnMap(index) {
  const track = state.savedTracks[index];
  if (!track) return;
  
  // Plot line mapping coordinates to ensure compat with object structures
  const latLngs = track.coordinates.map(p => {
    const c = getCoordLatLng(p);
    return [c.lat, c.lng];
  });
  const historyLine = L.polyline(latLngs, { color: '#ef4444', weight: 3, dashArray: '5, 5' }).addTo(state.map);
  state.map.fitBounds(historyLine.getBounds());
  state.autoCenter = false;
  updateRecenterButtonUI();
  
  // Visual removal after 10s or user zoom change
  setTimeout(() => {
    state.map.removeLayer(historyLine);
  }, 12000);
}

export function clearHistory() {
  state.savedTracks = [];
  localStorage.setItem('sirroco_saved_tracks', JSON.stringify(state.savedTracks));
  renderSavedTracks();
}

// Expose functions globally for dynamic inline HTML templates
window.exportTrackToGPX = exportTrackToGPX;
window.deleteTrack = deleteTrack;
window.showTrackOnMap = showTrackOnMap;
