<script lang="ts">
  import L from 'leaflet';
  import { getContext, onDestroy } from 'svelte';
  import { get } from 'svelte/store';
  import type { MapStore } from '../context';
  import { MAP_CONTEXT_KEY } from '../context';
  import { trackPreviewRequest } from '../../stores/trackPreview';
  import { autoCenter } from '../../stores/autoCenter';

  const mapStore = getContext<MapStore>(MAP_CONTEXT_KEY);

  let line: L.Polyline | null = null;
  let clearTimer: ReturnType<typeof setTimeout> | null = null;

  const unsub = trackPreviewRequest.subscribe((track) => {
    const map = get(mapStore);
    if (!map) return;

    line?.remove();
    line = null;
    if (clearTimer) clearTimeout(clearTimer);

    if (!track) return;

    const latLngs: L.LatLngExpression[] = track.coordinates.map((p) => [p.lat, p.lng]);
    line = L.polyline(latLngs, { color: '#ef4444', weight: 3, dashArray: '5, 5' }).addTo(map);
    map.fitBounds(line.getBounds());
    autoCenter.set(false);

    clearTimer = setTimeout(() => {
      line?.remove();
      line = null;
      trackPreviewRequest.set(null);
    }, 12000);
  });

  onDestroy(() => {
    unsub();
    if (clearTimer) clearTimeout(clearTimer);
    line?.remove();
  });
</script>
