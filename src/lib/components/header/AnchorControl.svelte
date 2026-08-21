<script lang="ts">
  import { anchor } from '../../stores/anchor';
  import AnchorModal from '../modals/AnchorModal.svelte';

  let modalOpen = $state(false);
</script>

<button
  class="icon-btn"
  class:active={$anchor.active}
  onclick={() => (modalOpen = true)}
  aria-label="Alarme de mouillage"
  title="Alarme de mouillage"
>
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="12" cy="5" r="2.5" />
    <path d="M12 7.5v12.5" />
    <path d="M8 11h8" />
    <path d="M12 20c4.42 0 8-3.58 8-8v-1M12 20c-4.42 0-8-3.58-8-8v-1" />
  </svg>
  {#if $anchor.active}<span class="badge-dot"></span>{/if}
</button>

<AnchorModal bind:open={modalOpen} />

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
    color: var(--color-danger);
  }

  .badge-dot {
    position: absolute;
    top: 0.35rem;
    right: 0.35rem;
    width: 0.4rem;
    height: 0.4rem;
    border-radius: 50%;
    background: var(--color-danger);
    box-shadow: 0 0 4px var(--color-danger);
  }
</style>
