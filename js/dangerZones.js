// Sirroco Marine Navigation - Danger Zones Data and Proximity Monitoring

import { state } from './state.js';
import { calculateHaversineDistance, hexToRgb } from './utils.js';
import { updateRecenterButtonUI } from './app.js';

export const dangerZoneGeoJSON = {
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {
        "name": "Zone de tir de Toulon (G1)",
        "name_en": "Toulon Military Firing Zone (G1)",
        "type": "military_firing",
        "status": "permanent",
        "authority": "Marine Nationale",
        "description": "Zone d'exercice de tir de la Marine Nationale. Accès interdit en période de tirs. Consulter les AVURNAV locaux."
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [5.7000, 43.0200], [6.2000, 43.0200],
          [6.2000, 42.7500], [5.7000, 42.7500],
          [5.7000, 43.0200]
        ]]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "name": "Zone de tir de l'île du Levant (F)",
        "name_en": "Île du Levant Military Zone (F)",
        "type": "military_restricted",
        "status": "permanent",
        "authority": "DGA / Marine Nationale",
        "description": "Zone réservée aux essais de missiles et torpilles. Navigation interdite sans autorisation préalable."
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [6.3500, 43.0800], [6.6500, 43.0800],
          [6.6500, 42.8500], [6.3500, 42.8500],
          [6.3500, 43.0800]
        ]]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "name": "Zone OTAN - Secteur Méditerranée NW",
        "name_en": "NATO Exercise Area - NW Mediterranean",
        "type": "nato_exercise",
        "status": "periodic",
        "authority": "OTAN / NATO",
        "description": "Zone d'exercices OTAN en Méditerranée nord-occidentale. Activée périodiquement. Vérifier les avis locaux."
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [4.0000, 42.5000], [6.5000, 42.5000],
          [6.5000, 41.0000], [4.0000, 41.0000],
          [4.0000, 42.5000]
        ]]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "name": "Zone de tir de Brest (Penmarc'h)",
        "name_en": "Brest Naval Firing Zone (Penmarc'h)",
        "type": "military_firing",
        "status": "permanent",
        "authority": "Marine Nationale - Brest",
        "description": "Zone de tir de la Marine Nationale au large du Finistère. Consulter l'AVURNAV de Brest avant navigation."
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [-5.2000, 47.8000], [-4.0000, 47.8000],
          [-4.0000, 47.2000], [-5.2000, 47.2000],
          [-5.2000, 47.8000]
        ]]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "name": "Zone de tir de Lorient (G.D.)",
        "name_en": "Lorient Naval Exercise Zone",
        "type": "military_firing",
        "status": "periodic",
        "authority": "Marine Nationale - Lorient",
        "description": "Zone de tir et d'exercice naval au large de Lorient. Activée lors des exercices de la flotte de sous-marins."
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [-4.5000, 47.6500], [-3.2000, 47.6500],
          [-3.2000, 47.0000], [-4.5000, 47.0000],
          [-4.5000, 47.6500]
        ]]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "name": "Couloir de Sécurité - Rade de Brest",
        "name_en": "Safety Corridor - Brest Harbour",
        "type": "restricted_navigation",
        "status": "permanent",
        "authority": "Préfecture Maritime Atlantique",
        "description": "Zone de trafic séparé à l'entrée de la rade de Brest. Respecter les règles de circulation maritime."
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [-4.6500, 48.3800], [-4.4000, 48.3800],
          [-4.4000, 48.2500], [-4.6500, 48.2500],
          [-4.6500, 48.3800]
        ]]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "name": "Zone de mouillage interdit - Golfe du Lion",
        "name_en": "No-Anchor Zone - Gulf of Lion (Pipelines)",
        "type": "anchoring_prohibited",
        "status": "permanent",
        "authority": "Préfecture Maritime Méditerranée",
        "description": "Zone de mouillage interdit en raison de pipelines et câbles sous-marins. Fond dangereux pour l'ancre."
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [3.5000, 43.3000], [4.8000, 43.3000],
          [4.8000, 43.0000], [3.5000, 43.0000],
          [3.5000, 43.3000]
        ]]
      }
    }
  ]
};

