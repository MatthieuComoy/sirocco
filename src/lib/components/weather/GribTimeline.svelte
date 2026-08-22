<script lang="ts">
  import { grib } from '../../stores/grib';
  import { setActiveTimeStep, togglePlay } from '../../services/grib';
  import { density } from '../../stores/viewport';

  const DAYS = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

  let scrollContainer: HTMLDivElement;

  interface DayBlock {
    label: string;
    ticks: { index: number; label: string; showLabel: boolean }[];
  }

  const days = $derived.by((): DayBlock[] => {
    const base = new Date();
    const blocks: DayBlock[] = [];
    for (let d = 0; d < 7; d++) {
      const date = new Date(base.getTime() + d * 86400000);
      const ticks = [];
      for (let h = 0; h < 24; h += 3) {
        // Mobile: keep every tick tappable but only label every other one to
        // reduce clutter (plan §3 — reduce density, not functionality).
        const showLabel = $density !== 'mobile' || h % 6 === 0;
        ticks.push({ index: d * 24 + h, label: `${String(h).padStart(2, '0')}h`, showLabel });
      }
      blocks.push({ label: `${DAYS[date.getDay()]} ${String(date.getDate()).padStart(2, '0')}`, ticks });
    }
    return blocks;
  });

  const currentBadge = $derived.by(() => {
    const now = new Date();
    const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const target = new Date(midnight.getTime() + $grib.activeTimeIndex * 3600000);
    const day = String(target.getDate()).padStart(2, '0');
    const month = String(target.getMonth() + 1).padStart(2, '0');
    const hours = String(target.getHours()).padStart(2, '0');
    return `${day}/${month} - ${hours}:00`;
  });

  function selectTick(index: number, el: EventTarget | null) {
    setActiveTimeStep(index);
    (el as HTMLElement)?.scrollIntoView?.({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  }
</script>

<div class="grib-timeline">
  <button class="play-btn" onclick={togglePlay} aria-label={$grib.isPlaying ? 'Pause' : 'Lecture'}>
    {#if $grib.isPlaying}
      <svg viewBox="0 0 24 24" width="16" height="16"><path d="M6 5h4v14H6zM14 5h4v14h-4z" fill="currentColor" /></svg>
    {:else}
      <svg viewBox="0 0 24 24" width="16" height="16"><path d="M8 5v14l11-7z" fill="currentColor" /></svg>
    {/if}
  </button>

  <span class="current-badge">{currentBadge}</span>

  <div class="scroll-container" bind:this={scrollContainer}>
    {#each days as day (day.label)}
      <div class="day-block">
        <div class="day-name">{day.label}</div>
        <div class="hours-row">
          {#each day.ticks as tick (tick.index)}
            <button
              class="hour-tick"
              class:active={tick.index === $grib.activeTimeIndex}
              onclick={(e) => selectTick(tick.index, e.currentTarget)}
            >
              {tick.showLabel ? tick.label : ''}
            </button>
          {/each}
        </div>
      </div>
    {/each}
  </div>
</div>

<style>
  .grib-timeline {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    background: var(--surface-overlay);
    backdrop-filter: var(--glass-blur);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
    padding: var(--space-2);
    box-shadow: 0 4px 20px var(--color-shadow);
    max-width: 100%;
  }

  .play-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2rem;
    height: 2rem;
    flex-shrink: 0;
    border: none;
    border-radius: 50%;
    background: var(--color-accent);
    color: var(--slate-950, #0b0f19);
    cursor: pointer;
  }

  .current-badge {
    font-family: var(--font-mono);
    font-size: var(--text-xs);
    color: var(--color-text-muted);
    flex-shrink: 0;
    white-space: nowrap;
  }

  .scroll-container {
    display: flex;
    flex: 1;
    min-width: 0;
    gap: var(--space-2);
    overflow-x: auto;
    scroll-behavior: smooth;
  }

  .day-block {
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
    flex-shrink: 0;
  }

  .day-name {
    font-size: 0.65rem;
    color: var(--color-text-muted);
    text-align: center;
  }

  .hours-row {
    display: flex;
    gap: 0.15rem;
  }

  .hour-tick {
    min-width: 1.6rem;
    height: 1.4rem;
    border: none;
    border-radius: var(--radius-sm);
    background: var(--surface-2);
    color: var(--color-text-muted);
    font-size: 0.6rem;
    font-family: var(--font-mono);
    cursor: pointer;
  }

  .hour-tick.active {
    background: var(--color-accent);
    color: var(--slate-950, #0b0f19);
    font-weight: 700;
  }
</style>
