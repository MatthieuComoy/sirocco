<script lang="ts">
  import { dangerWarning } from '../../stores/dangerWarning';
</script>

{#if $dangerWarning}
  <div class="danger-banner" role="alert">
    <span>{$dangerWarning}</span>
  </div>
{/if}

<style>
  .danger-banner {
    align-self: center;
    background: var(--color-danger-bg);
    border: 1px solid var(--color-danger);
    color: var(--color-danger);
    font-weight: 600;
    font-size: var(--text-sm);
    padding: var(--space-2) var(--space-4);
    border-radius: var(--radius-lg);
    box-shadow: 0 4px 20px var(--color-shadow);
    animation: pulse-danger 1.6s ease-in-out infinite;
  }

  @keyframes pulse-danger {
    0%, 100% { box-shadow: 0 4px 20px var(--color-shadow); }
    50% { box-shadow: 0 4px 20px var(--color-shadow), 0 0 0 6px var(--color-danger-bg); }
  }
</style>
