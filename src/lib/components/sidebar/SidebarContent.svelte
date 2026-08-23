<script lang="ts">
  import { get } from 'svelte/store';
  import { _ } from 'svelte-i18n';
  import Tabs from '../ui/Tabs.svelte';
  import LayersPanel from './LayersPanel.svelte';
  import WeatherPanel from '../weather/WeatherPanel.svelte';
  import { telemetry } from '../../stores/telemetry';
  import { fetchWeatherAndTides } from '../../services/weather';
  import { appMode } from '../../stores/appMode';

  let active = $state($appMode === 'weather' ? 'weather' : 'layers');
  let previousActive: string | null = null;

  // Weather app mode forces this tab open too (legacy: setAppMode('weather')
  // shows panel-weather regardless of which sidebar tab was last active).
  $effect(() => {
    if ($appMode === 'weather') active = 'weather';
  });

  $effect(() => {
    const current = active;
    if (current === 'weather' && previousActive !== 'weather') {
      const t = get(telemetry);
      fetchWeatherAndTides(t.lat, t.lon);
    }
    previousActive = current;
  });
</script>

<div class="sidebar-content">
  <Tabs
    tabs={[
      { id: 'layers', label: $_('layers_routes_view') },
      { id: 'weather', label: $_('mode_weather') },
    ]}
    bind:active
  />

  <div class="panel">
    {#if active === 'layers'}
      <LayersPanel />
    {:else}
      <WeatherPanel />
    {/if}
  </div>
</div>

<style>
  .sidebar-content {
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .panel {
    flex: 1;
    overflow-y: auto;
  }
</style>
