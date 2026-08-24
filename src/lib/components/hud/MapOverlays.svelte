<script lang="ts">
  import { appMode } from '../../stores/appMode';
  import NavigationHud from './NavigationHud.svelte';
  import DangerBanner from './DangerBanner.svelte';
  import TelemetryOverlay from './TelemetryOverlay.svelte';
</script>

{#if $appMode === 'navigation'}
  <div class="top-stack">
    <NavigationHud />
    <DangerBanner />
  </div>
{:else if $appMode === 'consultation'}
  <TelemetryOverlay />
{/if}

<style>
  .top-stack {
    position: absolute;
    top: var(--space-3);
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--space-2);
    z-index: 700;
    max-width: calc(100vw - 2 * var(--space-3));
  }
</style>
