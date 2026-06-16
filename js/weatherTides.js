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
    windSpeedEl.textContent = `${Math.round(curWeather.wind_speed_10m)} Kts`;
  }

  // Wind Dir
  const windDirEl = document.getElementById('weather-wind-dir');
  const windArrow = document.getElementById('weather-wind-arrow');
  if (curWeather.wind_direction_10m !== undefined) {
    state.currentWindDirection = curWeather.wind_direction_10m;
    if (windDirEl) windDirEl.textContent = getWindCardinal(curWeather.wind_direction_10m);
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
    baroEl.textContent = `${Math.round(curWeather.pressure_msl)} hPa`;
  }

  // Temperature
  const tempEl = document.getElementById('weather-temp');
  if (tempEl && curWeather.temperature_2m !== undefined) {
    tempEl.textContent = `${curWeather.temperature_2m.toFixed(1)} °C`;
  }

  // Wave Height
  const waveHeightEl = document.getElementById('weather-wave-height');
  if (waveHeightEl) {
    if (curMarine && curMarine.wave_height !== null && curMarine.wave_height !== undefined) {
      waveHeightEl.textContent = `${curMarine.wave_height.toFixed(2)} m`;
    } else {
      waveHeightEl.textContent = '--';
    }
  }

  // Wave Dir
  const waveDirEl = document.getElementById('weather-wave-dir');
  const waveArrow = document.getElementById('weather-wave-arrow');
  if (waveDirEl) {
    if (curMarine && curMarine.wave_direction !== null && curMarine.wave_direction !== undefined) {
      waveDirEl.textContent = getWindCardinal(curMarine.wave_direction);
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
    }
  }, 500);
}

export function drawTideChart(lat, lon, tideData) {
  const container = document.getElementById('tide-widget-content');
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
  const yMax = maxHeight + Math.max(0.1, heightDiff * 0.1);
  const yMin = Math.max(0, minHeight - Math.max(0.1, heightDiff * 0.1));
  const yScaleRange = yMax - yMin;

  const getX = (hour) => 15 + (hour / 24) * 270;
  const getY = (height) => 85 - ((height - yMin) / yScaleRange) * 70;

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

  const curX = getX(tideData.currentHour);
  const curY = getY(tideData.currentHeight);

  let extremesHtml = "";
  tideData.extremes.forEach(e => {
    const x = getX(e.hour);
    const y = getY(e.height);
    const isHigh = e.type === 'high';
    const label = isHigh ? (state.currentLang === 'fr' ? 'PM' : 'HW') : (state.currentLang === 'fr' ? 'BM' : 'LW');
    const yOffset = isHigh ? -10 : 12;
    const colorClass = isHigh ? "var(--warning-color)" : "var(--text-muted)";
    extremesHtml += `
      <circle cx="${x}" cy="${y}" r="3.5" fill="${colorClass}" />
      <text x="${x}" y="${y + yOffset}" fill="var(--text-light)" font-size="7" font-weight="600" text-anchor="middle">
        ${label}: ${e.height.toFixed(2)}m (${e.timeStr})
      </text>
    `;
  });

  let gridLines = "";
  for (let h = 3; h < 24; h += 3) {
    const x = getX(h);
    gridLines += `
      <line x1="${x}" y1="10" x2="${x}" y2="90" stroke="rgba(255, 255, 255, 0.05)" stroke-width="1" />
      <text x="${x}" y="98" fill="var(--text-muted)" font-size="6.5" text-anchor="middle">${h}h</text>
    `;
  }

  const badgeX = Math.min(230, Math.max(10, curX - 30));
  const badgeY = curY < 50 ? curY + 15 : curY - 28;

  container.innerHTML = `
    <svg width="100%" height="110" viewBox="0 0 300 110" style="overflow: visible; user-select: none;">
      <line x1="15" y1="90" x2="285" y2="90" stroke="var(--border-color)" stroke-width="1" />
      <text x="15" y="98" fill="var(--text-muted)" font-size="6.5" text-anchor="middle">0h</text>
      <text x="285" y="98" fill="var(--text-muted)" font-size="6.5" text-anchor="middle">24h</text>
      ${gridLines}

      <path d="${curvePath}" fill="none" stroke="var(--accent-color)" stroke-width="2.5" stroke-linecap="round" />
      
      ${extremesHtml}
      
      <line x1="${curX}" y1="10" x2="${curX}" y2="90" stroke="rgba(255, 255, 255, 0.25)" stroke-width="1.5" stroke-dasharray="3,3" />
      <circle cx="${curX}" cy="${curY}" r="5" fill="var(--warning-color)" stroke="var(--surface-color)" stroke-width="1" />
      
      <g transform="translate(${badgeX}, ${badgeY})">
        <rect x="0" y="0" width="60" height="18" rx="4" fill="rgba(11, 15, 25, 0.85)" stroke="var(--accent-color)" stroke-width="1" />
        <text x="30" y="12" fill="var(--accent-color)" font-size="8" font-weight="800" text-anchor="middle">${tideData.currentHeight.toFixed(2)} m</text>
      </g>
    </svg>
  `;
}
