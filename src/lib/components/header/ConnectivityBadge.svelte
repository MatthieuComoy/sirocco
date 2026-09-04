<script lang="ts">
  import { _ } from 'svelte-i18n';
  import { online } from '../../stores/connectivity';
  import { density } from '../../stores/viewport';
</script>

{#if !$online}
  <div class="badge" title={$_('offline_badge')}>
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
      <line x1="1" y1="1" x2="23" y2="23" />
      <path d="M16.72 11.06a10.94 10.94 0 0 1 2.28 1.49" />
      <path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39" />
      <path d="M10.71 5.05A16 16 0 0 1 22.58 9" />
      <path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88" />
      <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
      <line x1="12" y1="20" x2="12.01" y2="20" />
    </svg>
    {#if $density !== 'mobile'}<span>{$_('offline_badge')}</span>{/if}
  </div>
{/if}

<style>
  .badge {
    display: flex;
    align-items: center;
    gap: 0.35rem;
    padding: 0.3rem 0.6rem;
    border-radius: var(--radius-md);
    background: var(--color-warning-bg);
    color: var(--color-warning);
    font-size: var(--text-xs);
    font-weight: 700;
    letter-spacing: 0.03em;
    text-transform: uppercase;
  }

  .badge svg {
    flex-shrink: 0;
  }
</style>
