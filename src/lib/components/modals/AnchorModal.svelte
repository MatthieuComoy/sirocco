<script lang="ts">
  import Modal from '../ui/Modal.svelte';
  import Toggle from '../ui/Toggle.svelte';
  import Slider from '../ui/Slider.svelte';
  import { anchor, driftDistanceNm } from '../../stores/anchor';
  import { activateAnchor, deactivateAnchor, setAnchorRadius } from '../../services/anchorAlarm';

  let { open = $bindable(false) }: { open?: boolean } = $props();

  function onToggle(checked: boolean) {
    if (checked) activateAnchor();
    else deactivateAnchor();
  }
</script>

<Modal bind:open title="Alarme de mouillage">
  <div class="anchor-modal">
    <div class="row">
      <div class="status">
        <span class="dot" class:active={$anchor.active}></span>
        <span>{$anchor.active ? 'Active' : 'Inactive'}</span>
      </div>
      <Toggle checked={$anchor.active} label="Activer l'alarme de mouillage" onchange={onToggle} />
    </div>

    <Slider
      label="Rayon"
      min={0.005}
      max={0.2}
      step={0.005}
      value={$anchor.radiusNm}
      formatValue={(v) => `${v.toFixed(3)} NM`}
      oninput={setAnchorRadius}
    />

    <div class="readout">
      <div class="readout-row">
        <span>Ancre — Lat</span>
        <span class="mono">{$anchor.latLng ? $anchor.latLng.lat.toFixed(5) : '--'}</span>
      </div>
      <div class="readout-row">
        <span>Ancre — Lon</span>
        <span class="mono">{$anchor.latLng ? $anchor.latLng.lon.toFixed(5) : '--'}</span>
      </div>
      <div class="readout-row strong">
        <span>Distance de dérive</span>
        <span class="mono danger">{$anchor.active ? `${$driftDistanceNm.toFixed(3)} NM` : '--'}</span>
      </div>
    </div>

    <p class="hint">💡 Lorsque l'alarme est activée, vous pouvez faire glisser le repère rouge de l'ancre sur la carte pour affiner son positionnement.</p>
  </div>
</Modal>

<style>
  .anchor-modal {
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
  }

  .row {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .status {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    font-weight: 600;
  }

  .dot {
    width: 0.6rem;
    height: 0.6rem;
    border-radius: 50%;
    background: var(--color-text-muted);
  }

  .dot.active {
    background: var(--color-danger);
    box-shadow: 0 0 8px var(--color-danger);
  }

  .readout {
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
    padding-top: var(--space-3);
    border-top: 1px solid var(--color-border);
    font-size: var(--text-sm);
  }

  .readout-row {
    display: flex;
    justify-content: space-between;
    color: var(--color-text-muted);
  }

  .readout-row.strong {
    font-weight: 600;
    color: var(--color-text);
  }

  .mono {
    font-family: var(--font-mono);
  }

  .mono.danger {
    color: var(--color-danger);
  }

  .hint {
    font-size: var(--text-xs);
    color: var(--color-text-muted);
    background: var(--surface-2);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    padding: var(--space-2) var(--space-3);
    line-height: 1.5;
  }
</style>
