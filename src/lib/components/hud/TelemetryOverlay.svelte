<script lang="ts">
  import { telemetry } from '../../stores/telemetry';
  import { density } from '../../stores/viewport';

  const cogStr = $derived(Math.round($telemetry.headingDeg).toString().padStart(3, '0'));
</script>

<div class="telemetry-overlay">
  {#if $density !== 'mobile'}
    <span class="field"><span class="label">Lat</span><span class="value">{$telemetry.lat.toFixed(5)}</span></span>
    <span class="field"><span class="label">Lon</span><span class="value">{$telemetry.lon.toFixed(5)}</span></span>
  {/if}
  <span class="field"><span class="label">SOG</span><span class="value">{$telemetry.speedKts.toFixed(1)} kn</span></span>
  <span class="field"><span class="label">COG</span><span class="value">{cogStr}°</span></span>
</div>

<style>
  .telemetry-overlay {
    position: absolute;
    bottom: var(--space-3);
    left: var(--space-3);
    display: flex;
    gap: var(--space-3);
    background: var(--surface-1);
    backdrop-filter: var(--glass-blur-soft);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    padding: 0.4rem 0.75rem;
    font-family: var(--font-mono);
    font-size: var(--text-xs);
    z-index: 700;
  }

  .field {
    display: flex;
    gap: 0.35rem;
    align-items: baseline;
  }

  .label {
    color: var(--color-text-muted);
  }

  .value {
    color: var(--color-text);
  }
</style>
