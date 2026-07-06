// Sirroco Marine Navigation - Weather & Tides Module

import { state } from './state.js';
import { translations } from './i18n.js';
import { calculateHaversineDistance, getWindCardinal, calculateTidesForDay } from './utils.js';

export function updateWeatherUI(weatherData, marineData) {
  const curWeather = weatherData.current;
  const curMarine = marineData ? marineData.current : null;

  // Wind speed
  const windSpeedEl = document.getElementById('weather-wind-speed');
  if (windSpeedEl && curWeather.wind_speed_10m !== undefined) {
    windSpeedEl.textContent = Math.round(curWeather.wind_speed_10m);
  }

  // Wind Dir
  const windDirEl = document.getElementById('weather-wind-dir');
  const windArrow = document.getElementById('weather-wind-arrow');
  if (curWeather.wind_direction_10m !== undefined) {
    state.currentWindDirection = curWeather.wind_direction_10m;
    if (windDirEl) windDirEl.textContent = `${getWindCardinal(curWeather.wind_direction_10m)} (${curWeather.wind_direction_10m}°)`;
    if (windArrow) {
      windArrow.style.transform = `rotate(${curWeather.wind_direction_10m + 180}deg)`;
    }
    // Update boat sails dynamically when wind data changes
    updateBoatSails(state.currentHeading, state.currentWindDirection);
  }

  // Wind Gusts
  const windGustsEl = document.getElementById('weather-wind-gusts');
  if (windGustsEl && curWeather.wind_gusts_10m !== undefined) {
    windGustsEl.textContent = `${Math.round(curWeather.wind_gusts_10m)} Kts`;
  }

  // Barometer
  const baroEl = document.getElementById('weather-barometer');
  if (baroEl && curWeather.pressure_msl !== undefined) {
    baroEl.textContent = Math.round(curWeather.pressure_msl);
  }

  // Temperature
  const tempEl = document.getElementById('weather-temp');
  if (tempEl && curWeather.temperature_2m !== undefined) {
    tempEl.textContent = curWeather.temperature_2m.toFixed(1);
  }

  // Wave Height
  const waveHeightEl = document.getElementById('weather-wave-height');
  if (waveHeightEl) {
    if (curMarine && curMarine.wave_height !== null && curMarine.wave_height !== undefined) {
      waveHeightEl.textContent = curMarine.wave_height.toFixed(2);
    } else {
      waveHeightEl.textContent = '--';
    }
  }

  // Wave Dir
  const waveDirEl = document.getElementById('weather-wave-dir');
  const waveArrow = document.getElementById('weather-wave-arrow');
  if (waveDirEl) {
    if (curMarine && curMarine.wave_direction !== null && curMarine.wave_direction !== undefined) {
      waveDirEl.textContent = `${getWindCardinal(curMarine.wave_direction)} (${curMarine.wave_direction}°)`;
      if (waveArrow) {
        waveArrow.style.display = 'inline-block';
        waveArrow.style.transform = `rotate(${curMarine.wave_direction + 180}deg)`;
      }
    } else {
      waveDirEl.textContent = '--';
      if (waveArrow) waveArrow.style.display = 'none';
    }
  }

  // Wave Period
  const wavePeriodEl = document.getElementById('weather-wave-period');
  if (wavePeriodEl) {
    if (curMarine && curMarine.wave_period !== null && curMarine.wave_period !== undefined) {
      wavePeriodEl.textContent = `${Math.round(curMarine.wave_period)} s`;
    } else {
      wavePeriodEl.textContent = '--';
    }
  }
}

