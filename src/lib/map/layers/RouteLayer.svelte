<script lang="ts">
  import L from 'leaflet';
  import { getContext, onDestroy } from 'svelte';
  import { get } from 'svelte/store';
  import type { MapStore } from '../context';
  import { MAP_CONTEXT_KEY } from '../context';
  import { routePlan } from '../../stores/routePlan';
  import { telemetry } from '../../stores/telemetry';

  const mapStore = getContext<MapStore>(MAP_CONTEXT_KEY);

  const START_ICON = L.divIcon({
    html: '<div class="route-marker start"></div>',
    className: 'route-marker-icon',
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  });
  const DEST_ICON = L.divIcon({
    html: '<div class="route-marker dest"></div>',
    className: 'route-marker-icon',
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  });

  let polyline: L.Polyline | null = null;
  let startMarker: L.Marker | null = null;
  let destMarker: L.Marker | null = null;

  function redraw() {
    const map = get(mapStore);
    if (!map) return;

    polyline?.remove();
    startMarker?.remove();
    destMarker?.remove();
    polyline = null;
    startMarker = null;
    destMarker = null;

    const state = get(routePlan);
    if (!state.destination) return;

    const t = get(telemetry);
    const startLatLng: L.LatLngExpression = state.start ? [state.start.lat, state.start.lon] : [t.lat, t.lon];

    startMarker = L.marker(startLatLng, { icon: START_ICON }).addTo(map);
    destMarker = L.marker([state.destination.lat, state.destination.lon], { icon: DEST_ICON }).addTo(map);

    if (state.route) {
      polyline = L.polyline(state.route.coordinates, { color: '#22d3ee', weight: 4, opacity: 0.9 }).addTo(map);
      map.fitBounds(polyline.getBounds(), { padding: [40, 40] });
    }
  }

  const unsubRoutePlan = routePlan.subscribe(redraw);
  const unsubTelemetry = telemetry.subscribe(() => {
    // Only the live position matters here when no explicit start override is
    // set — redraw so the start marker follows the boat.
    if (!get(routePlan).start) redraw();
  });

  onDestroy(() => {
    unsubRoutePlan();
    unsubTelemetry();
    polyline?.remove();
    startMarker?.remove();
    destMarker?.remove();
  });
</script>

<style>
  :global(.route-marker) {
    width: 14px;
    height: 14px;
    border-radius: 50%;
    border: 2px solid white;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.5);
  }

  :global(.route-marker.start) {
    background: #22c55e;
  }

  :global(.route-marker.dest) {
    background: #ef4444;
  }
</style>
