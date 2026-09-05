<script lang="ts">
  import { onMount } from 'svelte';
  import { get } from 'svelte/store';
  import { density } from './lib/stores/viewport';
  import { appMode } from './lib/stores/appMode';
  import MapCanvas from './lib/map/MapCanvas.svelte';
  import BoatMarker from './lib/map/layers/BoatMarker.svelte';
  import NavigationMapEffects from './lib/map/layers/NavigationMapEffects.svelte';
  import TrackLine from './lib/map/layers/TrackLine.svelte';
  import TrackPreviewLayer from './lib/map/layers/TrackPreviewLayer.svelte';
  import Header from './lib/components/layout/Header.svelte';
  import Sidebar from './lib/components/layout/Sidebar.svelte';
  import BottomSheet from './lib/components/ui/BottomSheet.svelte';
  import ModeSwitcher from './lib/components/header/ModeSwitcher.svelte';
  import AnchorControl from './lib/components/header/AnchorControl.svelte';
  import MapOverlays from './lib/components/hud/MapOverlays.svelte';
  import AnchorLayer from './lib/map/layers/AnchorLayer.svelte';
  import AlarmModal from './lib/components/modals/AlarmModal.svelte';
  import SidebarContent from './lib/components/sidebar/SidebarContent.svelte';
  import { initPositionTracking } from './lib/services/positionOrchestrator';
  import { initAnchorAlarm } from './lib/services/anchorAlarm';
  import { fetchWeatherAndTides } from './lib/services/weather';
  import { telemetry } from './lib/stores/telemetry';
  import GribOverlay from './lib/map/layers/GribOverlay.svelte';
  import WeatherMapEffects from './lib/map/layers/WeatherMapEffects.svelte';
  import GribControls from './lib/components/weather/GribControls.svelte';
  import GribTimeline from './lib/components/weather/GribTimeline.svelte';
  import WarningsLayer from './lib/map/layers/WarningsLayer.svelte';
  import { loadAllWarnings } from './lib/services/pingWarnings';
  import SettingsControl from './lib/components/header/SettingsControl.svelte';
  import ConnectivityBadge from './lib/components/header/ConnectivityBadge.svelte';
  import { theme } from './lib/stores/theme';
  import { initSimOptionsSync } from './lib/services/gpsSimulator';
  import { initConnectivity } from './lib/services/connectivity';
  import { initOfflineMaps } from './lib/services/offlineMaps';
  import { initRoutePlanningData } from './lib/services/routePlanning';
  import RouteSearchControl from './lib/components/header/RouteSearchControl.svelte';
  import RouteLayer from './lib/map/layers/RouteLayer.svelte';
  import RoutePlanMapEffects from './lib/map/layers/RoutePlanMapEffects.svelte';
  import RoutePickHintBanner from './lib/components/hud/RoutePickHintBanner.svelte';

  let sidebarOpen = $state(true);
  let sheetValue = $state<'closed' | 'half' | 'full'>('closed');

  $effect(() => {
    document.body.setAttribute('data-theme', $theme);
  });

  onMount(() => {
    initPositionTracking();
    initAnchorAlarm();
    initSimOptionsSync();
    initConnectivity();
    // Needed globally (not just when the offline-maps panel is open) so the
    // live map can cap zoom to what's actually cached as soon as the app
    // goes offline, even if the user never opened that panel this session.
    initOfflineMaps();

    // Lazy-load overlays/heavy APIs to prioritize the base map render first —
    // same stagger as the legacy app (js/app.js DOMContentLoaded: 150ms then
    // 850ms) so the map still paints immediately on slow connections.
    setTimeout(() => {
      const t = get(telemetry);
      fetchWeatherAndTides(t.lat, t.lon);
    }, 150);

    setTimeout(() => {
      loadAllWarnings();
    }, 850);

    setTimeout(() => {
      initRoutePlanningData();
    }, 1500);
  });

  // Mirrors the legacy setAppMode(): auto-collapse on entering navigation,
  // auto-expand for consultation/weather.
  let previousMode = $appMode;
  $effect(() => {
    const mode = $appMode;
    if (mode === previousMode) return;
    if (mode === 'navigation') {
      sidebarOpen = false;
    } else if (mode === 'consultation' && $density === 'desktop') {
      sidebarOpen = true;
    } else if (mode === 'weather') {
      if ($density === 'mobile') {
        if (sheetValue === 'closed') sheetValue = 'half';
      } else {
        sidebarOpen = true;
      }
    }
    previousMode = mode;
  });
</script>

<div class="app-shell">
  <Header>
    {#snippet center()}
      <ModeSwitcher />
    {/snippet}
    {#snippet actions()}
      <ConnectivityBadge />
      <AnchorControl />
      <RouteSearchControl />
      <SettingsControl />
    {/snippet}
  </Header>

  <div class="main-area">
    {#if $density !== 'mobile'}
      <Sidebar bind:open={sidebarOpen}>
        <SidebarContent />
      </Sidebar>
    {/if}

    <div class="map-area">
      <MapCanvas>
        <BoatMarker />
        <NavigationMapEffects />
        <AnchorLayer />
        <TrackLine />
        <TrackPreviewLayer />
        <GribOverlay />
        <WeatherMapEffects />
        {#if $appMode !== 'weather'}
          <WarningsLayer />
        {/if}
        <RouteLayer />
        <RoutePlanMapEffects />
      </MapCanvas>

      <MapOverlays />
      <RoutePickHintBanner />
      <AlarmModal />

      {#if $appMode === 'weather'}
        <div class="weather-floating" class:mobile={$density === 'mobile'}>
          <GribControls />
          <GribTimeline />
        </div>
      {/if}

      {#if $density === 'mobile'}
        <BottomSheet bind:value={sheetValue} title="Sirroco">
          <SidebarContent />
        </BottomSheet>
      {/if}
    </div>
  </div>
</div>

<style>
  .app-shell {
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .main-area {
    position: relative;
    flex: 1;
    display: flex;
    min-height: 0;
  }

  .map-area {
    position: relative;
    flex: 1;
    min-width: 0;
  }

  .weather-floating {
    position: absolute;
    left: var(--space-3);
    right: var(--space-3);
    bottom: var(--space-3);
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: var(--space-2);
    z-index: 700;
    pointer-events: none;
  }

  .weather-floating :global(> *) {
    pointer-events: auto;
  }

  .weather-floating.mobile {
    bottom: calc(2.75rem + var(--space-2));
  }
</style>