// Dynamic sail trimming simulator based on heading and relative wind direction
export function updateBoatSails(heading, windDir) {
  const mainsail = document.getElementById('boat-mainsail');
  const jib = document.getElementById('boat-jib');
  if (!mainsail || !jib) return;

  if (windDir === null || windDir === undefined || isNaN(windDir)) {
    // Default sail setting (broad reach / grand largue on port tack) when wind is not loaded
    mainsail.style.transform = 'scaleX(1) rotate(55deg)';
    jib.style.transform = 'scaleX(1) rotate(60deg)';
    mainsail.classList.remove('sail-flutter');
    jib.classList.remove('sail-flutter');
    return;
  }

  // Calculate apparent wind angle relative to boat bow (0 is head-to-wind, 180/-180 is tailwind)
  let alpha = (windDir - heading) % 360;
  if (alpha > 180) alpha -= 360;
  if (alpha < -180) alpha += 360;

  const absAlpha = Math.abs(alpha);
  // Sails swing to the opposite side of the wind
  // wind from starboard (alpha > 0) -> sails swing to port/left (scaleX(1) + rotate)
  // wind from port (alpha < 0) -> sails swing to starboard/right (scaleX(-1) + rotate)
  const side = alpha >= 0 ? 1 : -1;

  let mainAngle = 0;
  let jibAngle = 0;
  let isFluttering = false;
  let jibSideMultiplier = 1; // 1 means same side as mainsail, -1 means opposite side (wing-on-wing)

  if (absAlpha < 30) {
    // Head to wind: sails flapping in the centerline
    mainAngle = 0;
    jibAngle = 0;
    isFluttering = true;
  } else if (absAlpha < 55) {
    // Close-hauled (au près): sails trimmed tight, practically in the axis of the boat
    mainAngle = 5;
    jibAngle = 8;
  } else if (absAlpha < 110) {
    // Beam reach (au travers): sails opened halfway
    mainAngle = 35;
    jibAngle = 40;
  } else if (absAlpha < 155) {
    // Broad reach (grand largue): sails opened wide
    mainAngle = 60;
    jibAngle = 65;
  } else {
    // Running (vent arrière): sails opened practically at right angle, wing-on-wing
    mainAngle = 80;
    jibAngle = 80;
    jibSideMultiplier = -1; // Jib is trimmed on the opposite side of the mainsail
  }

  mainsail.style.transform = `scaleX(${side}) rotate(${mainAngle}deg)`;
  jib.style.transform = `scaleX(${side * jibSideMultiplier}) rotate(${jibAngle}deg)`;

  if (isFluttering) {
    mainsail.classList.add('sail-flutter');
    jib.classList.add('sail-flutter');
  } else {
    mainsail.classList.remove('sail-flutter');
    jib.classList.remove('sail-flutter');
  }
}

