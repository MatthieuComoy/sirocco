<script lang="ts">
  import { onMount } from 'svelte';
  import { offlineMaps } from '../../stores/offlineMaps';
  import {
    OFFLINE_REGIONS,
    estimateRegionSizeMB,
    startOfflineDownload,
    cancelOfflineDownload,
    deleteOfflineRegion,
    initOfflineMaps,
  } from '../../services/offlineMaps';

  onMount(() => {
    initOfflineMaps();
  });

  const storageText = $derived(
    $offlineMaps.storageUsedMB !== null ? `${$offlineMaps.storageUsedMB.toFixed(1)} MB utilisés` : 'Indisponible'
  );
</script>

<div class="offline-panel">
  <p class="storage-line">{storageText}</p>

  {#each OFFLINE_REGIONS as region (region.id)}
    {@const download = $offlineMaps.downloads[region.id]}
    {@const isInstalled = $offlineMaps.installed[region.id]}
    {@const pct = download ? Math.round((download.current / download.total) * 100) : 0}
    <div class="region-card">
      <div class="region-header">
        <div>
          <div class="region-title">{region.name}</div>
          <p class="region-desc">{region.desc}</p>
        </div>
        <span class="status" class:installed={isInstalled} class:downloading={!!download}>
          {#if download}Téléchargement… ({pct}%){:else if isInstalled}Installée{:else}Non installée{/if}
        </span>
      </div>

      {#if download}
        <div class="progress-track"><div class="progress-fill" style:width="{pct}%"></div></div>
      {/if}

      <div class="region-footer">
        <span class="meta">Taille estimée : <strong>{estimateRegionSizeMB(region).toFixed(1)} MB</strong></span>
        {#if download}
          <button class="action-btn cancel" onclick={() => cancelOfflineDownload(region.id)}>Annuler</button>
        {:else if isInstalled}
          <button class="action-btn delete" onclick={() => deleteOfflineRegion(region.id)}>🗑️ Supprimer</button>
        {:else}
          <button class="action-btn download" onclick={() => startOfflineDownload(region.id)}>📥 Télécharger</button>
        {/if}
      </div>
    </div>
  {/each}
</div>

<style>
  .offline-panel {
    display: flex;
    flex-direction: column;
    gap: var(--space-3);
  }

  .storage-line {
    font-size: var(--text-xs);
    color: var(--color-text-muted);
    text-align: right;
  }

  .region-card {
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
    padding: var(--space-3);
    background: var(--surface-2);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
  }

  .region-header {
    display: flex;
    justify-content: space-between;
    gap: var(--space-2);
  }

  .region-title {
    font-weight: 600;
    font-size: var(--text-sm);
  }

  .region-desc {
    font-size: var(--text-xs);
    color: var(--color-text-muted);
    margin-top: 0.15rem;
  }

  .status {
    flex-shrink: 0;
    font-size: var(--text-xs);
    color: var(--color-text-muted);
    white-space: nowrap;
  }

  .status.installed {
    color: var(--color-success);
  }

  .status.downloading {
    color: var(--color-accent);
  }

  .progress-track {
    height: 0.4rem;
    border-radius: 999px;
    background: var(--surface-1);
    overflow: hidden;
  }

  .progress-fill {
    height: 100%;
    background: var(--color-accent);
    transition: width var(--dur-fast) linear;
  }

  .region-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--space-2);
  }

  .meta {
    font-size: var(--text-xs);
    color: var(--color-text-muted);
  }

  .action-btn {
    border: none;
    border-radius: var(--radius-md);
    padding: 0.35rem 0.75rem;
    font-size: var(--text-xs);
    font-weight: 600;
    cursor: pointer;
  }

  .action-btn.download {
    background: var(--color-accent-bg);
    color: var(--color-accent);
  }

  .action-btn.delete {
    background: var(--color-danger-bg);
    color: var(--color-danger);
  }

  .action-btn.cancel {
    background: var(--surface-1);
    color: var(--color-text-muted);
  }
</style>
