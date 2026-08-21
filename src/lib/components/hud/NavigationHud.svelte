<script lang="ts">
  import { telemetry } from '../../stores/telemetry';
  import { boatProfile } from '../../stores/boatProfile';
  import { navigationSession, navigationDurationStr } from '../../stores/navigationSession';
  import { density } from '../../stores/viewport';
  import { getSimulatedDepth } from '../../services/utils';
  import { switchAppMode } from '../../services/appModeController';
  import HudMetric from './HudMetric.svelte';

  let showDetails = $state(false);

  const depth = $derived(getSimulatedDepth($telemetry.lat, $telemetry.lon));
  const distanceNm = $derived($navigationSession.distanceMeters / 1852);
  const cogStr = $derived(Math.round($telemetry.headingDeg).toString().padStart(3, '0'));

  // Wind is a fixed placeholder until Phase 6 wires real weather data — matches
  // the legacy HUD, which hardcoded "12 kts" / 290° until then too.
  const WIND_SPEED_KTS = 12;
  const WIND_FROM_DEG = 290;
  const relativeWindDeg = $derived(WIND_FROM_DEG - $telemetry.headingDeg);
</script>

<div class="hud">
  <div class="hud-boat-name">{$boatProfile.name}</div>

  <div class="hud-metrics">
    <HudMetric label="SOG" value={$telemetry.speedKts.toFixed(1)} unit="kn" />
    <HudMetric label="COG" value={cogStr} unit="°" />
    <HudMetric label="Sondeur" value={depth.toFixed(1)} unit="m" />

    {#if $density !== 'mobile' || showDetails}
      <HudMetric label="Distance" value={distanceNm.toFixed(2)} unit="NM" />
      <HudMetric label="Durée" value={$navigationDurationStr} />
      <div class="metric wind-metric">
        <span class="label">Vent</span>
        <div class="wind-value">
          <svg viewBox="0 0 24 24" width="16" height="16" style="transform: rotate({relativeWindDeg}deg)">
            <path d="M12 2L5 21l7-4 7 4z" fill="var(--color-accent)" />
          </svg>
          <span class="value">{WIND_SPEED_KTS}<span class="unit">kn</span></span>
        </div>
      </div>
    {/if}

    {#if $density === 'mobile'}
      <button class="details-toggle" onclick={() => (showDetails = !showDetails)} aria-label="Plus de mesures">
        <svg viewBox="0 0 24 24" width="16" height="16" style="transform: rotate({showDetails ? 180 : 0}deg)">
          <path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </button>
    {/if}
  </div>

  <button class="stop-btn" onclick={() => switchAppMode('consultation')}>Stop</button>
</div>

<style>
  .hud {
    display: flex;
    align-items: center;
    gap: var(--space-4);
    background: var(--surface-overlay);
    backdrop-filter: var(--glass-blur);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-xl);
    padding: var(--space-2) var(--space-4);
    box-shadow: 0 4px 20px var(--color-shadow);
    z-index: 700;
    max-width: calc(100vw - 2 * var(--space-3));
  }

  .hud-boat-name {
    font-size: var(--text-sm);
    font-weight: 600;
    color: var(--color-accent);
    padding-right: var(--space-2);
    border-right: 1px solid var(--color-border);
    white-space: nowrap;
  }

  .hud-metrics {
    display: flex;
    align-items: center;
    gap: var(--space-4);
    flex-wrap: wrap;
  }

  .wind-metric {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.1rem;
  }

  .wind-metric .label {
    font-size: 0.65rem;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: var(--color-text-muted);
  }

  .wind-value {
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }

  .wind-value .value {
    font-family: var(--font-mono);
    font-size: var(--text-lg);
    font-weight: 600;
  }

  .wind-value .unit {
    font-size: var(--text-xs);
    color: var(--color-text-muted);
  }

  .details-toggle {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 1.75rem;
    height: 1.75rem;
    border: none;
    border-radius: var(--radius-md);
    background: var(--surface-2);
    color: var(--color-text-muted);
    cursor: pointer;
  }

  .stop-btn {
    border: none;
    border-radius: var(--radius-md);
    background: var(--color-danger-bg);
    color: var(--color-danger);
    font-weight: 600;
    font-size: var(--text-sm);
    padding: 0.45rem 0.9rem;
    cursor: pointer;
    white-space: nowrap;
  }

  @media (max-width: 639.98px) {
    .hud {
      flex-direction: column;
      align-items: stretch;
      gap: var(--space-2);
      padding: var(--space-2) var(--space-3);
    }

    .hud-metrics {
      flex-wrap: nowrap;
      justify-content: space-between;
    }

    .stop-btn {
      width: 100%;
    }

    .hud-boat-name {
      display: none;
    }
  }
</style>
