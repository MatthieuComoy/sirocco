<script lang="ts">
  import L from 'leaflet';
  import { getContext, onDestroy } from 'svelte';
  import { get } from 'svelte/store';
  import type { MapStore } from '../context';
  import { MAP_CONTEXT_KEY } from '../context';
  import { currentTrack } from '../../stores/tracking';

  const mapStore = getContext<MapStore>(MAP_CONTEXT_KEY);

  let line: L.Polyline | null = null;

  const unsub = currentTrack.subscribe((points) => {
    const map = get(mapStore);
    if (!map) return;
    if (!line) {
      line = L.polyline([], { color: '#06b6d4', weight: 4, opacity: 0.85 }).addTo(map);
    }
    line.setLatLngs(points.map((p) => [p.lat, p.lng]));
  });

  onDestroy(() => {
    unsub();
    line?.remove();
  });
</script>
