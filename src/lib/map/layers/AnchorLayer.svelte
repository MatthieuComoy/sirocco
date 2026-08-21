<script lang="ts">
  import L from 'leaflet';
  import { getContext, onDestroy } from 'svelte';
  import { get } from 'svelte/store';
  import type { MapStore } from '../context';
  import { MAP_CONTEXT_KEY } from '../context';
  import { anchor } from '../../stores/anchor';
  import { moveAnchor } from '../../services/anchorAlarm';

  const ANCHOR_ICON = L.divIcon({
    className: 'anchor-point-marker',
    html: `
      <svg style="width: 24px; height: 24px; filter: drop-shadow(0 2px 5px rgba(0,0,0,0.5));" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2">
        <circle cx="12" cy="5" r="3" fill="#ef4444"/>
        <line x1="12" y1="8" x2="12" y2="20" />
        <line x1="6" y1="12" x2="18" y2="12" />
        <path d="M6,12 C6,18 18,18 18,12" />
      </svg>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });

  const mapStore = getContext<MapStore>(MAP_CONTEXT_KEY);

  let marker: L.Marker | null = null;
  let circle: L.Circle | null = null;

  function ensureLayers(map: L.Map, lat: number, lon: number, radiusNm: number) {
    if (!marker) {
      marker = L.marker([lat, lon], { draggable: true, icon: ANCHOR_ICON }).addTo(map);
      marker.on('drag', (e) => {
        const pos = (e.target as L.Marker).getLatLng();
        moveAnchor(pos.lat, pos.lng);
      });
    }
    if (!circle) {
      circle = L.circle([lat, lon], {
        radius: radiusNm * 1852,
        color: '#ef4444',
        fillColor: '#ef4444',
        fillOpacity: 0.15,
        weight: 1.5,
      }).addTo(map);
    }
  }

  function removeLayers() {
    marker?.remove();
    circle?.remove();
    marker = null;
    circle = null;
  }

  const unsub = anchor.subscribe((a) => {
    const map = get(mapStore);
    if (!map) return;

    if (a.active && a.latLng) {
      ensureLayers(map, a.latLng.lat, a.latLng.lon, a.radiusNm);
      marker?.setLatLng([a.latLng.lat, a.latLng.lon]);
      circle?.setLatLng([a.latLng.lat, a.latLng.lon]);
      circle?.setRadius(a.radiusNm * 1852);
    } else {
      removeLayers();
    }
  });

  onDestroy(() => {
    unsub();
    removeLayers();
  });
</script>
