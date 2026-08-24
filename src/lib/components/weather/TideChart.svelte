<script lang="ts">
  import { _ } from 'svelte-i18n';
  import type { TideData } from '../../services/tides';

  let { data }: { data: TideData } = $props();

  // Coordinate space for the viewBox — the <svg> itself is responsive
  // (width: 100%, height: auto) and scales to fill the sidebar/panel column,
  // so only the aspect ratio here matters, not the absolute numbers. A ~2.3:1
  // ratio (vs. the old 960x140 ≈ 6.9:1) is what actually reads on a ~320px
  // wide column — the previous wide/flat ratio meant the browser's global
  // `svg { max-width: 100% }` reset (app.css) squeezed it down to a barely
  // legible sliver no matter how much vertical room was asked for.
  const SVG_WIDTH = 600;
  const SVG_HEIGHT = 220;
  const MARGIN_X = 12;
  const TOP_Y = 36;
  const BOTTOM_Y = 190;

  let svgEl: SVGSVGElement;

  // Only today's window (0-24h) — tomorrow's extremes aren't relevant to a
  // quick-glance widget, and limiting the range doubles the effective
  // resolution of the curve for the same viewBox width, improving readability.
  const todaySamples = $derived(data.samples.filter((s) => s.hour <= 24));
  const todayExtremes = $derived(data.extremes.filter((e) => !e.isTomorrow));

  const bounds = $derived.by(() => {
    let maxHeight = 0.1;
    let minHeight = 99999;
    for (const s of todaySamples) {
      if (s.height > maxHeight) maxHeight = s.height;
      if (s.height < minHeight) minHeight = s.height;
    }
    const diff = maxHeight - minHeight;
    const yMax = maxHeight + Math.max(0.1, diff * 0.15);
    const yMin = Math.max(0, minHeight - Math.max(0.1, diff * 0.15));
    return { yMin, yMax, yRange: yMax - yMin };
  });

  function getX(hour: number) {
    return MARGIN_X + (hour / 24) * (SVG_WIDTH - 2 * MARGIN_X);
  }
  function getY(height: number) {
    return BOTTOM_Y - ((height - bounds.yMin) / bounds.yRange) * (BOTTOM_Y - TOP_Y);
  }

  const curvePath = $derived(
    todaySamples.map((s, i) => `${i === 0 ? 'M' : 'L'} ${getX(s.hour)},${getY(s.height)}`).join(' ')
  );
  const areaPath = $derived.by(() => {
    const first = todaySamples[0];
    const last = todaySamples[todaySamples.length - 1];
    return `${curvePath} L ${getX(last.hour)},${BOTTOM_Y} L ${getX(first.hour)},${BOTTOM_Y} Z`;
  });

  const nowX = $derived(getX(Math.min(24, data.currentHour)));
  const nowY = $derived(getY(data.currentHeight));

  const gridLines = $derived.by(() => {
    const lines: { x: number; label: string }[] = [];
    for (let h = 6; h < 24; h += 6) {
      lines.push({ x: getX(h), label: `${h}h` });
    }
    return lines;
  });

  // --- interactive scrub ---
  let selector = $state<{ x: number; y: number; timeStr: string; height: number; rising: boolean } | null>(null);

  function updateSelector(clientX: number) {
    const rect = svgEl.getBoundingClientRect();
    let x = ((clientX - rect.left) / rect.width) * SVG_WIDTH;
    x = Math.min(SVG_WIDTH - MARGIN_X, Math.max(MARGIN_X, x));

    const hour = ((x - MARGIN_X) / (SVG_WIDTH - 2 * MARGIN_X)) * 24;
    const closest = todaySamples.reduce((prev, curr) =>
      Math.abs(curr.hour - hour) < Math.abs(prev.hour - hour) ? curr : prev
    );
    const y = getY(closest.height);

    const idx = todaySamples.indexOf(closest);
    const nextIdx = Math.min(todaySamples.length - 1, idx + 1);
    const rising = todaySamples[nextIdx].height > closest.height;

    const hr = Math.floor(hour) % 24;
    const min = Math.round((hour % 1) * 60);
    const timeStr = `${hr.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`;

    selector = { x, y, timeStr, height: closest.height, rising };
  }

  function clearSelector() {
    selector = null;
  }