export function renderZoneList() {
  const container = document.getElementById('zone-list-container');
  if (!container) return;

  const typeConfig = {
    'military_firing':       { icon: '💣', color: '#ef4444', label: 'Tir militaire' },
    'military_restricted':   { icon: '⛔', color: '#f97316', label: 'Zone restreinte' },
    'nato_exercise':         { icon: '🔵', color: '#a855f7', label: 'Exercice OTAN' },
    'anchoring_prohibited':  { icon: '⚓', color: '#eab308', label: 'Mouillage interdit' },
    'restricted_navigation': { icon: '🚫', color: '#3b82f6', label: 'Navigation restreinte' },
  };

  const features = dangerZoneGeoJSON.features || [];
  container.innerHTML = features.map((f) => {
    const p = f.properties;
    const cfg = typeConfig[p.type] || { icon: '⚠️', color: '#ef4444', label: p.type };
    const statusLabel = p.status === 'permanent' ? '🔴 Permanent' : '🟡 Périodique';
    const statusBg = p.status === 'permanent' ? `rgba(${hexToRgb(cfg.color)}, 0.15)` : 'rgba(234,179,8,0.1)';
    const statusBorder = p.status === 'permanent' ? cfg.color : '#eab308';
    const statusTextColor = p.status === 'permanent' ? cfg.color : '#ca8a04';

    // JSON.stringify for inline onclick argument requires escaping double quotes
    const coordsStr = JSON.stringify(f.geometry.coordinates[0]).replace(/"/g, '&quot;');

    return `
      <div class="card zone-item" style="margin-bottom: 0.5rem; border-left: 3px solid ${cfg.color}; cursor: pointer;"
           onclick="zoomToZone(${coordsStr})">
        <div class="zone-header">
          <span class="zone-title" style="color: ${cfg.color};">${cfg.icon} ${p.name}</span>
          <div class="status-badge" style="background: ${statusBg}; border-color: ${statusBorder}; color: ${statusTextColor}; font-size: 0.65rem; white-space: nowrap;">${statusLabel}</div>
        </div>
        <p class="zone-desc" style="margin: 0.2rem 0 0.1rem;">${p.description}</p>
        <small style="color: var(--text-muted); font-size: 0.7rem;">🏛️ ${p.authority}</small>
      </div>
    `;
  }).join('');
}

export function zoomToZone(coords) {
  if (!state.map || !coords || !coords.length) return;
  const latLngs = coords.map(c => [c[1], c[0]]);
  state.map.fitBounds(L.latLngBounds(latLngs), { padding: [20, 20] });
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

export function checkDangerZoneProximity(lat, lng) {
  let warningText = null;
  let minDistance = Infinity;

  dangerZoneGeoJSON.features.forEach(feature => {
    const coords = feature.geometry.coordinates[0];
    const name = feature.properties.name;
    
    // Check bounding box
    const lats = coords.map(c => c[1]);
    const lngs = coords.map(c => c[0]);
    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);
    
    let isInsideBBox = lat >= minLat && lat <= maxLat && lng >= minLng && lng <= maxLng;
    
    // Check distance to all vertices
    coords.forEach(coord => {
      const dist = calculateHaversineDistance(lat, lng, coord[1], coord[0]);
      if (dist < minDistance) {
        minDistance = dist;
      }
    });

    if (isInsideBBox) {
      minDistance = 0;
      warningText = `DANGER : Dans ${name}`;
    }
  });

  // 0.5 NM is 926 meters
  if (!warningText && minDistance < 926) {
    warningText = `ZONE DANGER PROCHE : ${((minDistance / 1852).toFixed(2))} NM`;
  }

  return { warningText, minDistance };
}

// Expose zoomToZone globally for inline onclick
window.zoomToZone = zoomToZone;
