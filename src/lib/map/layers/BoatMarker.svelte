<script lang="ts">
  import L from 'leaflet';
  import { getContext, onDestroy } from 'svelte';
  import { get } from 'svelte/store';
  import type { MapStore } from '../context';
  import { MAP_CONTEXT_KEY } from '../context';
  import { telemetry } from '../../stores/telemetry';

  // Ported 1:1 from legacy/js/app.js::initMap() — sail trim (updateBoatSails)
  // is wired up in Phase 6 once wind data exists.
  const BOAT_ICON = L.divIcon({
    className: 'boat-marker-container',
    html: `
      <div class="boat-outer-ring">
        <svg id="boat-svg" class="boat-marker-svg" viewBox="0 0 100 100">
          <path class="boat-hull" d="M50,10 C62,32 64,65 62,85 L38,85 C36,65 38,32 50,10 Z" />
          <line class="boat-mast" x1="50" y1="45" x2="50" y2="85" />
          <path id="boat-mainsail" class="boat-sail" d="M50,45 C50,45 28,65 50,80 Z" />
          <path id="boat-jib" class="boat-sail" d="M50,15 C50,15 32,32 50,43 Z" />
        </svg>
      </div>
    `,
    iconSize: [52, 52],
    iconAnchor: [26, 26],
  });

  const mapStore = getContext<MapStore>(MAP_CONTEXT_KEY);

  let marker: L.Marker | null = null;
  let svgEl: SVGElement | null = null;

  const unsubMap = mapStore.subscribe((map) => {
    if (!map || marker) return;
    const initial = get(telemetry);
    marker = L.marker([initial.lat, initial.lon], {
      icon: BOAT_ICON,
      zIndexOffset: 10000,
    }).addTo(map);
    svgEl = marker.getElement()?.querySelector('#boat-svg') ?? null;
  });

  const unsubTelemetry = telemetry.subscribe((t) => {
    if (!marker) return;
    marker.setLatLng([t.lat, t.lon]);
    if (svgEl) {
      (svgEl as unknown as SVGElement).style.transform = `rotate(${t.headingDeg}deg)`;
    }
  });

  onDestroy(() => {
    unsubMap();
    unsubTelemetry();
    marker?.remove();
  });
</script>

<style>
  :global(.boat-marker-container) {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  :global(.boat-marker-svg) {
    width: 42px;
    height: 42px;
    transition: transform var(--dur-base) linear;
    filter: drop-shadow(0 2px 4px var(--color-shadow));
  }

  :global(.boat-hull) {
    fill: var(--color-accent);
    stroke: var(--surface-opaque);
    stroke-width: 2;
  }

  :global(.boat-mast) {
    stroke: var(--surface-opaque);
    stroke-width: 2;
  }

  :global(.boat-sail) {
    fill: rgba(248, 250, 252, 0.85);
    stroke: var(--surface-opaque);
    stroke-width: 1;
  }
</style>
