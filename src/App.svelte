<script lang="ts">
  import { density } from './lib/stores/viewport';
  import MapCanvas from './lib/map/MapCanvas.svelte';
  import Header from './lib/components/layout/Header.svelte';
  import Sidebar from './lib/components/layout/Sidebar.svelte';
  import BottomSheet from './lib/components/ui/BottomSheet.svelte';

  let sidebarOpen = $state(true);
  let sheetValue = $state<'closed' | 'half' | 'full'>('closed');
</script>

<div class="app-shell">
  <Header />

  <div class="main-area">
    {#if $density !== 'mobile'}
      <Sidebar bind:open={sidebarOpen}>
        <div class="panel-placeholder">
          <p>Panneaux Calques &amp; Météo — Phase 3</p>
        </div>
      </Sidebar>
    {/if}

    <div class="map-area">
      <MapCanvas />

      {#if $density === 'mobile'}
        <BottomSheet bind:value={sheetValue} title="Sirroco">
          <div class="panel-placeholder">
            <p>Panneaux Calques &amp; Météo — Phase 3</p>
          </div>
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

  .panel-placeholder {
    padding: var(--space-4);
    color: var(--color-text-muted);
    font-size: var(--text-sm);
  }
</style>
