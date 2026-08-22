<script lang="ts">
  import L from 'leaflet';
  import { getContext, onDestroy } from 'svelte';
  import { get } from 'svelte/store';
  import type { MapStore } from '../context';
  import { MAP_CONTEXT_KEY } from '../context';
  import { grib } from '../../stores/grib';
  import { GRIB_GRID_SIZE, getWindBarbSVG, renderHeatmapDataUrl } from '../../services/grib';

  const mapStore = getContext<MapStore>(MAP_CONTEXT_KEY);

  let imageOverlay: L.ImageOverlay | null = null;
  let barbsLayer: L.LayerGroup | null = null;

  function clearLayers() {
    imageOverlay?.remove();
    imageOverlay = null;
    barbsLayer?.clearLayers();
    barbsLayer?.remove();
    barbsLayer = null;
  }

  const unsub = grib.subscribe((g) => {
    const map = get(mapStore);
    if (!map) return;

    if (!g.active || !g.data || g.data.length === 0 || !g.bounds) {
      clearLayers();
      return;
    }

    const timeIdx = g.activeTimeIndex;
    const gridValues = g.data.map((loc) =>
      g.overlayType === 'wind' ? loc.hourly.wind_speed_10m[timeIdx] ?? 0 : loc.hourly.temperature_2m[timeIdx] ?? 0
    );
    const dataUrl = renderHeatmapDataUrl(gridValues, g.overlayType);
    const leafletBounds = L.latLngBounds([g.bounds.south, g.bounds.west], [g.bounds.north, g.bounds.east]);

    if (imageOverlay) {
      imageOverlay.setUrl(dataUrl);
      imageOverlay.setBounds(leafletBounds);
    } else {
      imageOverlay = L.imageOverlay(dataUrl, leafletBounds, { opacity: 0.5, interactive: false, zIndex: 350 }).addTo(map);
    }

    if (!barbsLayer) {
      barbsLayer = L.layerGroup().addTo(map);
    } else {
      barbsLayer.clearLayers();
    }

    if (g.overlayType === 'wind') {
      const size = GRIB_GRID_SIZE;
      const lats: number[] = [];
      const lngs: number[] = [];
      for (let i = 0; i < size; i++) {
        lats.push(g.bounds.south + (i / (size - 1)) * (g.bounds.north - g.bounds.south));
        lngs.push(g.bounds.west + (i / (size - 1)) * (g.bounds.east - g.bounds.west));
      }

      for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
          const idx = r * size + c;
          const speed = g.data[idx]?.hourly.wind_speed_10m[timeIdx] ?? 0;
          const dir = g.data[idx]?.hourly.wind_direction_10m[timeIdx] ?? 0;
          if (speed < 2) continue;

          const icon = L.divIcon({
            html: getWindBarbSVG(speed, dir),
            className: 'wind-barb-div-icon',
            iconSize: [28, 28],
            iconAnchor: [16, 28],
          });
          L.marker([lats[r], lngs[c]], { icon, interactive: false }).addTo(barbsLayer!);
        }
      }
    }
  });

  onDestroy(() => {
    unsub();
    clearLayers();
  });
</script>
