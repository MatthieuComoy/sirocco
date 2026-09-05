<script lang="ts">
  import { _ } from 'svelte-i18n';
  import { routePlan } from '../../stores/routePlan';
  import RoutePlanModal from '../modals/RoutePlanModal.svelte';

  let modalOpen = $state(false);
  let wasPickingStart = $state(false);

  // "Pointer sur la carte" (in RoutePlanModal) closes this modal so the map
  // is clickable; once the pick finishes or is cancelled (uiState back to
  // 'idle'), reopen it so the user lands back where they were.
  $effect(() => {
    if ($routePlan.uiState === 'picking_start') {
      modalOpen = false;
      wasPickingStart = true;
    } else if (wasPickingStart) {
      wasPickingStart = false;
      modalOpen = true;
    }
  });
</script>

<button
  class="icon-btn"
  class:active={!!$routePlan.route}
  onclick={() => (modalOpen = true)}
  aria-label={$_('route_search_btn_lbl')}
  title={$_('route_search_btn_lbl')}
>
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="10.5" cy="10.5" r="6.5" />
    <path d="M20 20l-4.7-4.7" />
  </svg>
</button>

<RoutePlanModal bind:open={modalOpen} />

<style>
  .icon-btn {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2.25rem;
    height: 2.25rem;
    border: none;
    border-radius: var(--radius-md);
    background: transparent;
    color: var(--color-text-muted);
    cursor: pointer;
    transition: background var(--dur-fast), color var(--dur-fast);
  }

  .icon-btn:hover {
    background: var(--surface-2);
    color: var(--color-text);
  }

  .icon-btn.active {
    color: var(--color-accent);
  }
</style>
