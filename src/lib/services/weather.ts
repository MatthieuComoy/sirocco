// Ported from legacy/js/weatherTides.js — fetch + geocoding logic, DOM writes
// replaced by store updates. Hardcoded French strings match the rest of the
// app until Phase 10 wires real i18n.
import { get } from 'svelte/store';
import { weather, tideData, type CurrentConditions } from '../stores/weather';
import { telemetry } from '../stores/telemetry';
import { calculateHaversineDistance } from './utils';
import { calculateTidesForDay } from './tides';

async function reverseGeocode(lat: number, lon: number): Promise<string> {
  let locationName = `Lat: ${lat.toFixed(4)}, Lon: ${lon.toFixed(4)}`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 3500);

  try {
    const geoUrl = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&zoom=10&accept-language=fr`;
    const res = await fetch(geoUrl, {
      headers: { 'User-Agent': 'SirrocoMarineNavigation/1.0' },
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    if (res.ok) {
      const data = await res.json();
      const addr = data?.address;
      if (addr) {
        const place = addr.city || addr.town || addr.village || addr.municipality || addr.county || addr.state || addr.country;
        if (place) {
          locationName = place;
          if (addr.country && addr.country !== place) locationName += `, ${addr.country}`;
        } else if (data.display_name) {
          locationName = data.display_name.split(',').slice(0, 2).join(',');
        }
      }
    }
  } catch (err) {
    clearTimeout(timeoutId);
    console.warn('Nominatim geocoding failed/timed out:', err);
  }

  if (!navigator.onLine) locationName += ' (Hors-ligne / Cache)';
  return locationName;
}

interface OpenMeteoWeatherResponse {
  current: {
    temperature_2m?: number;
    pressure_msl?: number;
    wind_speed_10m?: number;
    wind_direction_10m?: number;
    wind_gusts_10m?: number;
  };
}

interface OpenMeteoMarineResponse {
  current: {
    wave_height?: number;
    wave_direction?: number;
    wave_period?: number;
  };
}

function parseCurrentConditions(
  weatherData: OpenMeteoWeatherResponse,
  marineData: OpenMeteoMarineResponse | null
): CurrentConditions {
  const cw = weatherData.current;
  const cm = marineData?.current;
  return {
    windSpeedKts: cw.wind_speed_10m ?? null,
    windDirDeg: cw.wind_direction_10m ?? null,
    windGustsKts: cw.wind_gusts_10m ?? null,
    pressureMsl: cw.pressure_msl ?? null,
    tempC: cw.temperature_2m ?? null,
    waveHeightM: cm?.wave_height ?? null,
    waveDirDeg: cm?.wave_direction ?? null,
    wavePeriodS: cm?.wave_period ?? null,
  };
}

export async function fetchWeatherAndTides(lat: number, lon: number, force = false) {
  const last = get(weather).lastFetched;
  if (!force && last) {
    const dist = calculateHaversineDistance(lat, lon, last.lat, last.lon);
    if (dist < 150) return;
  }

  weather.update((w) => ({ ...w, loading: true, lastFetched: { lat, lon } }));

  try {
    const locationName = await reverseGeocode(lat, lon);
    weather.update((w) => ({ ...w, locationName }));

    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code,pressure_msl,wind_speed_10m,wind_direction_10m,wind_gusts_10m&wind_speed_unit=kn&timezone=auto`;
    const weatherRes = await fetch(weatherUrl);
    if (!weatherRes.ok) throw new Error('Weather API failed');
    const weatherData = await weatherRes.json();

    const marineUrl = `https://marine-api.open-meteo.com/v1/marine?latitude=${lat}&longitude=${lon}&current=wave_height,wave_direction,wave_period&timezone=auto`;
    let marineData = null;
    try {
      const marineRes = await fetch(marineUrl);
      if (marineRes.ok) marineData = await marineRes.json();
    } catch (e) {
      console.warn('Marine waves fetch failed:', e);
    }

    const conditions = parseCurrentConditions(weatherData, marineData);
    weather.update((w) => ({ ...w, conditions }));

    if (conditions.windDirDeg !== null) {
      telemetry.update((t) => ({ ...t, windDirectionDeg: conditions.windDirDeg }));
    }

    tideData.set(calculateTidesForDay(lat, lon, new Date()));
  } catch (error) {
    console.error('Error fetching weather/tides:', error);
    weather.update((w) => ({ ...w, locationName: 'Données indisponibles (Hors-ligne)' }));
    tideData.set(calculateTidesForDay(lat, lon, new Date()));
  } finally {
    weather.update((w) => ({ ...w, loading: false }));
  }
}
