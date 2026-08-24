<script lang="ts">
  import type { Snippet } from 'svelte';

  let {
    open = $bindable(true),
    children,
  }: { open?: boolean; children?: Snippet } = $props();
</script>

<!--
  Desktop: permanent drawer, pushes the map (width animates, never fully hides).
  Tablet: overlay drawer — same markup, CSS makes it float above the map instead
  of pushing it, so opening it doesn't shrink the viewport on a mid-size screen.
-->
<aside class="sidebar" class:collapsed={!open} aria-hidden={!open}>
  <div class="sidebar-inner">
    {@render children?.()}
  </div>
</aside>

<button
  class="collapse-toggle"
  class:collapsed={!open}
  onclick={() => (open = !open)}
  aria-label={open ? 'Réduire le panneau' : 'Ouvrir le panneau'}
>
  <svg viewBox="0 0 24 24" width="18" height="18">
    <path d="M15 6l-6 6 6 6" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
  </svg>
</button>

<style>
  .sidebar {
    position: relative;
    width: 22rem;
    max-width: 88vw;
    flex-shrink: 0;
    background: var(--surface-1);
    backdrop-filter: var(--glass-blur);
    border-right: 1px solid var(--color-border);
    transition: width var(--dur-slow) var(--ease-standard), margin-left var(--dur-slow) var(--ease-standard);
    overflow: hidden;
  }

  .sidebar.collapsed {
    width: 0;
    border-right-color: transparent;
  }

  .sidebar-inner {
    width: 22rem;
    max-width: 88vw;
    height: 100%;
    overflow-y: auto;
  }

  .collapse-toggle {
    position: absolute;
    top: 50%;
    left: 22rem;
    transform: translate(-50%, -50%);
    width: 1.75rem;
    height: 3rem;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--surface-1);
    backdrop-filter: var(--glass-blur-soft);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    color: var(--color-text-muted);
    cursor: pointer;
    transition: left var(--dur-slow) var(--ease-standard), color var(--dur-fast);
    z-index: 1210;
  }

  .collapse-toggle:hover {
    color: var(--color-accent);
  }

  .collapse-toggle.collapsed {
    left: 0;
  }

  .collapse-toggle.collapsed svg {
    transform: rotate(180deg);
  }

  /* Tablet: float the drawer above the map instead of pushing the layout. */
  @media (min-width: 640px) and (max-width: 1023.98px) {
    .sidebar {
      position: absolute;
      inset: 0 auto 0 0;
      /* Above Leaflet's control panes (z-index: 1000) so the floating drawer
         isn't pierced by the zoom control sharing the same top-left corner. */
      z-index: 1200;
      box-shadow: 4px 0 24px var(--color-shadow);
    }
  }
</style>
