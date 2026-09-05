<script lang="ts">
  import { _ } from 'svelte-i18n';
  import { routePlan } from '../../stores/routePlan';
  import { cancelPickStartOnMap } from '../../services/routePlanning';
</script>

{#if $routePlan.uiState === 'picking_start'}
  <div class="pick-hint">
    <span>{$_('route_pick_start_hint')}</span>
    <button type="button" onclick={cancelPickStartOnMap}>{$_('cancel_btn')}</button>
  </div>
{/if}

<style>
  .pick-hint {
    position: absolute;
    top: var(--space-3);
    left: 50%;
    transform: translateX(-50%);
    z-index: 800;
    display: flex;
    align-items: center;
    gap: var(--space-3);
    background: var(--surface-overlay);
    backdrop-filter: var(--glass-blur);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
    padding: var(--space-2) var(--space-3);
    box-shadow: 0 10px 25px var(--color-shadow);
    font-size: var(--text-sm);
    max-width: calc(100vw - 2 * var(--space-3));
  }

  .pick-hint button {
    border: none;
    background: var(--surface-2);
    color: var(--color-text);
    border-radius: var(--radius-md);
    padding: var(--space-1) var(--space-3);
    font-size: var(--text-xs);
    font-weight: 600;
    cursor: pointer;
    flex-shrink: 0;
  }
</style>
