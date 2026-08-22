<script lang="ts">
  import L from 'leaflet';
  import { getContext, onDestroy } from 'svelte';
  import { get } from 'svelte/store';
  import type { MapStore } from '../context';
  import { MAP_CONTEXT_KEY } from '../context';
  import { appMode } from '../../stores/appMode';
  import { telemetry } from '../../stores/telemetry';
  import { autoCenter } from '../../stores/autoCenter';

  const mapStore = getContext<MapStore>(MAP_CONTEXT_KEY);

  let recenterControl: L.Control | null = null;
  let dragHandlerAttached = false;

  function addRecenterControl(map: L.Map) {
    const RecenterControl = L.Control.extend({
      onAdd() {
        const container = L.DomUtil.create('div', 'leaflet-bar leaflet-control recenter-control');
        const btn = L.DomUtil.create('a', 'recenter-control-btn', container);
        btn.href = '#';
        btn.title = 'Centrer sur la position';
        btn.innerHTML = '📍';
        L.DomEvent.disableClickPropagation(btn);
        L.DomEvent.disableScrollPropagation(btn);
        L.DomEvent.on(btn, 'click', (e) => {
          L.DomEvent.preventDefault(e);
          autoCenter.set(true);
          const t = get(telemetry);
          map.setView([t.lat, t.lon], map.getZoom());
        });
        return container;
      },
    });
    recenterControl = new RecenterControl({ position: 'topleft' });
    recenterControl.addTo(map);

    map.on('dragstart', () => autoCenter.set(false));
    dragHandlerAttached = true;
  }

  // `mapStore` and `appMode` can each fire before the other is ready (the map
  // is created in MapCanvas's onMount, which runs after this component's
  // top-level subscriptions are set up) — track both explicitly instead of
  // reading a `get()` snapshot of the other store from inside one
  // subscription, which would silently miss the transition if it lands
  // before the map exists (see architecture plan §8 risk #5 in spirit).
  let currentMap: L.Map | null = null;
  let previousMode = get(appMode);
  let didEnterNavForMap = false;

  function enterNavigationView(map: L.Map) {
    const t = get(telemetry);
    map.setView([t.lat, t.lon], 15);
  }

  const unsubMap = mapStore.subscribe((map) => {
    currentMap = map;
    if (!map) return;
    if (!dragHandlerAttached) addRecenterControl(map);
    if (get(appMode) === 'navigation' && !didEnterNavForMap) {
      didEnterNavForMap = true;
      enterNavigationView(map);
    }
  });

  const unsubMode = appMode.subscribe((mode) => {
    if (currentMap && mode === 'navigation' && previousMode !== 'navigation') {
      didEnterNavForMap = true;
      enterNavigationView(currentMap);
    }
    previousMode = mode;
  });

  const unsubTelemetry = telemetry.subscribe((t) => {
    const map = get(mapStore);
    if (map && get(appMode) === 'navigation' && get(autoCenter)) {
      map.panTo([t.lat, t.lon]);
    }
  });

  onDestroy(() => {
    unsubMap();
    unsubMode();
    unsubTelemetry();
    const map = get(mapStore);
    if (recenterControl && map) map.removeControl(recenterControl);
  });
</script>

<style>
  :global(.recenter-control-btn) {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 30px;
    background: var(--surface-1);
    backdrop-filter: var(--glass-blur-soft);
    font-size: 1rem;
    text-decoration: none;
  }

  :global(.recenter-control-btn:hover) {
    background: var(--surface-2);
  }
</style>
