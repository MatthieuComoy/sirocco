<script lang="ts">
  import L from 'leaflet';
  import 'leaflet/dist/leaflet.css';
  import { onMount, onDestroy, setContext, type Snippet } from 'svelte';
  import { writable } from 'svelte/store';
  import { MAP_CONTEXT_KEY, type MapStore } from './context';

  // Toulon — same default the legacy app used (js/state.js: currentLat/currentLon).
  const DEFAULT_CENTER: L.LatLngExpression = [43.1167, 5.9333];
  const DEFAULT_ZOOM = 13;

  let { children }: { children?: Snippet } = $props();

  let container: HTMLDivElement;
  const mapStore: MapStore = writable(null);
  setContext(MAP_CONTEXT_KEY, mapStore);

  let resizeObserver: ResizeObserver | undefined;

  onMount(() => {
    const map = L.map(container, {
      center: DEFAULT_CENTER,
      zoom: DEFAULT_ZOOM,
      zoomControl: true,
      // Canvas rendering scales far better than SVG once dozens of warning/danger
      // polygons and polylines are on screen at once (no per-shape DOM node).
      preferCanvas: true,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    L.tileLayer('https://tiles.openseamap.org/seamark/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenSeaMap',
    }).addTo(map);

    mapStore.set(map);

    // Replaces the legacy app's magic setTimeout(0/100/350) chain after sidebar
    // toggles: this reacts to the actual end of any layout change (sidebar open/
    // close, orientation change, virtual keyboard) instead of guessing a delay.
    resizeObserver = new ResizeObserver(() => map.invalidateSize());
    resizeObserver.observe(container);
  });

  onDestroy(() => {
    resizeObserver?.disconnect();
    mapStore.subscribe((map) => map?.remove())();
  });
</script>

<div class="map-canvas" bind:this={container}>
  {@render children?.()}
</div>

<style>
  .map-canvas {
    position: relative;
    height: 100%;
    width: 100%;
    background: var(--color-bg);
  }

  /* Leaflet's own control chrome, restyled to match the glass system. */
  .map-canvas :global(.leaflet-control-zoom a) {
    background: var(--surface-1);
    backdrop-filter: var(--glass-blur-soft);
    color: var(--color-text);
    border-color: var(--color-border) !important;
  }

  .map-canvas :global(.leaflet-control-zoom a:hover) {
    background: var(--surface-2);
    color: var(--color-accent);
  }

  .map-canvas :global(.leaflet-bar) {
    border: 1px solid var(--color-border) !important;
    box-shadow: 0 4px 15px var(--color-shadow) !important;
  }

  .map-canvas :global(.leaflet-container) {
    background: var(--color-bg);
  }

  /* Warning/danger popups (bound in WarningsLayer.svelte etc.) inherit
     var(--color-text) for their own content, which is near-white in dark
     theme — Leaflet's default white popup chrome left that text illegible
     until it was themed here too. */
  .map-canvas :global(.leaflet-popup-content-wrapper) {
    background: var(--surface-opaque);
    color: var(--color-text);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    box-shadow: 0 10px 25px var(--color-shadow);
  }

  .map-canvas :global(.leaflet-popup-tip) {
    background: var(--surface-opaque);
  }

  .map-canvas :global(.leaflet-popup-close-button) {
    color: var(--color-text-muted) !important;
  }
</style>
