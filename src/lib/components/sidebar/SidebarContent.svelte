<script lang="ts">
  import Tabs from '../ui/Tabs.svelte';
  import TrackingPanel from './TrackingPanel.svelte';

  let active = $state('layers');
</script>

<div class="sidebar-content">
  <Tabs
    tabs={[
      { id: 'layers', label: 'Calques & Traces' },
      { id: 'weather', label: 'Météo' },
    ]}
    bind:active
  />

  <div class="panel">
    {#if active === 'layers'}
      <TrackingPanel />
    {:else}
      <div class="placeholder">
        <p>Prévisions météo, marées et alertes de navigation — Phase 6/7.</p>
      </div>
    {/if}
  </div>
</div>

<style>
  .sidebar-content {
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .panel {
    flex: 1;
    overflow-y: auto;
  }

  .placeholder {
    padding: var(--space-4);
    color: var(--color-text-muted);
    font-size: var(--text-sm);
  }
</style>
