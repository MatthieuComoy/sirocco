// Sirroco Marine Navigation - Anchor Alarm Systems

import { state } from './state.js';
import { calculateHaversineDistance } from './utils.js';
import { translations } from './i18n.js';

export function updateAnchorLocation(lat, lng) {
  state.anchorLatLng = L.latLng(lat, lng);
  
  if (state.anchorMarker) {
    state.anchorMarker.setLatLng(state.anchorLatLng);
  } else {
    const anchorIcon = L.divIcon({
      className: 'anchor-point-marker',
      html: `
        <svg style="width: 24px; height: 24px; filter: drop-shadow(0 2px 5px rgba(0,0,0,0.5));" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2">
          <circle cx="12" cy="5" r="3" fill="#ef4444"/>
          <line x1="12" y1="8" x2="12" y2="20" />
          <line x1="6" y1="12" x2="18" y2="12" />
          <path d="M6,12 C6,18 18,18 18,12" />
        </svg>
      `,
      iconSize: [24, 24],
      iconAnchor: [12, 12]
    });
    
    state.anchorMarker = L.marker(state.anchorLatLng, { draggable: true, icon: anchorIcon }).addTo(state.map);
    
    state.anchorMarker.on('drag', (e) => {
      const position = e.target.getLatLng();
      updateAnchorLocation(position.lat, position.lng);
    });
  }

  if (state.anchorCircle) {
    state.anchorCircle.setLatLng(state.anchorLatLng);
    state.anchorCircle.setRadius(state.alarmRadius * 1852);
  } else {
    state.anchorCircle = L.circle(state.anchorLatLng, {
      radius: state.alarmRadius * 1852,
      color: '#ef4444',
      fillColor: '#ef4444',
      fillOpacity: 0.15,
      weight: 1.5
    }).addTo(state.map);
  }

  const anchorLatEl = document.getElementById('anchor-lat');
  const anchorLonEl = document.getElementById('anchor-lon');
  if (anchorLatEl) anchorLatEl.textContent = lat.toFixed(5);
  if (anchorLonEl) anchorLonEl.textContent = lng.toFixed(5);
}

export function checkAnchorAlarm() {
  if (!state.isAnchorAlarmActive || !state.anchorLatLng) return;

  const distMeters = calculateHaversineDistance(state.currentLat, state.currentLon, state.anchorLatLng.lat, state.anchorLatLng.lng);
  const distNM = distMeters / 1852;
  
  const driftDistValEl = document.getElementById('drift-distance-val');
  if (driftDistValEl) driftDistValEl.textContent = `${distNM.toFixed(3)} NM`;

  if (distNM > state.alarmRadius) {
    triggerAlarm(distNM);
  } else {
    dismissAlarmUIOnly();
  }
}

// Sound Synthesizer (Web Audio API)
export function playAlarmSound() {
  if (!state.audioCtx) {
    state.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }

  if (state.alarmOscInterval) return;

  // Pulse siren sweeps
  state.alarmOscInterval = setInterval(() => {
    if (state.audioCtx.state === 'suspended') {
      state.audioCtx.resume();
    }

    const osc = state.audioCtx.createOscillator();
    const gain = state.audioCtx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(880, state.audioCtx.currentTime); // High pitch
    osc.frequency.linearRampToValueAtTime(440, state.audioCtx.currentTime + 0.45); // Pitch sweep down

    gain.gain.setValueAtTime(0.6, state.audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, state.audioCtx.currentTime + 0.49);

    osc.connect(gain);
    gain.connect(state.audioCtx.destination);

    osc.start();
    osc.stop(state.audioCtx.currentTime + 0.5);
  }, 600);
}

export function stopAlarmSound() {
  if (state.alarmOscInterval) {
    clearInterval(state.alarmOscInterval);
    state.alarmOscInterval = null;
  }
}

export function triggerAlarm(distance) {
  const alarmDistEl = document.getElementById('alarm-modal-distance');
  const alarmOverlayEl = document.getElementById('alarm-overlay');
  const anchorIndicatorEl = document.getElementById('anchor-status-indicator');
  
  if (alarmDistEl) alarmDistEl.textContent = `${distance.toFixed(3)} NM`;
  if (alarmOverlayEl) alarmOverlayEl.classList.add('active');
  if (anchorIndicatorEl) anchorIndicatorEl.className = "status-indicator warning";
  
  playAlarmSound();
}

export function dismissAlarm() {
  // Dismisses alarm but does NOT turn off anchor alarm mode (snoozes sound)
  stopAlarmSound();
  const alarmOverlayEl = document.getElementById('alarm-overlay');
  if (alarmOverlayEl) alarmOverlayEl.classList.remove('active');
}

export function deactivateAnchorAlarm() {
  state.isAnchorAlarmActive = false;
  
  const toggle = document.getElementById('anchor-alarm-toggle');
  if (toggle) toggle.checked = false;
  
  stopAlarmSound();
  
  const overlay = document.getElementById('alarm-overlay');
  if (overlay) overlay.classList.remove('active');
  
  if (state.anchorMarker) {
    state.map.removeLayer(state.anchorMarker);
    state.anchorMarker = null;
  }
  if (state.anchorCircle) {
    state.map.removeLayer(state.anchorCircle);
    state.anchorCircle = null;
  }

  const statusText = document.getElementById('anchor-status-text');
  if (statusText) statusText.textContent = translations[state.currentLang].inactive;
  
  const statusIndicator = document.getElementById('anchor-status-indicator');
  if (statusIndicator) statusIndicator.className = "status-indicator";
  
  const driftVal = document.getElementById('drift-distance-val');
  if (driftVal) driftVal.textContent = "--";
  
  const anchorLat = document.getElementById('anchor-lat');
  if (anchorLat) anchorLat.textContent = "--";
  
  const anchorLon = document.getElementById('anchor-lon');
  if (anchorLon) anchorLon.textContent = "--";

  const anchorBadge = document.getElementById('status-anchor-badge');
  if (anchorBadge) anchorBadge.style.display = 'none';

  const anchorToggleBtn = document.getElementById('anchor-toggle-btn');
  if (anchorToggleBtn) anchorToggleBtn.classList.remove('active');
}

export function dismissAlarmUIOnly() {
  const overlay = document.getElementById('alarm-overlay');
  if (overlay) overlay.classList.remove('active');
  
  stopAlarmSound();
  
  if (state.isAnchorAlarmActive) {
    const indicator = document.getElementById('anchor-status-indicator');
    if (indicator) indicator.className = "status-indicator active";
  }
}
