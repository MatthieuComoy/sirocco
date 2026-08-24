<script lang="ts">
  let {
    label,
    value,
    unit = '',
  }: { label: string; value: string; unit?: string } = $props();
</script>

<div class="metric">
  <span class="label">{label}</span>
  <span class="value">{value}{#if unit}<span class="unit">{unit}</span>{/if}</span>
</div>

<style>
  .metric {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.1rem;
    min-width: 3.5rem;
  }

  .label {
    font-size: 0.65rem;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: var(--color-text-muted);
  }

  .value {
    font-family: var(--font-mono);
    font-size: var(--text-lg);
    font-weight: 600;
    color: var(--color-text);
  }

  .unit {
    font-size: var(--text-xs);
    color: var(--color-text-muted);
    margin-left: 0.15rem;
  }
</style>
