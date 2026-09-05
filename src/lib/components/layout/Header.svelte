<script lang="ts">
  import type { Snippet } from 'svelte';

  let { center, actions }: { center?: Snippet; actions?: Snippet } = $props();
</script>

<header class="app-header">
  <div class="header-left">
    <div class="brand">
      <svg class="brand-icon" viewBox="0 0 24 24" width="22" height="22">
        <path d="M12,2L4.5,20.29L5.21,21L12,18L18.79,21L19.5,20.29L12,2Z" fill="currentColor" />
      </svg>
      <span class="brand-name">Sirroco</span>
    </div>

    <div class="header-center">
      {@render center?.()}
    </div>
  </div>

  <div class="header-actions">
    {@render actions?.()}
  </div>
</header>

<style>
  .app-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--space-4);
    height: 3.25rem;
    padding: 0 var(--space-4);
    background: var(--surface-1);
    backdrop-filter: var(--glass-blur);
    border-bottom: 1px solid var(--color-border);
    flex-shrink: 0;
    z-index: 1000;
    /* Lets ModeSwitcher/ConnectivityBadge hide their text labels based on
       the header's own rendered width rather than the viewport's — the
       mode-switcher labels + an offline badge + the action icons can
       together overflow their flex boxes well above the JS `density`
       store's mobile breakpoint (which only tracks viewport width). */
    container: app-header / inline-size;
  }

  /* Brand + mode switcher grouped on the left rather than the switcher
     centered in its own column — a centered switcher fights the actions
     group for space as soon as more icons (or a wide offline badge) land
     there, which is exactly what caused past overlaps. Grouping them left
     leaves the actions group the entire rest of the bar on the right. */
  .header-left {
    display: flex;
    align-items: center;
    gap: var(--space-4);
    min-width: 0;
    overflow: hidden;
  }

  .brand {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    color: var(--color-accent);
    flex-shrink: 0;
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
    min-width: 0;
  }

  .header-actions {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    flex-shrink: 0;
  }

  @media (max-width: 639.98px) {
    .brand-name {
      display: none;
    }
  }

  /* Header's own width, not the viewport's — see .app-header's `container`. */
  @container app-header (max-width: 900px) {
    .brand-name {
      display: none;
    }
  }
</style>
