<script lang="ts">
  import type { Snippet } from 'svelte';

  let { center, actions }: { center?: Snippet; actions?: Snippet } = $props();
</script>

<header class="app-header">
  <div class="brand">
    <svg class="brand-icon" viewBox="0 0 24 24" width="22" height="22">
      <path d="M12,2L4.5,20.29L5.21,21L12,18L18.79,21L19.5,20.29L12,2Z" fill="currentColor" />
    </svg>
    <span class="brand-name">Sirroco</span>
  </div>

  <div class="header-center">
    {@render center?.()}
  </div>

  <div class="header-actions">
    {@render actions?.()}
  </div>
</header>

<style>
  .app-header {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    align-items: center;
    gap: var(--space-4);
    height: 3.25rem;
    padding: 0 var(--space-4);
    background: var(--surface-1);
    backdrop-filter: var(--glass-blur);
    border-bottom: 1px solid var(--color-border);
    flex-shrink: 0;
    z-index: 1000;
  }

  .brand {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    color: var(--color-accent);
    justify-self: start;
    min-width: 0;
  }

  .brand-name {
    font-size: var(--text-lg);
    font-weight: 600;
    color: var(--color-text);
    letter-spacing: 0.02em;
    white-space: nowrap;
  }

  .header-center {
    display: flex;
    align-items: center;
    justify-content: center;
    justify-self: center;
    min-width: 0;
  }

  .header-actions {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    justify-self: end;
    min-width: 0;
  }

  @media (max-width: 639.98px) {
    .brand-name {
      display: none;
    }
  }
</style>
