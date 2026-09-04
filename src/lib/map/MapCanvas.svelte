<script lang="ts">
  import L from 'leaflet';
  import 'leaflet/dist/leaflet.css';
  import { onMount, onDestroy, setContext, type Snippet } from 'svelte';
  import { writable, get } from 'svelte/store';
  import { MAP_CONTEXT_KEY, type MapStore } from './context';
  import { telemetry } from '../stores/telemetry';
  import { online } from '../stores/connectivity';
  import { offlineMaps } from '../stores/offlineMaps';
  import { getInstalledMaxZoomAt } from '../services/offlineMaps';

  // Read once at mount rather than hardcoding a separate copy of the
  // fallback coordinates — a real GPS fix that lands before the map exists
  // (or a future change to the telemetry default) shouldn't require keeping
  // two coordinate pairs in sync.
  const DEFAULT_ZOOM = 13;
  const ONLINE_MAX_ZOOM = 19;

  let { children }: { children?: Snippet } = $props();

  let container: HTMLDivElement;
  const mapStore: MapStore = writable(null);
  setContext(MAP_CONTEXT_KEY, mapStore);

  let resizeObserver: ResizeObserver | undefined;
  let unsubOnline: (() => void) | undefined;
  let unsubOfflineMaps: (() => void) | undefined;

  onMount(() => {
    const t = get(telemetry);
    const map = L.map(container, {
      center: [t.lat, t.lon],
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

    // Offline, tiles only exist up to whatever zoom was actually downloaded
    // for this spot — zooming further just shows blank/black tiles since the
    // network fetch has nothing to fall back to. Capping the map's own max
    // zoom (rather than just the UI control) blocks scroll/pinch zoom too.
    const clampMaxZoom = () => {
      if (get(online)) {
        map.setMaxZoom(ONLINE_MAX_ZOOM);
        return;
      }
      const center = map.getCenter();
      const cachedMaxZoom = getInstalledMaxZoomAt(center.lat, center.lng);
      // No installed pack covers this spot: freeze at the current zoom
      // instead of guessing, so the user can still zoom back out.
      map.setMaxZoom(cachedMaxZoom ?? Math.min(map.getZoom(), ONLINE_MAX_ZOOM));
    };

    map.on('moveend', clampMaxZoom);
    unsubOnline = online.subscribe(clampMaxZoom);
    unsubOfflineMaps = offlineMaps.subscribe(clampMaxZoom);
  });

  onDestroy(() => {
    resizeObserver?.disconnect();
    unsubOnline?.();
    unsubOfflineMaps?.();
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
