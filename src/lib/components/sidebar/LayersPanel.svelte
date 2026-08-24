<script lang="ts">
  import WarningsFilterPanel from './WarningsFilterPanel.svelte';
  import TrackingPanel from './TrackingPanel.svelte';
</script>

<div class="layers-panel">
  <div class="section">
    <WarningsFilterPanel />
  </div>
  <TrackingPanel />
</div>

<style>
  .layers-panel {
    display: flex;
    flex-direction: column;
  }

  .section {
    padding: var(--space-4) var(--space-4) 0;
  }
</style>
