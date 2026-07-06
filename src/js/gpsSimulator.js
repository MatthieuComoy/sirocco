// Sirroco Marine Navigation - GPS Simulator & Real Geolocation Watchers

import { state } from './state.js';
import { translations } from './i18n.js';
import { updatePosition } from './app.js';

export function toggleSimulator(active) {
  state.isSimulating = active;
  
  const statusText = document.getElementById('sim-status-text-modal');
  const controlsCard = document.getElementById('sim-controls-modal');
  const toggle = document.getElementById('simulator-toggle-modal');

  if (state.isSimulating) {
    if (statusText) statusText.textContent = translations[state.currentLang].sim_active;
    if (controlsCard) controlsCard.style.display = 'flex';
    if (toggle) toggle.checked = true;
    
    stopRealGPS();
    startSimLoop();
  } else {
    if (statusText) statusText.textContent = translations[state.currentLang].sim_inactive;
    if (controlsCard) controlsCard.style.display = 'none';
    if (toggle) toggle.checked = false;
    
    stopSimLoop();
    startRealGPS();
  }
}

export function startSimLoop() {
  if (state.simTimer) return;
  state.simTimer = setInterval(() => {
    const dt = 1;
    const speedMs = state.simSpeed * 0.514444;
    const distanceMeters = speedMs * dt;
    const bearingRad = (state.simHeading * Math.PI) / 180;
    
    const deltaLat = (distanceMeters * Math.cos(bearingRad)) / 111111;
    const deltaLon = (distanceMeters * Math.sin(bearingRad)) / (111111 * Math.cos(state.currentLat * Math.PI / 180));
    
    let nextLat = state.currentLat + deltaLat;
    let nextLon = state.currentLon + deltaLon;
    
    updatePosition(nextLat, nextLon, state.simSpeed, state.simHeading);
  }, 1000);
}

export function stopSimLoop() {
  if (state.simTimer) {
    clearInterval(state.simTimer);
    state.simTimer = null;
  }
}

let realWatchId = null;
let adaptiveGPSTimeout = null;

function pollGPS() {
  if (!realWatchId || !navigator.geolocation) return;
  
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const coords = position.coords;
      const speedKts = coords.speed ? (coords.speed * 1.94384) : 0;
      const headingDeg = coords.heading ? coords.heading : 0;
      updatePosition(coords.latitude, coords.longitude, speedKts, headingDeg);
      
      // Calculate next interval adaptively based on speed, alarm state, and visibility
      let nextDelay = 1000;
      if (document.hidden) {
        nextDelay = state.isAnchorAlarmActive ? 5000 : 30000;
      } else if (speedKts < 1.0 && !state.isAnchorAlarmActive) {
        nextDelay = 10000;
      } else if (speedKts < 2.0 && !state.isAnchorAlarmActive) {
        nextDelay = 5000;
      }
      
      if (realWatchId) {
        adaptiveGPSTimeout = setTimeout(pollGPS, nextDelay);
      }
    },
    (error) => {
      console.error("GPS Poll error: ", error);
      if (realWatchId) {
        adaptiveGPSTimeout = setTimeout(pollGPS, 5000);
      }
    },
    {
      enableHighAccuracy: true,
      timeout: 8000,
      maximumAge: 0
    }
  );
}

export function startRealGPS() {
  stopRealGPS();
  if ("geolocation" in navigator) {
    realWatchId = true;
    pollGPS();
  } else {
    alert("Geolocation API not supported. Switched to Simulation Mode.");
    const toggle = document.getElementById('simulator-toggle-modal');
    if (toggle) toggle.checked = true;
    toggleSimulator(true);
  }
}

export function stopRealGPS() {
  realWatchId = null;
  if (adaptiveGPSTimeout) {
    clearTimeout(adaptiveGPSTimeout);
    adaptiveGPSTimeout = null;
  }
}

export function triggerSimulatorDrift() {
  state.isDrifting = true;
  state.simSpeed = 8.0;
  state.simHeading = 180;
  
  const speedVal = document.getElementById('sim-speed-val-modal');
  const speedSlider = document.getElementById('sim-speed-slider-modal');
  const headingVal = document.getElementById('sim-heading-val-modal');
  const headingSlider = document.getElementById('sim-heading-slider-modal');

  if (speedVal) speedVal.textContent = '8.0';
  if (speedSlider) speedSlider.value = '8.0';
  if (headingVal) headingVal.textContent = '180';
  if (headingSlider) headingSlider.value = '180';
}

// Hibernate tasks when screen is off to conserve battery
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    console.log("App hibernated - conserving CPU/GPS battery.");
    stopSimLoop();
    if (realWatchId && adaptiveGPSTimeout) {
      clearTimeout(adaptiveGPSTimeout);
      const nextDelay = state.isAnchorAlarmActive ? 5000 : 30000;
      adaptiveGPSTimeout = setTimeout(pollGPS, nextDelay);
    }
  } else {
    console.log("App active - restoring standard loops.");
    if (state.isSimulating) {
      startSimLoop();
    } else {
      startRealGPS();
    }
  }
});
