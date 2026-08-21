<script lang="ts">
  let {
    value = $bindable(0),
    min = 0,
    max = 100,
    step = 1,
    label,
    formatValue = (v: number) => String(v),
    oninput,
  }: {
    value?: number;
    min?: number;
    max?: number;
    step?: number;
    label?: string;
    formatValue?: (v: number) => string;
    oninput?: (v: number) => void;
  } = $props();

  function handleInput(e: Event) {
    value = parseFloat((e.target as HTMLInputElement).value);
    oninput?.(value);
  }
</script>

<div class="slider-field">
  {#if label}
    <div class="slider-header">
      <span class="label">{label}</span>
      <span class="value">{formatValue(value)}</span>
    </div>
  {/if}
  <!--
    touch-action: none on the thumb/track keeps a drag from being hijacked by
    an ancestor's own gesture handling (e.g. BottomSheet's drag-to-close) —
    see architecture plan §8 risk #3.
  -->
  <input
    type="range"
    class="slider"
    {min}
    {max}
    {step}
    {value}
    oninput={handleInput}
  />
</div>

<style>
  .slider-field {
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
  }

  .slider-header {
    display: flex;
    justify-content: space-between;
    font-size: var(--text-sm);
  }

  .slider-header .label {
    color: var(--color-text-muted);
  }

  .slider-header .value {
    font-family: var(--font-mono);
    font-weight: 600;
  }

  .slider {
    -webkit-appearance: none;
    appearance: none;
    width: 100%;
    height: 1.75rem;
    background: transparent;
    touch-action: none;
    cursor: pointer;
  }

  .slider::-webkit-slider-runnable-track {
    height: 0.35rem;
    border-radius: 999px;
    background: var(--surface-2);
    border: 1px solid var(--color-border);
  }

  .slider::-moz-range-track {
    height: 0.35rem;
    border-radius: 999px;
    background: var(--surface-2);
    border: 1px solid var(--color-border);
  }

  .slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    margin-top: -0.6rem;
    width: 1.5rem;
    height: 1.5rem;
    border-radius: 50%;
    background: var(--color-accent);
    border: 3px solid var(--surface-opaque);
    box-shadow: 0 2px 6px var(--color-shadow);
    touch-action: none;
  }

  .slider::-moz-range-thumb {
    width: 1.5rem;
    height: 1.5rem;
    border-radius: 50%;
    background: var(--color-accent);
    border: 3px solid var(--surface-opaque);
    box-shadow: 0 2px 6px var(--color-shadow);
    touch-action: none;
  }
</style>
