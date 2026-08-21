<script lang="ts">
  import type { Snippet } from 'svelte';

  type SheetState = 'closed' | 'half' | 'full';

  const SNAP_HEIGHTS: Record<SheetState, number> = {
    closed: 0,
    half: 0.5,
    full: 0.92,
  };
  const STATE_ORDER: SheetState[] = ['closed', 'half', 'full'];

  let {
    value = $bindable<SheetState>('closed'),
    title,
    children,
  }: { value?: SheetState; title?: string; children?: Snippet } = $props();

  let dragging = $state(false);
  let dragStartY = 0;
  let dragStartFraction = 0;
  let liveFraction = $state<number | null>(null);

  function fractionFor(s: SheetState) {
    return SNAP_HEIGHTS[s];
  }

  function nearestState(fraction: number): SheetState {
    let best: SheetState = 'closed';
    let bestDist = Infinity;
    for (const key of STATE_ORDER) {
      const dist = Math.abs(SNAP_HEIGHTS[key] - fraction);
      if (dist < bestDist) {
        bestDist = dist;
        best = key;
      }
    }
    return best;
  }

  function onPointerDown(e: PointerEvent) {
    dragging = true;
    dragStartY = e.clientY;
    dragStartFraction = fractionFor(value);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }

  function onPointerMove(e: PointerEvent) {
    if (!dragging) return;
    const deltaFraction = (dragStartY - e.clientY) / window.innerHeight;
    liveFraction = Math.min(0.95, Math.max(0, dragStartFraction + deltaFraction));
  }

  function onPointerUp() {
    if (!dragging) return;
    dragging = false;
    if (liveFraction !== null) value = nearestState(liveFraction);
    liveFraction = null;
  }

  function onHandleClick() {
    if (dragging) return;
    value = value === 'closed' ? 'half' : 'closed';
  }

  function onHandleKeydown(e: KeyboardEvent) {
    const idx = STATE_ORDER.indexOf(value);
    if (e.key === 'ArrowUp' && idx < STATE_ORDER.length - 1) {
      value = STATE_ORDER[idx + 1];
      e.preventDefault();
    } else if (e.key === 'ArrowDown' && idx > 0) {
      value = STATE_ORDER[idx - 1];
      e.preventDefault();
    } else if (e.key === 'Enter' || e.key === ' ') {
      onHandleClick();
      e.preventDefault();
    }
  }

  const currentFraction = $derived(liveFraction ?? fractionFor(value));
  const isPeeking = $derived(value === 'closed' && liveFraction === null);
</script>

<div
  class="sheet"
  class:peeking={isPeeking}
  class:dragging
  style:height={isPeeking ? 'var(--sheet-peek)' : `${currentFraction * 100}dvh`}
>
  <div
    class="handle"
    role="slider"
    aria-label={title ?? 'Panneau'}
    aria-valuemin={0}
    aria-valuemax={100}
    aria-valuenow={Math.round(currentFraction * 100)}
    tabindex="0"
    onpointerdown={onPointerDown}
    onpointermove={onPointerMove}
    onpointerup={onPointerUp}
    onpointercancel={onPointerUp}
    onclick={onHandleClick}
    onkeydown={onHandleKeydown}
  >
    <span class="grip"></span>
    {#if title}<span class="title">{title}</span>{/if}
  </div>
  <div class="content">
    {@render children?.()}
  </div>
</div>

<style>
  .sheet {
    --sheet-peek: 2.75rem;
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    flex-direction: column;
    background: var(--surface-overlay);
    backdrop-filter: var(--glass-blur);
    border-top-left-radius: var(--radius-xl);
    border-top-right-radius: var(--radius-xl);
    border: 1px solid var(--color-border);
    border-bottom: none;
    box-shadow: 0 -8px 24px var(--color-shadow);
    overflow: hidden;
    transition: height var(--dur-slow) var(--ease-spring);
    /* Above Leaflet's control panes (z-index: 1000). */
    z-index: 1200;
  }

  .sheet.dragging {
    transition: none;
  }

  .sheet.peeking .content {
    visibility: hidden;
  }

  .handle {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--space-1);
    padding: var(--space-2) 0;
    touch-action: none;
    cursor: grab;
    flex-shrink: 0;
  }

  .grip {
    width: 2.5rem;
    height: 0.25rem;
    border-radius: var(--radius-sm);
    background: var(--color-border);
  }

  .title {
    font-size: var(--text-sm);
    color: var(--color-text-muted);
  }

  .content {
    flex: 1;
    overflow-y: auto;
    min-height: 0;
  }
</style>