export async function updateWeatherAndTides(lat, lon, force = false) {
  if (!force && state.lastFetchedLat !== null && state.lastFetchedLon !== null) {
    const dist = calculateHaversineDistance(lat, lon, state.lastFetchedLat, state.lastFetchedLon);
    if (dist < 150) {
      return;
    }
  }

  state.lastFetchedLat = lat;
  state.lastFetchedLon = lon;

  const loadingIndicator = document.getElementById('weather-loading');
  const locationEl = document.getElementById('weather-location');

  if (loadingIndicator) loadingIndicator.style.display = 'inline-block';
  if (locationEl) {
    locationEl.textContent = translations[state.currentLang].lang_lbl === 'Language' ? 'Searching location...' : 'Recherche de la position...';
  }

  try {
    let locationName = `Lat: ${lat.toFixed(4)}, Lon: ${lon.toFixed(4)}`;
    
    // Reverse Geocoding via Nominatim with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);
    
    try {
      const geoUrl = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&zoom=10&accept-language=${state.currentLang}`;
      const geoRes = await fetch(geoUrl, {
        headers: { 'User-Agent': 'SirrocoMarineNavigation/1.0' },
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      if (geoRes.ok) {
        const geoData = await geoRes.json();
        if (geoData && geoData.address) {
          const addr = geoData.address;
          const place = addr.city || addr.town || addr.village || addr.municipality || addr.county || addr.state || addr.country;
          if (place) {
            locationName = place;
            if (addr.country && addr.country !== place) {
              locationName += `, ${addr.country}`;
            }
          } else if (geoData.display_name) {
            locationName = geoData.display_name.split(',').slice(0, 2).join(',');
          }
        }
      }
    } catch (err) {
      console.warn("Nominatim geocoding failed/timed out:", err);
    }

    if (!navigator.onLine) {
      locationName += state.currentLang === 'fr' ? ' (Hors-ligne / Cache)' : ' (Offline / Cache)';
    }

    if (locationEl) locationEl.textContent = locationName;

    // Update tide title
    const tideTitle = document.getElementById('tide-title');
    if (tideTitle) {
      const titleSpan = tideTitle.querySelector('span[data-i18n="tide_lbl"]') || tideTitle;
      const baseTitle = state.currentLang === 'fr' ? 'Prédiction Marée' : 'Tide Forecast';
      titleSpan.textContent = `${baseTitle} (${locationName.split(',')[0]})`;
    }

    // Fetch Weather from Open-Meteo
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code,pressure_msl,wind_speed_10m,wind_direction_10m,wind_gusts_10m&wind_speed_unit=kn&timezone=auto`;
    const weatherRes = await fetch(weatherUrl);
    if (!weatherRes.ok) throw new Error("Weather API failed");
    const weatherData = await weatherRes.json();

    // Fetch Marine waves from Open-Meteo
    const marineUrl = `https://marine-api.open-meteo.com/v1/marine?latitude=${lat}&longitude=${lon}&current=wave_height,wave_direction,wave_period&timezone=auto`;
    let marineData = null;
    try {
      const marineRes = await fetch(marineUrl);
      if (marineRes.ok) {
        marineData = await marineRes.json();
      }
    } catch (e) {
      console.warn("Marine waves fetch failed:", e);
    }

    updateWeatherUI(weatherData, marineData);

    // Calculate & draw tides
    const date = new Date();
    const tideData = calculateTidesForDay(lat, lon, date);
    state.currentTideData = tideData;
    drawTideChart(lat, lon, tideData);

  } catch (error) {
    console.error("Error fetching weather/tides:", error);
    if (locationEl) {
      locationEl.textContent = state.currentLang === 'fr' ? 'Données indisponibles (Hors-ligne)' : 'Data unavailable (Offline)';
    }
    // Draw tide curve with calculated simulation anyway
    const date = new Date();
    const tideData = calculateTidesForDay(lat, lon, date);
    state.currentTideData = tideData;
    drawTideChart(lat, lon, tideData);
  } finally {
    if (loadingIndicator) loadingIndicator.style.display = 'none';
  }
}

export function onMapMove() {
  if (state.appMode !== 'weather') return;
  
  if (state.weatherDebounceTimeout) clearTimeout(state.weatherDebounceTimeout);
  state.weatherDebounceTimeout = setTimeout(() => {
    if (state.map) {
      const center = state.map.getCenter();
      updateWeatherAndTides(center.lat, center.lng);
      updateGribForCurrentBounds();
    }
  }, 800);
}

export function centerTideChartScroll() {
  const wrapper = document.getElementById('tide-scroll-wrapper');
  if (!wrapper) return;
  const nowLine = wrapper.querySelector('#tide-now-line');
  if (nowLine) {
    const x = parseFloat(nowLine.getAttribute('x1'));
    if (!isNaN(x)) {
      wrapper.scrollLeft = x - wrapper.clientWidth / 2;
    }
  }
}

export function drawTideChart(lat, lon, tideData) {
  const container = document.getElementById('tide-scroll-wrapper');
  if (!container) return;

  if (!tideData) {
    const targetLat = lat !== undefined ? lat : state.currentLat;
    const targetLon = lon !== undefined ? lon : state.currentLon;
    tideData = calculateTidesForDay(targetLat, targetLon, new Date());
  }

  const rangeBadge = document.getElementById('tide-range-badge');
  if (rangeBadge) {
    const coefText = `Coef: ${tideData.coefficient}`;
    const rangeText = state.currentLang === 'fr' ? `Marnage: ${tideData.range.toFixed(2)}m` : `Range: ${tideData.range.toFixed(2)}m`;
    rangeBadge.textContent = `${rangeText} | ${coefText}`;
  }

  let maxHeight = 0.1;
  let minHeight = 99999;
  tideData.samples.forEach(s => {
    if (s.height > maxHeight) maxHeight = s.height;
    if (s.height < minHeight) minHeight = s.height;
  });

  const heightDiff = maxHeight - minHeight;
  const yMax = maxHeight + Math.max(0.1, heightDiff * 0.15);
  const yMin = Math.max(0, minHeight - Math.max(0.1, heightDiff * 0.15));
  const yScaleRange = yMax - yMin;

  const svgWidth = 960;
  const svgHeight = 140;
  const getX = (hour) => 20 + (hour / 48) * 920;
  const getY = (height) => 115 - ((height - yMin) / yScaleRange) * 85;

  let curvePath = "";
  tideData.samples.forEach((s, idx) => {
    const x = getX(s.hour);
    const y = getY(s.height);
    if (idx === 0) {
      curvePath += `M ${x},${y}`;
    } else {
      curvePath += ` L ${x},${y}`;
    }
  });

  const firstX = getX(tideData.samples[0].hour);
  const lastX = getX(tideData.samples[tideData.samples.length - 1].hour);
  const areaPath = `${curvePath} L ${lastX},115 L ${firstX},115 Z`;

  const curX = getX(tideData.currentHour);
  const curY = getY(tideData.currentHeight);

  let extremesHtml = "";
  tideData.extremes.forEach(e => {
    const x = getX(e.hour);
    const y = getY(e.height);
    const isHigh = e.type === 'high';
    const label = isHigh ? (state.currentLang === 'fr' ? 'PM' : 'HW') : (state.currentLang === 'fr' ? 'BM' : 'LW');
    const yOffset = isHigh ? -10 : 13;
    const colorClass = isHigh ? "var(--warning-color)" : "var(--text-muted)";
    extremesHtml += `
      <circle cx="${x}" cy="${y}" r="4" fill="${colorClass}" stroke="rgba(255,255,255,0.15)" stroke-width="1" />
      <text x="${x}" y="${y + yOffset}" fill="var(--text-color)" font-size="7.5" font-weight="600" text-anchor="middle">
        ${label}: ${e.height.toFixed(2)}m (${e.timeStr})
      </text>
    `;
  });

  let gridLines = "";
  for (let h = 3; h < 48; h += 3) {
    const x = getX(h);
    const isDayBoundary = (h === 24);
    const strokeColor = isDayBoundary ? "rgba(255, 255, 255, 0.25)" : "rgba(255, 255, 255, 0.05)";
    const strokeDash = isDayBoundary ? "" : "3,3";
    const labelHour = h % 24 === 0 ? "0h" : `${h % 24}h`;
    
    gridLines += `
      <line x1="${x}" y1="20" x2="${x}" y2="115" stroke="${strokeColor}" stroke-width="1" ${strokeDash ? `stroke-dasharray="${strokeDash}"` : ""} />
      <text x="${x}" y="127" fill="var(--text-muted)" font-size="7" text-anchor="middle">${labelHour}</text>
    `;
  }

  const todayText = state.currentLang === 'fr' ? "Aujourd'hui" : "Today";
  const tomorrowText = state.currentLang === 'fr' ? "Demain" : "Tomorrow";

  container.innerHTML = `
    <svg width="${svgWidth}" height="${svgHeight}" viewBox="0 0 ${svgWidth} ${svgHeight}" style="overflow: visible; user-select: none; display: block;">
      <defs>
        <linearGradient id="tide-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="var(--accent-color)" stop-opacity="0.25" />
          <stop offset="100%" stop-color="var(--accent-color)" stop-opacity="0.0" />
        </linearGradient>
      </defs>
      
      <!-- Day Headers -->
      <text x="250" y="15" fill="var(--accent-color)" font-size="10" font-weight="700" text-anchor="middle" opacity="0.85">${todayText}</text>
      <text x="710" y="15" fill="var(--accent-color)" font-size="10" font-weight="700" text-anchor="middle" opacity="0.85">${tomorrowText}</text>
      
      <!-- Base Line -->
      <line x1="20" y1="115" x2="940" y2="115" stroke="var(--border-color)" stroke-width="1.5" />
      <text x="20" y="127" fill="var(--text-muted)" font-size="7" text-anchor="middle">0h</text>
      <text x="940" y="127" fill="var(--text-muted)" font-size="7" text-anchor="middle">24h</text>
      
      ${gridLines}

      <!-- Filled Gradient Area -->
      <path d="${areaPath}" fill="url(#tide-gradient)" />
      
      <!-- Tide Curve -->
      <path d="${curvePath}" fill="none" stroke="var(--accent-color)" stroke-width="3" stroke-linecap="round" />
      
      ${extremesHtml}
      
      <!-- Now Indicator (Dashed line and dot) -->
      <line id="tide-now-line" x1="${curX}" y1="20" x2="${curX}" y2="115" stroke="var(--warning-color)" stroke-width="1.5" stroke-dasharray="3,3" opacity="0.8" />
      <circle cx="${curX}" cy="${curY}" r="5" fill="var(--warning-color)" stroke="var(--surface-color)" stroke-width="1.5" />
      
      <!-- Interactive Selector Elements -->
      <line id="tide-selector-line" x1="0" y1="20" x2="0" y2="115" stroke="var(--accent-color)" stroke-width="1.5" style="display: none;" />
      <circle id="tide-selector-dot" cx="0" cy="0" r="5.5" fill="var(--accent-color)" stroke="var(--surface-color)" stroke-width="1.5" style="display: none;" />
    </svg>
  `;

  // Dynamic localization for recenter button
  const recenterTextEl = document.getElementById('tide-recenter-text');
  if (recenterTextEl) {
    recenterTextEl.textContent = state.currentLang === 'fr' ? 'Maintenant' : 'Now';
  }

  // Populate horizontal schedule list below the chart
  const scheduleContainer = document.getElementById('tide-schedule-list');
  if (scheduleContainer && tideData.extremes) {
    let scheduleHtml = "";
    tideData.extremes.forEach(e => {
      const isHigh = e.type === 'high';
      const label = isHigh 
        ? (state.currentLang === 'fr' ? 'Pleine mer' : 'High Water')
        : (state.currentLang === 'fr' ? 'Basse mer' : 'Low Water');
      const dayLabel = e.isTomorrow 
        ? (state.currentLang === 'fr' ? 'Demain' : 'Auj.')
        : (state.currentLang === 'fr' ? 'Auj.' : 'Today');
      const itemClass = isHigh ? 'high' : 'low';
      
      scheduleHtml += `
        <div class="tide-schedule-item ${itemClass}">
          <span class="tide-schedule-label">${label} (${dayLabel})</span>
          <span class="tide-schedule-time">${e.timeStr}</span>
          <span class="tide-schedule-height">${e.height.toFixed(2)} m</span>
        </div>
      `;
    });
    scheduleContainer.innerHTML = scheduleHtml;
  }

  // Set up event listeners for interactive scrubbing
  const svg = container.querySelector('svg');
  const tooltip = document.getElementById('tide-tooltip');
  const recenterBtn = document.getElementById('tide-recenter-btn');
  
  if (recenterBtn) {
    recenterBtn.onclick = () => {
      centerTideChartScroll();
    };
  }
  
  if (svg) {
    const selectorLine = svg.getElementById('tide-selector-line');
    const selectorDot = svg.getElementById('tide-selector-dot');
    
    const updateSelector = (clientX) => {
      const rect = svg.getBoundingClientRect();
      // Calculate relative x coordinate inside the SVG
      let x = ((clientX - rect.left) / rect.width) * svgWidth;
      if (x < 20) x = 20;
      if (x > 940) x = 940;
      
      // Map x to hour (0 to 48)
      const xPercent = (x - 20) / 920;
      const hour = xPercent * 48;
      
      // Get closest sample for height
      const closestSample = tideData.samples.reduce((prev, curr) => {
        return (Math.abs(curr.hour - hour) < Math.abs(prev.hour - hour) ? curr : prev);
      });
      const height = closestSample.height;
      const y = getY(height);
      
      // Update SVG selector line and dot
      if (selectorLine) {
        selectorLine.setAttribute('x1', x);
        selectorLine.setAttribute('x2', x);
        selectorLine.style.display = 'block';
      }
      if (selectorDot) {
        selectorDot.setAttribute('cx', x);
        selectorDot.setAttribute('cy', y);
        selectorDot.style.display = 'block';
      }
      
      // Calculate rising/falling trend
      const sampleIdx = tideData.samples.indexOf(closestSample);
      const nextSampleIdx = Math.min(tideData.samples.length - 1, sampleIdx + 1);
      const isRising = tideData.samples[nextSampleIdx].height > closestSample.height;
      const trendStr = isRising ? '↗' : '↘';
      const trendWord = isRising 
        ? (state.currentLang === 'fr' ? 'Montante' : 'Rising') 
        : (state.currentLang === 'fr' ? 'Descendante' : 'Falling');
      
      // Format hour and minute
      const hr = Math.floor(hour) % 24;
      const min = Math.round((hour % 1) * 60);
      const formattedTime = `${hr.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`;
      const dayLabel = hour >= 24 
        ? (state.currentLang === 'fr' ? 'Demain' : 'Tomorrow')
        : (state.currentLang === 'fr' ? "Aujourd'hui" : 'Today');
      
      // Update and position tooltip
      if (tooltip) {
        tooltip.innerHTML = `<strong>${dayLabel} ${formattedTime}</strong> : ${height.toFixed(2)} m <span style="color: ${isRising ? 'var(--success-color)' : 'var(--warning-color)'}; font-weight: 800;">${trendStr} ${trendWord}</span>`;
        tooltip.style.display = 'block';
        tooltip.style.opacity = '1';
      }
    };
    
    const hideSelector = () => {
      if (selectorLine) selectorLine.style.display = 'none';
      if (selectorDot) selectorDot.style.display = 'none';
      if (tooltip) {
        tooltip.style.display = 'none';
        tooltip.style.opacity = '0';
      }
    };
    
    svg.addEventListener('mousemove', (e) => {
      updateSelector(e.clientX);
    });
    svg.addEventListener('mouseleave', () => {
      hideSelector();
    });
    
    svg.addEventListener('touchstart', (e) => {
      if (e.touches && e.touches[0]) {
        updateSelector(e.touches[0].clientX);
      }
    }, { passive: true });
    
    svg.addEventListener('touchmove', (e) => {
      if (e.touches && e.touches[0]) {
        updateSelector(e.touches[0].clientX);
      }
    }, { passive: true });
    
    svg.addEventListener('touchend', () => {
      hideSelector();
    });
  }

  // Center scrollbar on the current hour after rendering
  setTimeout(() => {
    centerTideChartScroll();
  }, 50);
}

// ---------------- GRIB WEATHER OVERLAYS AND TIME SLIDER ----------------

let isPlaying = false;
const GRIB_GRID_SIZE = 10; // 10x10 grid for weather overlay

// Calculate grid coordinates covering the current map bounds
function getGridCoords(bounds) {
  const sw = bounds.getSouthWest();
  const ne = bounds.getNorthEast();
  
  const minLat = sw.lat;
  const maxLat = ne.lat;
  const minLng = sw.lng;
  const maxLng = ne.lng;
  
  const size = GRIB_GRID_SIZE;
  const coords = [];
  
  for (let r = 0; r < size; r++) {
    const lat = minLat + (r / (size - 1)) * (maxLat - minLat);
    for (let c = 0; c < size; c++) {
      const lng = minLng + (c / (size - 1)) * (maxLng - minLng);
      coords.push({ lat, lng });
    }
  }
  return coords;
}

// Map a wind speed value to [R, G, B, A] array for canvas interpolation
function getWindColorArray(speed) {
  if (speed <= 5) return [34, 197, 94, 90];    // Green
  if (speed <= 10) return [163, 230, 53, 90];  // Lime
  if (speed <= 15) return [234, 179, 8, 100];   // Yellow
  if (speed <= 20) return [249, 115, 22, 110];  // Orange
  if (speed <= 30) return [239, 68, 68, 120];   // Red
  return [168, 85, 247, 140];                   // Purple
}

// Map a temperature value to [R, G, B, A] array for canvas interpolation
function getTempColorArray(temp) {
  if (temp <= 0) return [59, 130, 246, 90];    // Blue
  if (temp <= 10) return [34, 211, 238, 90];   // Cyan
  if (temp <= 18) return [34, 197, 94, 90];    // Green
  if (temp <= 25) return [234, 179, 8, 100];    // Yellow
  if (temp <= 32) return [249, 115, 22, 115];   // Orange
  return [239, 68, 68, 130];                    // Red
}

// Performs bilinear interpolation on grid data and draws it to a canvas
function drawInterpolatedHeatmap(canvas, gridData, width, height, type) {
  const ctx = canvas.getContext('2d');
  const imgData = ctx.createImageData(width, height);
  const size = GRIB_GRID_SIZE;
  
  for (let y = 0; y < height; y++) {
    // Invert y because canvas (0,0) is top (maxLat) and grid row 0 is bottom (minLat)
    const gy = ((height - 1 - y) / (height - 1)) * (size - 1);
    const r0 = Math.floor(gy);
    const r1 = Math.min(size - 1, r0 + 1);
    const dy = gy - r0;
    
    for (let x = 0; x < width; x++) {
      const gx = (x / (width - 1)) * (size - 1);
      const c0 = Math.floor(gx);
      const c1 = Math.min(size - 1, c0 + 1);
      const dx = gx - c0;
      
      const v00 = gridData[r0 * size + c0];
      const v10 = gridData[r0 * size + c1];
      const v01 = gridData[r1 * size + c0];
      const v11 = gridData[r1 * size + c1];
      
      const val = v00 * (1 - dx) * (1 - dy) +
                  v10 * dx * (1 - dy) +
                  v01 * (1 - dx) * dy +
                  v11 * dx * dy;
                  
      const colorArr = (type === 'wind') ? getWindColorArray(val) : getTempColorArray(val);
      const pixelIdx = (y * width + x) * 4;
      
      imgData.data[pixelIdx] = colorArr[0];
      imgData.data[pixelIdx + 1] = colorArr[1];
      imgData.data[pixelIdx + 2] = colorArr[2];
      imgData.data[pixelIdx + 3] = colorArr[3];
    }
  }
  ctx.putImageData(imgData, 0, 0);
}

// Generates SVG wind barb path for a given speed and direction
function getWindBarbSVG(speed, direction) {
  let numFlags = Math.floor(speed / 50);
  let remain = speed % 50;
  let numLongFeathers = Math.floor(remain / 10);
  remain = remain % 10;
  let numShortFeathers = Math.floor(remain / 5);
  
  let path = 'M 16 28 L 16 4'; // barb shaft from bottom to top
  
  let y = 4;
  const xLeft = 16;
  const xRight = 26;
  
  // 50 knots flags
  for (let i = 0; i < numFlags; i++) {
    path += ` M ${xLeft} ${y} L ${xRight} ${y + 3} L ${xLeft} ${y + 6} Z`;
    y += 8;
  }
  
  // 10 knots long feathers
  for (let i = 0; i < numLongFeathers; i++) {
    path += ` M ${xLeft} ${y} L ${xRight} ${y - 4}`;
    y += 5;
  }
  
  // 5 knots short feathers
  for (let i = 0; i < numShortFeathers; i++) {
    path += ` M ${xLeft} ${y} L ${16 + (xRight - 16) / 2} ${y - 2}`;
    y += 5;
  }
  
  return `
    <svg viewBox="0 0 32 32" style="width: 28px; height: 28px; transform: rotate(${direction}deg); overflow: visible; color: var(--text-color);">
      <circle cx="16" cy="28" r="1.5" fill="currentColor"/>
      <path d="${path}" stroke="currentColor" stroke-width="2" fill="currentColor" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `;
}

// Dynamic GRIB overlay renderer
export function renderGribOverlay() {
  if (!state.map || !state.gribData || state.gribData.length === 0) return;
  
  const timeIdx = state.activeWeatherTimeIndex;
  
  // Create hidden canvas for heatmap interpolation
  const canvas = document.createElement('canvas');
  canvas.width = 120;
  canvas.height = 120;
  
  const gridValues = state.gribData.map(loc => {
    const hourly = loc.hourly;
    if (state.weatherOverlayType === 'wind') {
      return hourly.wind_speed_10m[timeIdx] || 0;
    } else {
      return hourly.temperature_2m[timeIdx] || 0;
    }
  });
  
  drawInterpolatedHeatmap(canvas, gridValues, canvas.width, canvas.height, state.weatherOverlayType);
  const dataUrl = canvas.toDataURL();
  
  // Draw or update the ImageOverlay
  if (state.gribImageOverlay) {
    state.gribImageOverlay.setUrl(dataUrl);
    state.gribImageOverlay.setBounds(state.gribBounds);
  } else {
    state.gribImageOverlay = L.imageOverlay(dataUrl, state.gribBounds, {
      opacity: 0.5,
      interactive: false,
      zIndex: 350
    }).addTo(state.map);
  }
  
  // Draw or update the wind barbs markers
  if (!state.gribBarbsLayer) {
    state.gribBarbsLayer = L.layerGroup().addTo(state.map);
  } else {
    state.gribBarbsLayer.clearLayers();
  }
  
  if (state.weatherOverlayType === 'wind') {
    const size = GRIB_GRID_SIZE;
    const lats = [];
    const lngs = [];
    const sw = state.gribBounds.getSouthWest();
    const ne = state.gribBounds.getNorthEast();
    
    for (let i = 0; i < size; i++) {
      lats.push(sw.lat + (i / (size - 1)) * (ne.lat - sw.lat));
      lngs.push(sw.lng + (i / (size - 1)) * (ne.lng - sw.lng));
    }
    
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        const idx = r * size + c;
        const lat = lats[r];
        const lng = lngs[c];
        
        const speed = state.gribData[idx].hourly.wind_speed_10m[timeIdx] || 0;
        const dir = state.gribData[idx].hourly.wind_direction_10m[timeIdx] || 0;
        
        if (speed < 2) continue; // Skip calm
        
        const svgString = getWindBarbSVG(speed, dir);
        const icon = L.divIcon({
          html: svgString,
          className: 'wind-barb-div-icon',
          iconSize: [28, 28],
          iconAnchor: [16, 28] // Anchor at the circle base (station location)
        });
        
        L.marker([lat, lng], {
          icon: icon,
          interactive: false
        }).addTo(state.gribBarbsLayer);
      }
    }
  }
}

