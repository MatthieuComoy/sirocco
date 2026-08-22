<script lang="ts">
  import { onMount } from 'svelte';
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

  let sidebarOpen = $state(true);
  let sheetValue = $state<'closed' | 'half' | 'full'>('closed');

  onMount(() => {
    initPositionTracking();
    initAnchorAlarm();
  });

  // Mirrors the legacy setAppMode(): auto-collapse on entering navigation,
  // auto-expand on desktop when back to consultation (weather forces its own
  // wide panel once the real weather content lands in Phase 6).
  let previousMode = $appMode;
  $effect(() => {
    const mode = $appMode;
    if (mode === previousMode) return;
    if (mode === 'navigation') {
      sidebarOpen = false;
    } else if (mode === 'consultation' && $density === 'desktop') {
      sidebarOpen = true;
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
      <AnchorControl />
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
      </MapCanvas>

      <MapOverlays />
      <AlarmModal />

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
</style>
