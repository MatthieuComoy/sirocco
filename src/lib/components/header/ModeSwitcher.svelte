<script lang="ts">
  import { _ } from 'svelte-i18n';
  import { appMode, type AppMode } from '../../stores/appMode';
  import { switchAppMode } from '../../services/appModeController';
  import { density } from '../../stores/viewport';
  import { isTracking } from '../../stores/tracking';

  const MODES: { id: AppMode; labelKey: string; icon: string }[] = [
    {
      id: 'consultation',
      labelKey: 'mode_consultation',
      icon: 'M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z',
    },
    {
      id: 'navigation',
      labelKey: 'mode_navigation',
      icon: 'M12 2L4.5 20.29L5.21 21L12 18L18.79 21L19.5 20.29L12 2Z',
    },
    {
      id: 'weather',
      labelKey: 'mode_weather',
      icon: 'M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z',
    },
  ];
</script>

<div class="mode-switcher" role="tablist">
  {#each MODES as m (m.id)}
    <button
      role="tab"
      aria-selected={$appMode === m.id}
      class="mode-btn"
      class:active={$appMode === m.id}
      onclick={() => switchAppMode(m.id)}
    >
      <svg viewBox="0 0 24 24" width="16" height="16">
        {#if m.id === 'weather'}
          <path d={m.icon} fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" />
        {:else}
          <path d={m.icon} fill="currentColor" />
        {/if}
      </svg>
      {#if $density !== 'mobile'}<span class="mode-label">{$_(m.labelKey)}</span>{/if}
      {#if m.id === 'navigation' && $isTracking}
        <span class="rec-indicator">
          <span class="rec-dot"></span>
          {#if $density !== 'mobile'}<span class="mode-label">REC</span>{/if}
        </span>
      {/if}
    </button>
  {/each}
</div>

<style>
  .mode-switcher {
    display: flex;
    gap: var(--space-1);
    background: var(--surface-2);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
    padding: 0.2rem;
  }

  .mode-btn {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    padding: 0.4rem 0.7rem;
    border: none;
    border-radius: var(--radius-md);
    background: transparent;
    color: var(--color-text-muted);
    font-size: var(--text-sm);
    font-weight: 500;
    cursor: pointer;
    transition: background var(--dur-fast) var(--ease-standard), color var(--dur-fast);
  }

  .mode-btn:hover {
    color: var(--color-text);
  }

  .mode-btn.active {
    background: var(--color-accent-bg);
    color: var(--color-accent);
  }

  .rec-indicator {
    display: flex;
    align-items: center;
    gap: 0.3rem;
    font-size: 0.7rem;
    font-weight: 700;
    letter-spacing: 0.05em;
    color: var(--color-danger);
  }

  .rec-dot {
    width: 0.4rem;
    height: 0.4rem;
    border-radius: 50%;
    background: var(--color-danger);
    box-shadow: 0 0 6px var(--color-danger);
    animation: pulse-scale 1.2s ease-in-out infinite;
  }

  @keyframes pulse-scale {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.35; }
  }

  /* Header's own width, not the viewport's — see .app-header's `container`. */
  @container app-header (max-width: 900px) {
    .mode-label {
      display: none;
    }
  }
</style>