// Generate the timeline UI day blocks and hour ticks
function generateTimeline() {
  const container = document.getElementById('timeline-scroll-container');
  if (!container) return;
  container.innerHTML = '';
  
  const monthsFr = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
  const monthsEn = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const months = state.currentLang === 'fr' ? monthsFr : monthsEn;
  
  const daysFr = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
  const daysEn = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const days = state.currentLang === 'fr' ? daysFr : daysEn;
  
  const baseDate = new Date();
  
  for (let d = 0; d < 7; d++) {
    const date = new Date(baseDate.getTime() + d * 24 * 60 * 60 * 1000);
    const dayName = `${days[date.getDay()]} ${String(date.getDate()).padStart(2, '0')}`;
    
    const dayBlock = document.createElement('div');
    dayBlock.className = 'timeline-day-block';
    
    const dayLabel = document.createElement('div');
    dayLabel.className = 'timeline-day-name';
    dayLabel.textContent = dayName;
    dayBlock.appendChild(dayLabel);
    
    const hoursRow = document.createElement('div');
    hoursRow.className = 'timeline-hours-row';
    
    for (let h = 0; h < 24; h += 3) {
      const tick = document.createElement('div');
      tick.className = 'timeline-hour-tick';
      const timeIndex = d * 24 + h;
      tick.setAttribute('data-index', timeIndex);
      tick.textContent = `${String(h).padStart(2, '0')}h`;
      
      if (timeIndex === state.activeWeatherTimeIndex) {
        tick.classList.add('active');
      }
      
      tick.addEventListener('click', (e) => {
        e.stopPropagation();
        setActiveTimeStep(timeIndex);
      });
      
      hoursRow.appendChild(tick);
    }
    dayBlock.appendChild(hoursRow);
    container.appendChild(dayBlock);
  }
  
  updateCurrentTimeBadge();
}

