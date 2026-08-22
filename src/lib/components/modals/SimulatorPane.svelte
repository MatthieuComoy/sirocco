<script lang="ts">
  import { gpsMode, simulatorSettings } from '../../stores/gpsMode';
  import { setGpsMode, triggerSimulatorDrift } from '../../services/gpsSimulator';
  import Toggle from '../ui/Toggle.svelte';
  import Slider from '../ui/Slider.svelte';

  const isSimulating = $derived($gpsMode === 'simulated');

  function onToggle(checked: boolean) {
    setGpsMode(checked ? 'simulated' : 'real');
  }
</script>

<div class="simulator-pane">
  <h3>Simulateur GPS</h3>

  <div class="row">
    <span>{isSimulating ? 'Simulation active' : 'Simulation inactive'}</span>
    <Toggle checked={isSimulating} label="Simulateur GPS" onchange={onToggle} />
  </div>

  {#if isSimulating}
    <div class="controls">
      <Slider
        label="Vitesse"
        min={0}
        max={15}
        step={0.5}
        value={$simulatorSettings.speedKts}
        formatValue={(v) => `${v.toFixed(1)} kn`}
        oninput={(v) => simulatorSettings.update((s) => ({ ...s, speedKts: v }))}
      />
      <Slider
        label="Cap"
        min={0}
        max={359}
        step={5}
        value={$simulatorSettings.headingDeg}
        formatValue={(v) => `${Math.round(v)}°`}
        oninput={(v) => simulatorSettings.update((s) => ({ ...s, headingDeg: v }))}
      />
      <button class="drift-btn" onclick={triggerSimulatorDrift}>⚠️ Simuler dérive (déclencher l'alarme)</button>
    </div>
  {/if}
</div>

<style>
  .simulator-pane {
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
  }

  h3 {
    font-size: var(--text-base);
    font-weight: 600;
  }

  .row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: var(--text-sm);
    font-weight: 500;
  }

  .controls {
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
  }

  .drift-btn {
    border: 1px solid var(--color-danger);
    border-radius: var(--radius-lg);
    background: var(--color-danger-bg);
    color: var(--color-danger);
    font-weight: 600;
    font-size: var(--text-sm);
    padding: var(--space-3);
    cursor: pointer;
  }
</style>