</script>

<div class="tide-chart">
  <div class="tide-header">
    <span class="tide-title">{$_('tide_short_lbl')}</span>
    <span class="tide-badge">{$_('tide_range_lbl')} : {data.range.toFixed(2)}m | {$_('tide_coef_lbl')} : {data.coefficient}</span>
  </div>

  <div class="tide-chart-area">
    <svg
      bind:this={svgEl}
      role="img"
      aria-label={$_('tide_chart_aria')}
      viewBox="0 0 {SVG_WIDTH} {SVG_HEIGHT}"
      style="width: 100%; height: auto; overflow: visible; user-select: none; display: block;"
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

      <line x1={MARGIN_X} y1={BOTTOM_Y} x2={SVG_WIDTH - MARGIN_X} y2={BOTTOM_Y} stroke="var(--color-border)" stroke-width="1.5" />
      <text x={MARGIN_X} y={BOTTOM_Y + 16} fill="var(--color-text-muted)" font-size="12" text-anchor="start">0h</text>
      <text x={SVG_WIDTH - MARGIN_X} y={BOTTOM_Y + 16} fill="var(--color-text-muted)" font-size="12" text-anchor="end">24h</text>

      {#each gridLines as line (line.x)}
        <line x1={line.x} y1={TOP_Y} x2={line.x} y2={BOTTOM_Y} stroke="var(--color-border)" stroke-width="1" stroke-dasharray="3,3" />
        <text x={line.x} y={BOTTOM_Y + 16} fill="var(--color-text-muted)" font-size="12" text-anchor="middle">{line.label}</text>
      {/each}

      <path d={areaPath} fill="url(#tide-gradient)" />
      <path d={curvePath} fill="none" stroke="var(--color-accent)" stroke-width="3" stroke-linecap="round" />

      {#each todayExtremes as e (e.hour)}
        {@const x = getX(e.hour)}
        {@const y = getY(e.height)}
        {@const isHigh = e.type === 'high'}
        <circle cx={x} cy={y} r="5" fill={isHigh ? 'var(--color-warning)' : 'var(--color-text-muted)'} stroke="var(--surface-opaque)" stroke-width="1.5" />
        <text x={x} y={y + (isHigh ? -12 : 20)} fill="var(--color-text)" font-size="12" font-weight="600" text-anchor="middle">
          {isHigh ? $_('high_tide_abbr') : $_('low_tide_abbr')} {e.timeStr}
        </text>
        <text x={x} y={y + (isHigh ? -12 : 20) + 13} fill="var(--color-text-muted)" font-size="10" text-anchor="middle">
          {e.height.toFixed(2)}m
        </text>
      {/each}

      <line x1={nowX} y1={TOP_Y} x2={nowX} y2={BOTTOM_Y} stroke="var(--color-warning)" stroke-width="1.5" stroke-dasharray="3,3" opacity="0.8" />
      <circle cx={nowX} cy={nowY} r="6" fill="var(--color-warning)" stroke="var(--surface-opaque)" stroke-width="1.5" />

      {#if selector}
        <line x1={selector.x} y1={TOP_Y} x2={selector.x} y2={BOTTOM_Y} stroke="var(--color-accent)" stroke-width="1.5" />
        <circle cx={selector.x} cy={selector.y} r="6.5" fill="var(--color-accent)" stroke="var(--surface-opaque)" stroke-width="1.5" />
      {/if}
    </svg>

    {#if selector}
      <div class="tide-tooltip">
        <strong>{selector.timeStr}</strong> : {selector.height.toFixed(2)} m
        <span class="trend" class:rising={selector.rising}>
          {selector.rising ? `↗ ${$_('tide_rising_lbl')}` : `↘ ${$_('tide_falling_lbl')}`}
        </span>
      </div>
    {/if}
  </div>

  <div class="tide-schedule">
    {#each todayExtremes as e (e.hour)}
      <div class="schedule-item" class:high={e.type === 'high'}>
        <span>{e.type === 'high' ? $_('high_tide_lbl') : $_('low_tide_lbl')}</span>
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
    align-items: baseline;
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
  }

  .tide-chart-area {
    position: relative;
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
    font-size: var(--text-sm);
    padding: 0.4rem 0.6rem;
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
