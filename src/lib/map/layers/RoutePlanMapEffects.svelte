<script lang="ts">
  import type L from 'leaflet';
  import { getContext, onDestroy } from 'svelte';
  import { get } from 'svelte/store';
  import type { MapStore } from '../context';
  import { MAP_CONTEXT_KEY } from '../context';
  import { routePlan } from '../../stores/routePlan';
  import { setStartOverride } from '../../services/routePlanning';

  const mapStore = getContext<MapStore>(MAP_CONTEXT_KEY);

  function formatCoordsLabel(lat: number, lng: number): string {
    const latDir = lat >= 0 ? 'N' : 'S';
    const lngDir = lng >= 0 ? 'E' : 'O';
    return `${Math.abs(lat).toFixed(4)}°${latDir}, ${Math.abs(lng).toFixed(4)}°${lngDir}`;
  }

  function onMapClick(e: L.LeafletMouseEvent) {
    if (get(routePlan).uiState !== 'picking_start') return;
    setStartOverride(e.latlng.lat, e.latlng.lng, formatCoordsLabel(e.latlng.lat, e.latlng.lng));
  }

  let attached = false;
  const unsubMap = mapStore.subscribe((map) => {
    if (!map || attached) return;
    attached = true;
    map.on('click', onMapClick);
  });

  onDestroy(() => {
    unsubMap();
    get(mapStore)?.off('click', onMapClick);
  });
</script>
