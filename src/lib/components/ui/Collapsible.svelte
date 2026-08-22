<script lang="ts">
  import type { Snippet } from 'svelte';

  let {
    open = $bindable(true),
    title,
    children,
  }: { open?: boolean; title: string; children?: Snippet } = $props();
</script>

<div class="collapsible">
  <button class="header" onclick={() => (open = !open)} aria-expanded={open}>
    <span>{title}</span>
    <svg viewBox="0 0 24 24" width="14" height="14" class:rotated={open}>
      <path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
  </button>
  {#if open}
    <div class="content">
      {@render children?.()}
    </div>
  {/if}
</div>

<style>
  .collapsible {
    display: flex;
    flex-direction: column;
  }

  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border: none;
    background: none;
    color: var(--color-text-muted);
    font-size: var(--text-xs);
    text-transform: uppercase;
    letter-spacing: 0.04em;
    padding: var(--space-1) 0;
    cursor: pointer;
  }

  .header svg {
    transition: transform var(--dur-fast) var(--ease-standard);
  }

  .header svg.rotated {
    transform: rotate(180deg);
  }

  .content {
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
    padding-top: var(--space-1);
  }
</style>
