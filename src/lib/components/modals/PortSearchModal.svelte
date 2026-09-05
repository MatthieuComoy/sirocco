<script lang="ts">
  import { _ } from 'svelte-i18n';
  import Modal from '../ui/Modal.svelte';
  import { loadPorts, searchPorts, type Port, type PortSearchResult } from '../../services/portSearch';
  import { geocodeQuery, findNearestKnownPort, fetchWikipediaSummary } from '../../services/portEnrichment';
  import { focusPort } from '../../stores/portFocus';
  import { online } from '../../stores/connectivity';

  let { open = $bindable(false) }: { open?: boolean } = $props();

  let query = $state('');
  let allPorts = $state<Port[]>([]);
  let loadError = $state(false);
  let inputEl: HTMLInputElement | undefined = $state();

  type OnlineSearchStatus = 'idle' | 'searching' | 'geocode_failed' | 'no_nearby_port';
  let onlineStatus = $state<OnlineSearchStatus>('idle');

  const results = $derived<PortSearchResult[]>(searchPorts(allPorts, query));

  $effect(() => {
    if (!open) return;
    loadPorts()
      .then((ports) => (allPorts = ports))
      .catch(() => (loadError = true));
    // Autofocus once the modal (and its input) has actually mounted.
    queueMicrotask(() => inputEl?.focus());
  });

  // Reset the online-search feedback whenever the query changes so a stale
  // "no nearby port" message doesn't linger under an unrelated new search.
  function onQueryInput() {
    onlineStatus = 'idle';
  }

  function pick(port: Port) {
    focusPort(port);
    open = false;
    query = '';
  }

  async function searchOnline() {
    const q = query.trim();
    if (!q) return;
    onlineStatus = 'searching';

    const place = await geocodeQuery(q);
    if (!place) {
      onlineStatus = 'geocode_failed';
      return;
    }

    const match = findNearestKnownPort(allPorts, place.lat, place.lon);
    if (!match) {
      onlineStatus = 'no_nearby_port';
      return;
    }

    const wiki = await fetchWikipediaSummary(match.port.city);
    focusPort(match.port, wiki);
    open = false;
    query = '';
    onlineStatus = 'idle';
  }
</script>

<Modal bind:open title={$_('port_search_title')} noBodyPadding>
  <div class="port-search">
    <div class="search-row">
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="11" cy="11" r="7" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
      <input
        bind:this={inputEl}
        bind:value={query}
        oninput={onQueryInput}
        type="text"
        placeholder={$_('port_search_placeholder')}
        autocomplete="off"
      />
    </div>

    <div class="results">
      {#if loadError}
        <p class="empty-state">{$_('port_search_load_error')}</p>
      {:else if query.trim().length < 2}
        <p class="empty-state">{$_('port_search_hint')}</p>
      {:else}
        {#if results.length === 0}
          <p class="empty-state">{$_('port_search_no_results')}</p>
        {:else}
          {#each results as result (result.port.id)}
            <button class="result-item" onclick={() => pick(result.port)}>
              <span class="result-name">{result.port.name}</span>
              <span class="result-city">{result.port.city}</span>
            </button>
          {/each}
        {/if}

        {#if $online}
          <div class="online-search">
            {#if onlineStatus === 'searching'}
              <p class="empty-state">{$_('port_search_online_searching')}</p>
            {:else}
              <button class="online-search-btn" onclick={searchOnline}>
                {$_('port_search_online_btn', { values: { query } })}
              </button>
              {#if onlineStatus === 'geocode_failed'}
                <p class="online-feedback">{$_('port_search_online_geocode_failed')}</p>
              {:else if onlineStatus === 'no_nearby_port'}
                <p class="online-feedback">{$_('port_search_online_no_port')}</p>
              {/if}
            {/if}
          </div>
        {/if}
      {/if}
    </div>
  </div>
</Modal>

<style>
  .port-search {
    display: flex;
    flex-direction: column;
    min-height: 0;
  }

  .search-row {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    padding: var(--space-3) var(--space-4);
    border-bottom: 1px solid var(--color-border);
    color: var(--color-text-muted);
    flex-shrink: 0;
  }

  .search-row input {
    flex: 1;
    border: none;
    background: transparent;
    color: var(--color-text);
    font-size: var(--text-base);
    outline: none;
  }

  .results {
    overflow-y: auto;
    padding: var(--space-2);
  }

  .empty-state {
    padding: var(--space-4);
    text-align: center;
    color: var(--color-text-muted);
    font-size: var(--text-sm);
  }

  .result-item {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    width: 100%;
    text-align: left;
    padding: var(--space-2) var(--space-3);
    border: none;
    border-radius: var(--radius-md);
    background: transparent;
    color: var(--color-text);
    cursor: pointer;
    transition: background var(--dur-fast);
  }

  .result-item:hover {
    background: var(--surface-2);
  }

  .result-name {
    font-weight: 600;
    font-size: var(--text-sm);
  }

  .result-city {
    font-size: var(--text-xs);
    color: var(--color-text-muted);
  }

  .online-search {
    margin-top: var(--space-2);
    padding-top: var(--space-2);
    border-top: 1px solid var(--color-border);
  }

  .online-search-btn {
    width: 100%;
    text-align: left;
    padding: var(--space-2) var(--space-3);
    border: none;
    border-radius: var(--radius-md);
    background: transparent;
    color: var(--color-accent);
    font-size: var(--text-sm);
    font-weight: 500;
    cursor: pointer;
    transition: background var(--dur-fast);
  }

  .online-search-btn:hover {
    background: var(--color-accent-bg);
  }

  .online-feedback {
    padding: 0 var(--space-3);
    font-size: var(--text-xs);
    color: var(--color-text-muted);
  }
</style>
