import { get } from 'svelte/store';
import { online } from '../stores/connectivity';
import { weather } from '../stores/weather';
import { fetchWeatherAndTides } from './weather';

let started = false;

// Mirrors the legacy app.js updateOnlineStatus(): only refetches weather on a
// real 'online' event (reconnection), never on initial load.
export function initConnectivity() {
  if (started) return;
  started = true;

  function handleOnline() {
    online.set(true);
    const last = get(weather).lastFetched;
    if (last) fetchWeatherAndTides(last.lat, last.lon, true);
  }

  function handleOffline() {
    online.set(false);
  }

  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOffline);
}
