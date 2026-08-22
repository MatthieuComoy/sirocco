<script lang="ts">
  import Modal from '../ui/Modal.svelte';
  import GeneralPane from './GeneralPane.svelte';
  import BoatPane from './BoatPane.svelte';
  import SimulatorPane from './SimulatorPane.svelte';
  import OfflineMapsPanel from './OfflineMapsPanel.svelte';
  import { simOptionsEnabled } from '../../stores/settings';

  let { open = $bindable(false) }: { open?: boolean } = $props();

  type TabId = 'general' | 'boat' | 'simulator' | 'offline';
  let active = $state<TabId>('general');

  const TABS: { id: TabId; label: string; icon: string }[] = [
    { id: 'general', label: 'Général', icon: '⚙️' },
    { id: 'boat', label: 'Mon Bateau', icon: '⛵' },
    { id: 'simulator', label: 'Simulateur GPS', icon: '🎮' },
    { id: 'offline', label: 'Cartes Hors-ligne', icon: '🗺️' },
  ];

  // Disabling simulation options while that tab is open bounces you back to
  // General instead of leaving an inaccessible pane selected.
  $effect(() => {
    if (active === 'simulator' && !$simOptionsEnabled) active = 'general';
  });
</script>

<Modal bind:open title="Centre de Contrôle" size="lg" noBodyPadding>
  <div class="control-center">
    <div class="tabs-sidebar">
      {#each TABS as tab (tab.id)}
        {#if tab.id !== 'simulator' || $simOptionsEnabled}
          <button class="tab-btn" class:active={active === tab.id} onclick={() => (active = tab.id)}>
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        {/if}
      {/each}
    </div>

    <div class="pane-container">
      {#if active === 'general'}
        <GeneralPane />
      {:else if active === 'boat'}
        <BoatPane />
      {:else if active === 'simulator'}
        <SimulatorPane />
      {:else if active === 'offline'}
        <OfflineMapsPanel />
      {/if}
    </div>
  </div>
</Modal>

<style>
  .control-center {
    display: flex;
    width: 100%;
    min-height: 26rem;
    max-height: 70vh;
  }

  .tabs-sidebar {
    display: flex;
    flex-direction: column;
    gap: var(--space-1);
    width: 12rem;
    flex-shrink: 0;
    padding: var(--space-3);
    border-right: 1px solid var(--color-border);
    overflow-y: auto;
  }

  .tab-btn {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    border: none;
    border-radius: var(--radius-md);
    background: transparent;
    color: var(--color-text-muted);
    font-size: var(--text-sm);
    text-align: left;
    padding: var(--space-2) var(--space-3);
    cursor: pointer;
  }

  .tab-btn:hover {
    color: var(--color-text);
  }

  .tab-btn.active {
    background: var(--color-accent-bg);
    color: var(--color-accent);
    font-weight: 600;
  }

  .pane-container {
    flex: 1;
    min-width: 0;
    padding: var(--space-4);
    overflow-y: auto;
  }

  @media (max-width: 639.98px) {
    .control-center {
      flex-direction: column;
      max-height: 80vh;
    }

    .tabs-sidebar {
      flex-direction: row;
      width: 100%;
      overflow-x: auto;
      border-right: none;
      border-bottom: 1px solid var(--color-border);
    }

    .tab-btn span:last-child {
      white-space: nowrap;
    }
  }
</style>
