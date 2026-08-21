<script lang="ts">
  import type { SavedTrack } from '../../stores/tracking';
  import { deleteTrack, exportTrackToGPX } from '../../services/tracking';
  import { formatDurationShort } from '../../services/utils';

  let { track, index, onShowOnMap }: { track: SavedTrack; index: number; onShowOnMap: (t: SavedTrack) => void } = $props();

  const distanceNm = $derived((track.distance / 1852).toFixed(2));
  const recapRows = $derived(
    Object.entries(track.pointsOfSailRecap)
      .filter(([, ms]) => ms > 0)
      .sort(([, a], [, b]) => b - a)
  );
  const totalMs = $derived(recapRows.reduce((sum, [, ms]) => sum + ms, 0));
</script>

<div class="track-item">
  <div class="track-header">
    <span class="track-name">{track.name}</span>
    <div class="track-actions">
      <button class="icon-btn" title="Afficher sur la carte" aria-label="Afficher sur la carte" onclick={() => onShowOnMap(track)}>
        <svg viewBox="0 0 24 24" width="15" height="15"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" fill="currentColor" /></svg>
      </button>
      <button class="icon-btn" title="Export GPX" aria-label="Export GPX" onclick={() => exportTrackToGPX(track)}>
        <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" /></svg>
      </button>
      <button class="icon-btn danger" title="Supprimer" aria-label="Supprimer" onclick={() => deleteTrack(index)}>
        <svg viewBox="0 0 24 24" width="15" height="15"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" fill="currentColor" /></svg>
      </button>
    </div>
  </div>

  <div class="track-metrics">
    <span>📏 {distanceNm} NM</span>
    <span>⏱️ {track.avgSpeed.toFixed(1)} kn moy.</span>
    <span>⚡ {track.maxSpeed.toFixed(1)} kn max</span>
  </div>

  {#if totalMs > 0}
    <div class="allures">
      {#each recapRows as [allure, ms] (allure)}
        {@const pct = (ms / totalMs) * 100}
        <div class="allure-row">
          <div class="allure-label">
            <span>⛵ {allure}</span>
            <span>{pct.toFixed(0)}% ({formatDurationShort(ms)})</span>
          </div>
          <div class="allure-bar"><div class="allure-fill" style:width="{pct}%"></div></div>
        </div>
      {/each}
    </div>
  {/if}
</div>

<style>
  .track-item {
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
    padding: var(--space-3);
    background: var(--surface-2);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
  }

  .track-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--space-2);
  }

  .track-name {
    font-size: var(--text-sm);
    font-weight: 600;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .track-actions {
    display: flex;
    gap: var(--space-1);
    flex-shrink: 0;
  }

  .icon-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 1.75rem;
    height: 1.75rem;
    border: none;
    border-radius: var(--radius-sm);
    background: var(--surface-1);
    color: var(--color-text-muted);
    cursor: pointer;
  }

  .icon-btn:hover {
    color: var(--color-accent);
  }

  .icon-btn.danger:hover {
    color: var(--color-danger);
  }

  .track-metrics {
    display: flex;
    gap: var(--space-3);
    flex-wrap: wrap;
    font-size: var(--text-xs);
    color: var(--color-text-muted);
  }

  .allures {
    display: flex;
    flex-direction: column;
    gap: var(--space-1);
    padding-top: var(--space-2);
    border-top: 1px solid var(--color-border);
  }

  .allure-label {
    display: flex;
    justify-content: space-between;
    font-size: var(--text-xs);
    color: var(--color-text-muted);
  }

  .allure-bar {
    height: 0.3rem;
    border-radius: 999px;
    background: var(--surface-1);
    overflow: hidden;
    margin-top: 0.15rem;
  }

  .allure-fill {
    height: 100%;
    background: var(--color-accent);
  }
</style>
