<script lang="ts">
  import L from 'leaflet';
  import { getContext, onDestroy } from 'svelte';
  import { get } from 'svelte/store';
  import type { MapStore } from '../context';
  import { MAP_CONTEXT_KEY } from '../context';
  import { telemetry } from '../../stores/telemetry';

  // Ported 1:1 from legacy/js/app.js::initMap().
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
  let mainsailEl: SVGElement | null = null;
  let jibEl: SVGElement | null = null;

  // Dynamic sail trimming simulator based on heading and apparent wind angle
  // — ported from legacy/js/weatherTides.js::updateBoatSails().
  function updateSails(heading: number, windDir: number | null) {
    if (!mainsailEl || !jibEl) return;

    if (windDir === null || Number.isNaN(windDir)) {
      mainsailEl.style.transform = 'scaleX(1) rotate(55deg)';
      jibEl.style.transform = 'scaleX(1) rotate(60deg)';
      mainsailEl.classList.remove('sail-flutter');
      jibEl.classList.remove('sail-flutter');
      return;
    }

    let alpha = (windDir - heading) % 360;
    if (alpha > 180) alpha -= 360;
    if (alpha < -180) alpha += 360;

    const absAlpha = Math.abs(alpha);
    const side = alpha >= 0 ? 1 : -1;

    let mainAngle = 0;
    let jibAngle = 0;
    let isFluttering = false;
    let jibSideMultiplier = 1;

    if (absAlpha < 30) {
      isFluttering = true;
    } else if (absAlpha < 55) {
      mainAngle = 5;
      jibAngle = 8;
    } else if (absAlpha < 110) {
      mainAngle = 35;
      jibAngle = 40;
    } else if (absAlpha < 155) {
      mainAngle = 60;
      jibAngle = 65;
    } else {
      mainAngle = 80;
      jibAngle = 80;
      jibSideMultiplier = -1; // wing-on-wing
    }

    mainsailEl.style.transform = `scaleX(${side}) rotate(${mainAngle}deg)`;
    jibEl.style.transform = `scaleX(${side * jibSideMultiplier}) rotate(${jibAngle}deg)`;
    mainsailEl.classList.toggle('sail-flutter', isFluttering);
    jibEl.classList.toggle('sail-flutter', isFluttering);
  }

  const unsubMap = mapStore.subscribe((map) => {
    if (!map || marker) return;
    const initial = get(telemetry);
    marker = L.marker([initial.lat, initial.lon], {
      icon: BOAT_ICON,
      zIndexOffset: 10000,
    }).addTo(map);
    const el = marker.getElement();
    svgEl = el?.querySelector('#boat-svg') ?? null;
    mainsailEl = el?.querySelector('#boat-mainsail') ?? null;
    jibEl = el?.querySelector('#boat-jib') ?? null;
    updateSails(initial.headingDeg, initial.windDirectionDeg);
  });

  const unsubTelemetry = telemetry.subscribe((t) => {
    if (!marker) return;
    marker.setLatLng([t.lat, t.lon]);
    if (svgEl) {
      (svgEl as unknown as SVGElement).style.transform = `rotate(${t.headingDeg}deg)`;
    }
    updateSails(t.headingDeg, t.windDirectionDeg);
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
    transform-origin: 50px 45px;
    transition: transform var(--dur-base) ease-out;
  }

  :global(.sail-flutter) {
    animation: sail-shake 0.12s linear infinite;
  }

  @keyframes sail-shake {
    0% { transform: rotate(0deg); }
    25% { transform: rotate(-2.5deg); }
    50% { transform: rotate(2deg); }
    75% { transform: rotate(-2deg); }
    100% { transform: rotate(0deg); }
  }
</style>
