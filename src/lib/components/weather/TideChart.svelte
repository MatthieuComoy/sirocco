<script lang="ts">
  import { _ } from 'svelte-i18n';
  import type { TideData } from '../../services/tides';

  let { data }: { data: TideData } = $props();

  // Just today's high/low tide times — no curve, no height/depth figures.
  const todayExtremes = $derived(data.extremes.filter((e) => !e.isTomorrow));
</script>

<div class="tide-chart">
  <span class="tide-title">{$_('tide_short_lbl')}</span>

  <div class="tide-schedule">
    {#each todayExtremes as e (e.hour)}
      <div class="schedule-item" class:high={e.type === 'high'}>
        <span class="schedule-label">{e.type === 'high' ? $_('high_tide_lbl') : $_('low_tide_lbl')}</span>
        <span class="schedule-time mono">{e.timeStr}</span>
      </div>
    {/each}
  </div>
</div>

<style>
  .tide-chart {
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
  }

  .tide-title {
    font-weight: 600;
    font-size: var(--text-sm);
  }

  .tide-schedule {
    display: flex;
    flex-direction: column;
    gap: var(--space-1);
  }

  .schedule-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--space-2);
    font-size: var(--text-sm);
    padding: 0.5rem 0.75rem;
    border-radius: var(--radius-sm);
    background: var(--surface-2);
  }

  .schedule-item.high {
    color: var(--color-warning);
  }

  .schedule-label {
    font-weight: 500;
  }

  .schedule-time {
    font-weight: 600;
  }

  .mono {
    font-family: var(--font-mono);
  }
</style>
