<script lang="ts">
  import { _ } from 'svelte-i18n';
  import PortSearchModal from '../modals/PortSearchModal.svelte';

  let modalOpen = $state(false);
</script>

<button
  class="icon-btn"
  onclick={() => (modalOpen = true)}
  aria-label={$_('port_search_title')}
  title={$_('port_search_title')}
>
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="11" cy="11" r="7" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
</button>

<PortSearchModal bind:open={modalOpen} />

<style>
  .icon-btn {
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
</style>