// Sets the active time step index and redraws GRIB overlay
function setActiveTimeStep(index) {
  state.activeWeatherTimeIndex = index;
  
  document.querySelectorAll('.timeline-hour-tick').forEach(tick => {
    const idx = parseInt(tick.getAttribute('data-index'), 10);
    if (idx === index) {
      tick.classList.add('active');
      tick.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    } else {
      tick.classList.remove('active');
    }
  });
  
  updateCurrentTimeBadge();
  renderGribOverlay();
}

// Updates time badge (e.g. "02/07 - 15:00")
function updateCurrentTimeBadge() {
  const badge = document.getElementById('timeline-current-badge');
  if (!badge) return;
  
  const baseDate = new Date();
  baseDate.setHours(0, 0, 0, 0); // Today's midnight
  const targetDate = new Date(baseDate.getTime() + state.activeWeatherTimeIndex * 60 * 60 * 1000);
  
  const day = String(targetDate.getDate()).padStart(2, '0');
  const month = String(targetDate.getMonth() + 1).padStart(2, '0');
  const hours = String(targetDate.getHours()).padStart(2, '0');
  
  badge.textContent = `${day}/${month} - ${hours}:00`;
}

// Animates playback timeline play/pause
function togglePlay() {
  const playIcon = document.getElementById('timeline-play-icon');
  const pauseIcon = document.getElementById('timeline-pause-icon');
  
  if (isPlaying) {
    isPlaying = false;
    if (playIcon) playIcon.style.display = 'block';
    if (pauseIcon) pauseIcon.style.display = 'none';
    if (state.gribPlayInterval) {
      clearInterval(state.gribPlayInterval);
      state.gribPlayInterval = null;
    }
  } else {
    isPlaying = true;
    if (playIcon) playIcon.style.display = 'none';
    if (pauseIcon) pauseIcon.style.display = 'block';
    
    state.gribPlayInterval = setInterval(() => {
      let nextIndex = state.activeWeatherTimeIndex + 3;
      if (nextIndex >= 168) {
        nextIndex = 0;
      }
      setActiveTimeStep(nextIndex);
    }, 1000);
  }
}

