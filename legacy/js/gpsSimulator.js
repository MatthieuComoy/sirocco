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
    
    // Stop Real Geolocation
    stopRealGPS();
    
    // Start Simulation Loop
    startSimLoop();
  } else {
    if (statusText) statusText.textContent = translations[state.currentLang].sim_inactive;
    if (controlsCard) controlsCard.style.display = 'none';
    if (toggle) toggle.checked = false;
    
    stopSimLoop();
    
    // Start Real Geolocation
    startRealGPS();
  }
}

export function startSimLoop() {
  if (state.simTimer) return;
  state.simTimer = setInterval(() => {
    // Calculate new position based on speed and heading
    // 1 knot = 1.852 km/h = 0.514444 m/s
    const dt = 1; // 1 second
    const speedMs = state.simSpeed * 0.514444;
    const distanceMeters = speedMs * dt;
    
    const bearingRad = (state.simHeading * Math.PI) / 180;
    
    // Very simple flat projection for small movement:
    // 1 degree latitude = 111,111 meters
    // 1 degree longitude = 111,111 * cos(lat) meters
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

export function startRealGPS() {
  if ("geolocation" in navigator) {
    realWatchId = navigator.geolocation.watchPosition(
      (position) => {
        const coords = position.coords;
        // speed is in m/s, convert to knots
        const speedKts = coords.speed ? (coords.speed * 1.94384) : 0;
        const headingDeg = coords.heading ? coords.heading : 0;
        updatePosition(coords.latitude, coords.longitude, speedKts, headingDeg);
      },
      (error) => {
        console.error("GPS Watch error: ", error);
        // Fallback to simulation
        alert("GPS Signal failed. Switched to Simulation Mode.");
        const toggle = document.getElementById('simulator-toggle-modal');
        if (toggle) toggle.checked = true;
        toggleSimulator(true);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  } else {
    alert("Geolocation API not supported. Switched to Simulation Mode.");
    const toggle = document.getElementById('simulator-toggle-modal');
    if (toggle) toggle.checked = true;
    toggleSimulator(true);
  }
}

export function stopRealGPS() {
  if (realWatchId !== null) {
    navigator.geolocation.clearWatch(realWatchId);
    realWatchId = null;
  }
}

export function triggerSimulatorDrift() {
  state.isDrifting = true;
  state.simSpeed = 8.0; // speed up
  state.simHeading = 180; // drift south directly away from anchor
  
  const speedVal = document.getElementById('sim-speed-val-modal');
  const speedSlider = document.getElementById('sim-speed-slider-modal');
  const headingVal = document.getElementById('sim-heading-val-modal');
  const headingSlider = document.getElementById('sim-heading-slider-modal');

  if (speedVal) speedVal.textContent = '8.0';
  if (speedSlider) speedSlider.value = '8.0';
  if (headingVal) headingVal.textContent = '180';
  if (headingSlider) headingSlider.value = '180';
}
