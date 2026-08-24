<script lang="ts">
  import type { Snippet } from 'svelte';

  let {
    title,
    compact = false,
    children,
  }: { title: string; compact?: boolean; children?: Snippet } = $props();
</script>

<div class="instrument-card" class:compact>
  <div class="title">{title}</div>
  <div class="body">
    {@render children?.()}
  </div>
</div>

<style>
  .instrument-card {
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
    padding: var(--space-3);
    background: var(--surface-2);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
  }

  .title {
    font-size: var(--text-xs);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--color-text-muted);
  }

  .body {
    display: flex;
    flex-direction: column;
    gap: var(--space-1);
  }

  .instrument-card.compact {
    padding: var(--space-2);
  }

  .instrument-card.compact .body {
    gap: 0;
  }
</style>
