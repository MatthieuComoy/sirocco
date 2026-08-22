<script lang="ts">
  import type { TideData } from '../../services/tides';

  let { data }: { data: TideData } = $props();

  const SVG_WIDTH = 960;
  const SVG_HEIGHT = 140;

  let scrollWrapper: HTMLDivElement;
  let svgEl: SVGSVGElement;

  const bounds = $derived.by(() => {
    let maxHeight = 0.1;
    let minHeight = 99999;
    for (const s of data.samples) {
      if (s.height > maxHeight) maxHeight = s.height;
      if (s.height < minHeight) minHeight = s.height;
    }
    const diff = maxHeight - minHeight;
    const yMax = maxHeight + Math.max(0.1, diff * 0.15);
    const yMin = Math.max(0, minHeight - Math.max(0.1, diff * 0.15));
    return { yMin, yMax, yRange: yMax - yMin };
  });

  function getX(hour: number) {
    return 20 + (hour / 48) * 920;
  }
  function getY(height: number) {
    return 115 - ((height - bounds.yMin) / bounds.yRange) * 85;
  }

  const curvePath = $derived(
    data.samples.map((s, i) => `${i === 0 ? 'M' : 'L'} ${getX(s.hour)},${getY(s.height)}`).join(' ')
  );
  const areaPath = $derived.by(() => {
    const first = data.samples[0];
    const last = data.samples[data.samples.length - 1];
    return `${curvePath} L ${getX(last.hour)},115 L ${getX(first.hour)},115 Z`;
  });

  const nowX = $derived(getX(data.currentHour));
  const nowY = $derived(getY(data.currentHeight));

  const gridLines = $derived.by(() => {
    const lines: { x: number; isDayBoundary: boolean; label: string }[] = [];
    for (let h = 3; h < 48; h += 3) {
      lines.push({ x: getX(h), isDayBoundary: h === 24, label: h % 24 === 0 ? '0h' : `${h % 24}h` });
    }
    return lines;
  });

  // --- interactive scrub ---
  let selector = $state<{ x: number; y: number; timeStr: string; dayLabel: string; height: number; rising: boolean } | null>(null);

  function updateSelector(clientX: number) {
    const rect = svgEl.getBoundingClientRect();
    let x = ((clientX - rect.left) / rect.width) * SVG_WIDTH;
    x = Math.min(940, Math.max(20, x));

    const hour = ((x - 20) / 920) * 48;
    const closest = data.samples.reduce((prev, curr) =>
      Math.abs(curr.hour - hour) < Math.abs(prev.hour - hour) ? curr : prev
    );
    const y = getY(closest.height);

    const idx = data.samples.indexOf(closest);
    const nextIdx = Math.min(data.samples.length - 1, idx + 1);
    const rising = data.samples[nextIdx].height > closest.height;

    const hr = Math.floor(hour) % 24;
    const min = Math.round((hour % 1) * 60);
    const timeStr = `${hr.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`;
    const dayLabel = hour >= 24 ? 'Demain' : "Aujourd'hui";

    selector = { x, y, timeStr, dayLabel, height: closest.height, rising };
  }

  function clearSelector() {
    selector = null;
  }

  function centerOnNow() {
    if (!scrollWrapper) return;
    scrollWrapper.scrollLeft = nowX - scrollWrapper.clientWidth / 2;
  }

  $effect(() => {
    // Re-center whenever a fresh tide dataset arrives.
    void data;
    setTimeout(centerOnNow, 50);
  });
</script>