// Fetches the grid weather forecast for current map view bounds
export async function updateGribForCurrentBounds(force = false) {
  if (state.appMode !== 'weather' || !state.map) return;
  
  const bounds = state.map.getBounds();
  
  // Avoid redundant fetching if viewport moved less than 5 NM
  if (!force && state.gribBounds) {
    const center = state.map.getCenter();
    const oldCenter = state.gribBounds.getCenter();
    const dist = calculateHaversineDistance(center.lat, center.lng, oldCenter.lat, oldCenter.lng);
    if (dist < 5.0) {
      return;
    }
  }
  
  state.gribBounds = bounds;
  const coords = getGridCoords(bounds);
  
  const latsStr = coords.map(c => c.lat.toFixed(4)).join(',');
  const lngsStr = coords.map(c => c.lng.toFixed(4)).join(',');
  
  const loadingIndicator = document.getElementById('weather-loading');
  if (loadingIndicator) loadingIndicator.style.display = 'inline-block';
  
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latsStr}&longitude=${lngsStr}&hourly=temperature_2m,wind_speed_10m,wind_direction_10m&wind_speed_unit=kn&timezone=auto`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("GRIB API fetch failed");
    
    const data = await res.json();
    state.gribData = Array.isArray(data) ? data : [data];
    
    generateTimeline();
    renderGribOverlay();
  } catch (err) {
    console.error("Failed to fetch GRIB data:", err);
  } finally {
    if (loadingIndicator) loadingIndicator.style.display = 'none';
  }
}

// Initialize all GRIB UI event listeners
export function initGribOverlay() {
  const windBtn = document.getElementById('overlay-wind-btn');
  const tempBtn = document.getElementById('overlay-temp-btn');
  const legendWind = document.getElementById('legend-wind');
  const legendTemp = document.getElementById('legend-temp');
  
  if (windBtn && tempBtn) {
    windBtn.addEventListener('click', () => {
      state.weatherOverlayType = 'wind';
      windBtn.classList.add('active');
      windBtn.style.background = 'rgba(6, 182, 212, 0.15)';
      tempBtn.classList.remove('active');
      tempBtn.style.background = 'none';
      tempBtn.style.color = 'var(--text-muted)';
      windBtn.style.color = 'var(--text-color)';
      
      if (legendWind) legendWind.style.display = 'block';
      if (legendTemp) legendTemp.style.display = 'none';
      
      renderGribOverlay();
    });
    
    tempBtn.addEventListener('click', () => {
      state.weatherOverlayType = 'temp';
      tempBtn.classList.add('active');
      tempBtn.style.background = 'rgba(6, 182, 212, 0.15)';
      windBtn.classList.remove('active');
      windBtn.style.background = 'none';
      windBtn.style.color = 'var(--text-muted)';
      tempBtn.style.color = 'var(--text-color)';
      
      if (legendWind) legendWind.style.display = 'none';
      if (legendTemp) legendTemp.style.display = 'block';
      
      renderGribOverlay();
    });
  }
  
  const playBtn = document.getElementById('timeline-play-btn');
  if (playBtn) {
    playBtn.addEventListener('click', togglePlay);
  }
}

// Activates GRIB display
export function activateGribOverlay() {
  const timeline = document.getElementById('weather-timeline-bar');
  if (timeline) timeline.style.display = 'flex';
  updateGribForCurrentBounds(true);
}

// Deactivates and cleans up GRIB layers/intervals
export function deactivateGribOverlay() {
  const timeline = document.getElementById('weather-timeline-bar');
  if (timeline) timeline.style.display = 'none';
  
  if (isPlaying) {
    togglePlay();
  }
  
  if (state.gribImageOverlay && state.map) {
    state.map.removeLayer(state.gribImageOverlay);
    state.gribImageOverlay = null;
  }
  if (state.gribBarbsLayer && state.map) {
    state.gribBarbsLayer.clearLayers();
    state.map.removeLayer(state.gribBarbsLayer);
    state.gribBarbsLayer = null;
  }
  
  state.gribData = null;
  state.gribBounds = null;
}

