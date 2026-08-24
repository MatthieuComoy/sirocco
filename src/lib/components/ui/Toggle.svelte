<script lang="ts">
  let {
    checked = $bindable(false),
    label,
    onchange,
  }: { checked?: boolean; label?: string; onchange?: (checked: boolean) => void } = $props();

  function toggle() {
    checked = !checked;
    onchange?.(checked);
  }
</script>

<button
  type="button"
  role="switch"
  aria-checked={checked}
  aria-label={label}
  class="toggle"
  class:on={checked}
  onclick={toggle}
>
  <span class="thumb"></span>
</button>

<style>
  .toggle {
    position: relative;
    width: 2.75rem;
    height: 1.5rem;
    border-radius: 999px;
    border: 1px solid var(--color-border);
    background: var(--surface-2);
    cursor: pointer;
    padding: 0;
    flex-shrink: 0;
    transition: background var(--dur-fast) var(--ease-standard), border-color var(--dur-fast);
  }

  .toggle.on {
    background: var(--color-accent);
    border-color: var(--color-accent);
  }

  .thumb {
    position: absolute;
    top: 1px;
    left: 1px;
    width: 1.25rem;
    height: 1.25rem;
    border-radius: 50%;
    background: var(--slate-50);
    box-shadow: 0 1px 3px var(--color-shadow);
    transition: transform var(--dur-base) var(--ease-spring);
  }

  .toggle.on .thumb {
    transform: translateX(1.25rem);
  }
</style>
