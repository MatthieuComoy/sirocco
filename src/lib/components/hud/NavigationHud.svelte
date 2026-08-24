<script lang="ts">
  import { _ } from 'svelte-i18n';
  import { telemetry } from '../../stores/telemetry';
  import { navigationSession, navigationDurationStr } from '../../stores/navigationSession';
  import { weather } from '../../stores/weather';
  import { switchAppMode } from '../../services/appModeController';
  import HudMetric from './HudMetric.svelte';

  const distanceNm = $derived($navigationSession.distanceMeters / 1852);
  const cogStr = $derived(Math.round($telemetry.headingDeg).toString().padStart(3, '0'));

  const windSpeedKts = $derived($weather.conditions?.windSpeedKts ?? null);
  const windFromDeg = $derived($telemetry.windDirectionDeg ?? null);
  const relativeWindDeg = $derived((windFromDeg ?? 0) - $telemetry.headingDeg);
</script>

<div class="hud">
  <div class="duration-primary">{$navigationDurationStr}</div>

  <div class="hud-grid">
    <HudMetric label={$_('speed_short')} value={$telemetry.speedKts.toFixed(1)} unit="kn" />
    <HudMetric label={$_('cog_short')} value={cogStr} unit="°" />

    <HudMetric label={$_('nav_distance')} value={distanceNm.toFixed(2)} unit="NM" />
    <div class="metric wind-metric">
      <span class="label">{$_('wind')}</span>
      <div class="wind-value">
        <svg viewBox="0 0 24 24" width="14" height="14" style="transform: rotate({relativeWindDeg}deg)">
          <path d="M12 2L5 21l7-4 7 4z" fill="var(--color-accent)" />
        </svg>
        <span class="value">{windSpeedKts != null ? Math.round(windSpeedKts) : '--'}<span class="unit">kn</span></span>
      </div>
    </div>
  </div>

  <button class="stop-btn" onclick={() => switchAppMode('consultation')}>{$_('stop_navigation')}</button>
</div>

<style>
  .hud {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: var(--space-2);
    width: 14rem;
    background: var(--surface-overlay);
    backdrop-filter: var(--glass-blur);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-xl);
    padding: var(--space-3) var(--space-4);
    box-shadow: 0 4px 20px var(--color-shadow);
    z-index: 700;
    max-width: calc(100vw - 2 * var(--space-3));
  }

  .duration-primary {
    align-self: center;
    font-family: var(--font-mono);
    font-size: var(--text-xl);
    font-weight: 700;
    color: var(--color-text);
  }

  .hud-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    row-gap: var(--space-2);
    justify-items: center;
  }

  .wind-metric {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.1rem;
    min-width: 3.5rem;
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
    color: var(--color-text);
  }

  .wind-value .unit {
    font-size: var(--text-xs);
    color: var(--color-text-muted);
  }

  .stop-btn {
    border: none;
    border-radius: var(--radius-md);
    background: var(--color-danger-bg);
    color: var(--color-danger);
    font-weight: 600;
    font-size: var(--text-sm);
    padding: 0.5rem 0.9rem;
    cursor: pointer;
  }
</style>
