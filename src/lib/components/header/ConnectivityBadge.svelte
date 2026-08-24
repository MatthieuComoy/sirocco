<script lang="ts">
  import { _ } from 'svelte-i18n';
  import { online } from '../../stores/connectivity';
  import { density } from '../../stores/viewport';
</script>

{#if !$online}
  <div class="badge" title={$_('offline_badge')}>
    <span class="dot"></span>
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
    background: var(--color-danger-bg);
    color: var(--color-danger);
    font-size: var(--text-xs);
    font-weight: 700;
    letter-spacing: 0.03em;
    text-transform: uppercase;
  }

  .dot {
    width: 0.4rem;
    height: 0.4rem;
    border-radius: 50%;
    background: var(--color-danger);
    box-shadow: 0 0 4px var(--color-danger);
  }
</style>
