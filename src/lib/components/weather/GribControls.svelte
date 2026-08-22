<script lang="ts">
  import { grib } from '../../stores/grib';
  import { setOverlayType } from '../../services/grib';

  const WIND_LEGEND = [
    { color: 'rgb(34,197,94)', label: '0-5' },
    { color: 'rgb(163,230,53)', label: '5-10' },
    { color: 'rgb(234,179,8)', label: '10-15' },
    { color: 'rgb(249,115,22)', label: '15-20' },
    { color: 'rgb(239,68,68)', label: '20-30' },
    { color: 'rgb(168,85,247)', label: '30+' },
  ];

  const TEMP_LEGEND = [
    { color: 'rgb(59,130,246)', label: '≤0°' },
    { color: 'rgb(34,211,238)', label: '0-10°' },
    { color: 'rgb(34,197,94)', label: '10-18°' },
    { color: 'rgb(234,179,8)', label: '18-25°' },
    { color: 'rgb(249,115,22)', label: '25-32°' },
    { color: 'rgb(239,68,68)', label: '32°+' },
  ];

  const legend = $derived($grib.overlayType === 'wind' ? WIND_LEGEND : TEMP_LEGEND);
</script>

<div class="grib-controls">
  <div class="segmented">
    <button class:active={$grib.overlayType === 'wind'} onclick={() => setOverlayType('wind')}>Vent</button>
    <button class:active={$grib.overlayType === 'temp'} onclick={() => setOverlayType('temp')}>Température</button>
  </div>

  <div class="legend">
    {#each legend as item (item.label)}
      <div class="legend-item">
        <span class="swatch" style:background={item.color}></span>
        <span>{item.label}</span>
      </div>
    {/each}
  </div>
</div>

<style>
  .grib-controls {
    align-self: flex-start;
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
    background: var(--surface-overlay);
    backdrop-filter: var(--glass-blur);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
    padding: var(--space-2);
    box-shadow: 0 4px 20px var(--color-shadow);
  }

  .segmented {
    display: flex;
    background: var(--surface-2);
    border-radius: var(--radius-md);
    padding: 0.15rem;
  }

  .segmented button {
    flex: 1;
    border: none;
    background: transparent;
    color: var(--color-text-muted);
    font-size: var(--text-xs);
    font-weight: 600;
    padding: 0.35rem 0.5rem;
    border-radius: var(--radius-sm);
    cursor: pointer;
  }

  .segmented button.active {
    background: var(--color-accent-bg);
    color: var(--color-accent);
  }

  .legend {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem;
  }

  .legend-item {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    font-size: 0.65rem;
    color: var(--color-text-muted);
  }

  .swatch {
    width: 0.6rem;
    height: 0.6rem;
    border-radius: 0.15rem;
  }
</style>