<div class="tide-chart">
  <div class="tide-header">
    <span class="tide-title">Marée</span>
    <span class="tide-badge">Marnage : {data.range.toFixed(2)}m | Coef : {data.coefficient}</span>
    <button class="recenter-btn" onclick={centerOnNow}>Maintenant</button>
  </div>

  <div class="tide-scroll-wrapper" bind:this={scrollWrapper}>
    <svg
      bind:this={svgEl}
      role="img"
      aria-label="Courbe de marée sur 48 heures, glisser pour lire la hauteur à une heure donnée"
      width={SVG_WIDTH}
      height={SVG_HEIGHT}
      viewBox="0 0 {SVG_WIDTH} {SVG_HEIGHT}"
      style="overflow: visible; user-select: none; display: block;"
      onmousemove={(e) => updateSelector(e.clientX)}
      onmouseleave={clearSelector}
      ontouchstart={(e) => e.touches[0] && updateSelector(e.touches[0].clientX)}
      ontouchmove={(e) => e.touches[0] && updateSelector(e.touches[0].clientX)}
      ontouchend={clearSelector}
    >
      <defs>
        <linearGradient id="tide-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="var(--color-accent)" stop-opacity="0.25" />
          <stop offset="100%" stop-color="var(--color-accent)" stop-opacity="0" />
        </linearGradient>
      </defs>

      <text x="250" y="15" fill="var(--color-accent)" font-size="10" font-weight="700" text-anchor="middle" opacity="0.85">Aujourd'hui</text>
      <text x="710" y="15" fill="var(--color-accent)" font-size="10" font-weight="700" text-anchor="middle" opacity="0.85">Demain</text>

      <line x1="20" y1="115" x2="940" y2="115" stroke="var(--color-border)" stroke-width="1.5" />
      <text x="20" y="127" fill="var(--color-text-muted)" font-size="7" text-anchor="middle">0h</text>
      <text x="940" y="127" fill="var(--color-text-muted)" font-size="7" text-anchor="middle">24h</text>

      {#each gridLines as line (line.x)}
        <line
          x1={line.x} y1="20" x2={line.x} y2="115"
          stroke={line.isDayBoundary ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.05)'}
          stroke-width="1"
          stroke-dasharray={line.isDayBoundary ? undefined : '3,3'}
        />
        <text x={line.x} y="127" fill="var(--color-text-muted)" font-size="7" text-anchor="middle">{line.label}</text>
      {/each}

      <path d={areaPath} fill="url(#tide-gradient)" />
      <path d={curvePath} fill="none" stroke="var(--color-accent)" stroke-width="3" stroke-linecap="round" />

      {#each data.extremes as e (e.hour)}
        {@const x = getX(e.hour)}
        {@const y = getY(e.height)}
        {@const isHigh = e.type === 'high'}
        <circle cx={x} cy={y} r="4" fill={isHigh ? 'var(--color-warning)' : 'var(--color-text-muted)'} stroke="rgba(255,255,255,0.15)" stroke-width="1" />
        <text x={x} y={y + (isHigh ? -10 : 13)} fill="var(--color-text)" font-size="7.5" font-weight="600" text-anchor="middle">
          {isHigh ? 'PM' : 'BM'}: {e.height.toFixed(2)}m ({e.timeStr})
        </text>
      {/each}

      <line x1={nowX} y1="20" x2={nowX} y2="115" stroke="var(--color-warning)" stroke-width="1.5" stroke-dasharray="3,3" opacity="0.8" />
      <circle cx={nowX} cy={nowY} r="5" fill="var(--color-warning)" stroke="var(--surface-opaque)" stroke-width="1.5" />

      {#if selector}
        <line x1={selector.x} y1="20" x2={selector.x} y2="115" stroke="var(--color-accent)" stroke-width="1.5" />
        <circle cx={selector.x} cy={selector.y} r="5.5" fill="var(--color-accent)" stroke="var(--surface-opaque)" stroke-width="1.5" />
      {/if}
    </svg>

    {#if selector}
      <div class="tide-tooltip">
        <strong>{selector.dayLabel} {selector.timeStr}</strong> : {selector.height.toFixed(2)} m
        <span class="trend" class:rising={selector.rising}>
          {selector.rising ? '↗ Montante' : '↘ Descendante'}
        </span>
      </div>
    {/if}
  </div>

  <div class="tide-schedule">
    {#each data.extremes as e (e.hour)}
      <div class="schedule-item" class:high={e.type === 'high'}>
        <span>{e.type === 'high' ? 'Pleine mer' : 'Basse mer'} {e.isTomorrow ? '(Demain)' : '(Auj.)'}</span>
        <span class="mono">{e.timeStr}</span>
        <span class="mono">{e.height.toFixed(2)} m</span>
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

  .tide-header {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    flex-wrap: wrap;
  }

  .tide-title {
    font-weight: 600;
    font-size: var(--text-sm);
  }

  .tide-badge {
    font-size: var(--text-xs);
    color: var(--color-text-muted);
    font-family: var(--font-mono);
    flex: 1;
  }

  .recenter-btn {
    border: 1px solid var(--color-border);
    background: var(--surface-2);
    color: var(--color-accent);
    font-size: var(--text-xs);
    border-radius: var(--radius-md);
    padding: 0.25rem 0.6rem;
    cursor: pointer;
  }

  .tide-scroll-wrapper {
    position: relative;
    overflow-x: auto;
    padding-bottom: var(--space-1);
  }

  .tide-tooltip {
    position: absolute;
    top: 0;
    left: var(--space-2);
    background: var(--surface-overlay);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    padding: 0.35rem 0.6rem;
    font-size: var(--text-xs);
    pointer-events: none;
    white-space: nowrap;
  }

  .trend {
    font-weight: 700;
    color: var(--color-warning);
    margin-left: 0.3rem;
  }

  .trend.rising {
    color: var(--color-success);
  }

  .tide-schedule {
    display: flex;
    flex-direction: column;
    gap: var(--space-1);
  }

  .schedule-item {
    display: flex;
    justify-content: space-between;
    gap: var(--space-2);
    font-size: var(--text-xs);
    padding: 0.3rem 0.5rem;
    border-radius: var(--radius-sm);
    background: var(--surface-2);
  }

  .schedule-item.high {
    color: var(--color-warning);
  }

  .mono {
    font-family: var(--font-mono);
  }
</style>
