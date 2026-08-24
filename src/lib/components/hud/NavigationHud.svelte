<script lang="ts">
  import { _ } from 'svelte-i18n';
  import { telemetry } from '../../stores/telemetry';
  import { navigationSession, navigationDurationStr } from '../../stores/navigationSession';
  import { switchAppMode } from '../../services/appModeController';
  import HudMetric from './HudMetric.svelte';

  const distanceNm = $derived($navigationSession.distanceMeters / 1852);
  const cogStr = $derived(Math.round($telemetry.headingDeg).toString().padStart(3, '0'));
</script>

<div class="hud">
  <div class="duration-primary">{$navigationDurationStr}</div>

  <div class="hud-row">
    <HudMetric label="SOG" value={$telemetry.speedKts.toFixed(1)} unit="kn" />
    <HudMetric label="COG" value={cogStr} unit="°" />
  </div>

  <div class="hud-row">
    <HudMetric label={$_('nav_distance')} value={distanceNm.toFixed(2)} unit="NM" />
    <HudMetric label={$_('nav_duration')} value={$navigationDurationStr} />
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

  .hud-row {
    display: flex;
    justify-content: space-around;
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
