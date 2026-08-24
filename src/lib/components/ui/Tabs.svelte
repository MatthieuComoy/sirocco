<script lang="ts">
  export interface TabDef {
    id: string;
    label: string;
  }

  let {
    tabs,
    active = $bindable(''),
  }: { tabs: TabDef[]; active?: string } = $props();
</script>

<div class="tabs" role="tablist">
  {#each tabs as tab (tab.id)}
    <button
      role="tab"
      aria-selected={active === tab.id}
      class="tab-btn"
      class:active={active === tab.id}
      onclick={() => (active = tab.id)}
    >
      {tab.label}
    </button>
  {/each}
</div>

<style>
  .tabs {
    display: flex;
    gap: var(--space-1);
    padding: var(--space-2);
    border-bottom: 1px solid var(--color-border);
  }

  .tab-btn {
    flex: 1;
    border: none;
    border-radius: var(--radius-md);
    background: transparent;
    color: var(--color-text-muted);
    font-size: var(--text-sm);
    font-weight: 500;
    padding: var(--space-2);
    cursor: pointer;
    transition: background var(--dur-fast), color var(--dur-fast);
  }

  .tab-btn:hover {
    color: var(--color-text);
  }

  .tab-btn.active {
    background: var(--color-accent-bg);
    color: var(--color-accent);
  }
</style>
