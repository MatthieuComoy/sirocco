<script lang="ts">
  import L from 'leaflet';
  import { getContext, onDestroy } from 'svelte';
  import { get } from 'svelte/store';
  import type { MapStore } from '../context';
  import { MAP_CONTEXT_KEY } from '../context';
  import { appMode } from '../../stores/appMode';
  import { activateGribOverlay, deactivateGribOverlay, fetchGribForBounds, getWeatherDataAtLatLng, toBoundsLike } from '../../services/grib';

  const mapStore = getContext<MapStore>(MAP_CONTEXT_KEY);

  let debounceTimer: ReturnType<typeof setTimeout> | null = null;
  let attached = false;

  function onMoveEnd(map: L.Map) {
    if (get(appMode) !== 'weather') return;
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => fetchGribForBounds(toBoundsLike(map.getBounds())), 800);
  }

  function onMapClick(map: L.Map, e: L.LeafletMouseEvent) {
    if (get(appMode) !== 'weather') return;
    const weatherAtPoint = getWeatherDataAtLatLng(e.latlng.lat, e.latlng.lng);
    if (!weatherAtPoint) return;

    const latDir = e.latlng.lat >= 0 ? 'N' : 'S';
    const lngDir = e.latlng.lng >= 0 ? 'E' : 'O';
    const content = `
      <div style="font-size: 0.8rem; line-height: 1.5; font-family: var(--font-mono), monospace;">
        <strong>${Math.abs(e.latlng.lat).toFixed(4)}°${latDir}, ${Math.abs(e.latlng.lng).toFixed(4)}°${lngDir}</strong><br/>
        Vent : ${weatherAtPoint.windSpeed} kn (${Math.round(weatherAtPoint.windDir)}°)<br/>
        Température : ${weatherAtPoint.temp}°C
      </div>
    `;
    L.popup().setLatLng(e.latlng).setContent(content).openOn(map);
  }

  // See NavigationMapEffects.svelte for why both stores are tracked
  // explicitly instead of reading a get() snapshot of the other from inside
  // a single subscription — that silently misses the transition if the map
  // isn't mounted yet when it fires.
  let currentMap: L.Map | null = null;
  let syncedGribForMap = false;

  function syncGribToMode(map: L.Map, mode: string) {
    if (mode === 'weather') {
      activateGribOverlay(toBoundsLike(map.getBounds()));
    } else {
      deactivateGribOverlay();
    }
  }

  const unsubMap = mapStore.subscribe((map) => {
    currentMap = map;
    if (!map || attached) return;
    attached = true;
    map.on('moveend zoomend', () => onMoveEnd(map));
    map.on('click', (e) => onMapClick(map, e));
    if (!syncedGribForMap) {
      syncedGribForMap = true;
      syncGribToMode(map, get(appMode));
    }
  });

  const unsubMode = appMode.subscribe((mode) => {
    if (!currentMap) return;
    syncedGribForMap = true;
    syncGribToMode(currentMap, mode);
  });

  onDestroy(() => {
    unsubMap();
    unsubMode();
    if (debounceTimer) clearTimeout(debounceTimer);
  });
</script>
