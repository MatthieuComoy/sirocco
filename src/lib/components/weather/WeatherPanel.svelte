<script lang="ts">
  import { _ } from 'svelte-i18n';
  import { weather, tideData } from '../../stores/weather';
  import { density } from '../../stores/viewport';
  import { getWindCardinal } from '../../services/utils';
  import InstrumentCard from './InstrumentCard.svelte';
  import TideChart from './TideChart.svelte';

  const compact = $derived($density === 'mobile');
  const c = $derived($weather.conditions);
</script>

<div class="weather-panel">
  <div class="location-row">
    <span class="location-name">{$weather.locationName ?? $_('unknown_location')}</span>
    {#if $weather.loading}<span class="spinner" aria-label={$_('loading_lbl')}></span>{/if}
  </div>

  <div class="instruments" class:compact>
    <InstrumentCard title={$_('weather_wind')} {compact}>
      {#if c?.windSpeedKts != null}
        <div class="primary-value">{Math.round(c.windSpeedKts)}<span class="unit">kn</span></div>
        {#if c.windDirDeg != null}
          <div class="sub-row">
            <svg viewBox="0 0 24 24" width="14" height="14" style="transform: rotate({c.windDirDeg + 180}deg)">
              <path d="M12 2L5 21l7-4 7 4z" fill="var(--color-accent)" />
            </svg>
            <span>{getWindCardinal(c.windDirDeg)} ({Math.round(c.windDirDeg)}°)</span>
          </div>
        {/if}
        {#if c.windGustsKts != null}<div class="sub-row muted">{$_('weather_wind_gusts')} : {Math.round(c.windGustsKts)} kn</div>{/if}
      {:else}
        <div class="primary-value muted">--</div>
      {/if}
    </InstrumentCard>

    <InstrumentCard title={$_('weather_waves')} {compact}>
      {#if c?.waveHeightM != null}
        <div class="primary-value">{c.waveHeightM.toFixed(2)}<span class="unit">m</span></div>
        {#if c.waveDirDeg != null}
          <div class="sub-row">
            <svg viewBox="0 0 24 24" width="14" height="14" style="transform: rotate({c.waveDirDeg + 180}deg)">
              <path d="M12 2L5 21l7-4 7 4z" fill="var(--color-accent)" />
            </svg>
            <span>{getWindCardinal(c.waveDirDeg)} ({Math.round(c.waveDirDeg)}°)</span>
          </div>
        {/if}
        {#if c.wavePeriodS != null}<div class="sub-row muted">{$_('weather_wave_period')} : {Math.round(c.wavePeriodS)} s</div>{/if}
      {:else}
        <div class="primary-value muted">--</div>
      {/if}
    </InstrumentCard>

    <InstrumentCard title={$_('weather_atmosphere')} {compact}>
      {#if c?.tempC != null}
        <div class="primary-value">{c.tempC.toFixed(1)}<span class="unit">°C</span></div>
      {:else}
        <div class="primary-value muted">--</div>
      {/if}
      {#if c?.pressureMsl != null}<div class="sub-row muted">{Math.round(c.pressureMsl)} hPa</div>{/if}
    </InstrumentCard>
  </div>

  {#if $tideData}
    <TideChart data={$tideData} />
  {/if}

  <p class="attribution">{$_('weather_attribution')}</p>
</div>

<style>
  .weather-panel {
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
    padding: var(--space-4);
  }

  .location-row {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    font-weight: 600;
  }

  .spinner {
    width: 0.9rem;
    height: 0.9rem;
    border-radius: 50%;
    border: 2px solid var(--color-border);
    border-top-color: var(--color-accent);
    animation: spin 0.8s linear infinite;
  }

  .instruments {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: var(--space-2);
  }

  .instruments.compact {
    grid-template-columns: repeat(3, 1fr);
    gap: var(--space-1);
  }

  .primary-value {
    font-family: var(--font-mono);
    font-size: var(--text-lg);
    font-weight: 700;
  }

  .primary-value.muted {
    color: var(--color-text-muted);
  }

  .unit {
    font-size: var(--text-xs);
    color: var(--color-text-muted);
    margin-left: 0.15rem;
  }

  .sub-row {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    font-size: var(--text-xs);
  }

  .sub-row.muted {
    color: var(--color-text-muted);
  }

  .attribution {
    font-size: var(--text-xs);
    color: var(--color-text-muted);
    text-align: center;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
</style>
