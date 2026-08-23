<script lang="ts">
  import { _ } from 'svelte-i18n';
  import { isTracking, savedTracks, type SavedTrack } from '../../stores/tracking';
  import { startRouteTracking, stopRouteTracking, clearHistory } from '../../services/tracking';
  import { trackPreviewRequest } from '../../stores/trackPreview';
  import TrackListItem from './TrackListItem.svelte';

  function showOnMap(track: SavedTrack) {
    trackPreviewRequest.set(track);
  }
</script>

<div class="tracking-panel">
  <div class="track-controls">
    {#if $isTracking}
      <button class="btn btn-danger" onclick={stopRouteTracking}>{$_('stop_track')}</button>
    {:else}
      <button class="btn btn-primary" onclick={startRouteTracking}>{$_('start_track')}</button>
    {/if}
  </div>

  <div class="history-header">
    <h3>{$_('routes_view')}</h3>
    {#if $savedTracks.length > 0}
      <button class="clear-btn" onclick={clearHistory}>{$_('clear_tracks')}</button>
    {/if}
  </div>

  <div class="history-list">
    {#if $savedTracks.length === 0}
      <p class="empty">{$_('no_tracks')}</p>
    {:else}
      {#each $savedTracks as track, index (track.date)}
        <TrackListItem {track} {index} onShowOnMap={showOnMap} />
      {/each}
    {/if}
  </div>
</div>

<style>
  .tracking-panel {
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
    padding: var(--space-4);
  }

  .track-controls .btn {
    width: 100%;
    padding: var(--space-3);
    border: none;
    border-radius: var(--radius-lg);
    font-weight: 600;
    font-size: var(--text-sm);
    cursor: pointer;
  }

  .btn-primary {
    background: var(--color-accent);
    color: var(--slate-950, #0b0f19);
  }

  .btn-danger {
    background: var(--color-danger-bg);
    color: var(--color-danger);
    border: 1px solid var(--color-danger);
  }

  .history-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .history-header h3 {
    font-size: var(--text-sm);
    text-transform: uppercase;
    letter-spacing: 0.04em;
    color: var(--color-text-muted);
  }

  .clear-btn {
    border: none;
    background: none;
    color: var(--color-danger);
    font-size: var(--text-xs);
    cursor: pointer;
  }

  .history-list {
    display: flex;
    flex-direction: column;
    gap: var(--space-3);
  }

  .empty {
    color: var(--color-text-muted);
    font-size: var(--text-sm);
  }
</style>
