<script lang="ts">
  import { _ } from 'svelte-i18n';
  import { searchPlaces, type PlaceResult } from '../../services/geocodingSearch';

  let {
    placeholder,
    initialValue = '',
    onSelect,
  }: {
    placeholder: string;
    initialValue?: string;
    onSelect: (result: PlaceResult) => void;
  } = $props();

  const DEBOUNCE_MS = 350;
  const REQUEST_TIMEOUT_MS = 5000;
  const MIN_QUERY_LENGTH = 2;

  // Seeded once on mount, deliberately not kept in sync with a later
  // `initialValue` change — this component is fully remounted each time
  // RoutePlanModal reopens (Modal.svelte only renders its children inside
  // an {#if open} block), so a fresh mount already gets a fresh initial
  // value; re-syncing on every prop change would instead clobber whatever
  // the user is actively typing.
  let query = $state(initialValue);
  let results = $state<PlaceResult[]>([]);
  let status = $state<'idle' | 'loading' | 'empty' | 'error'>('idle');
  let debounceTimer: ReturnType<typeof setTimeout> | null = null;
  let abortController: AbortController | null = null;

  async function runSearch(q: string) {
    status = 'loading';
    abortController?.abort();
    abortController = new AbortController();
    const timeoutId = setTimeout(() => abortController?.abort(), REQUEST_TIMEOUT_MS);
    try {
      const found = await searchPlaces(q, abortController.signal);
      results = found;
      status = found.length === 0 ? 'empty' : 'idle';
    } catch (err) {
      // A newer keystroke aborting this same request isn't a real error.
      if ((err as Error)?.name !== 'AbortError') {
        results = [];
        status = 'error';
      }
    } finally {
      clearTimeout(timeoutId);
    }
  }

  function onInput() {
    if (debounceTimer) clearTimeout(debounceTimer);
    const q = query.trim();
    if (q.length < MIN_QUERY_LENGTH) {
      abortController?.abort();
      results = [];
      status = 'idle';
      return;
    }
    debounceTimer = setTimeout(() => runSearch(q), DEBOUNCE_MS);
  }

  function select(result: PlaceResult) {
    query = result.label;
    results = [];
    status = 'idle';
    onSelect(result);
  }
</script>

<div class="place-search">
  <input type="text" bind:value={query} oninput={onInput} {placeholder} />

  {#if status === 'loading'}
    <p class="hint">{$_('searching_lbl')}…</p>
  {:else if status === 'empty'}
    <p class="hint">{$_('search_no_results')}</p>
  {:else if status === 'error'}
    <p class="hint error">{$_('search_error')}</p>
  {:else if results.length > 0}
    <ul class="results">
      <!-- Indexed, not content-keyed: Nominatim can return two results with
           the same label and coordinates (seen for common place names like
           "Paris"), and the whole list is always replaced wholesale on
           every search anyway — no cross-update identity to preserve. -->
      {#each results as result, i (i)}
        <li>
          <button type="button" onclick={() => select(result)}>{result.label}</button>
        </li>
      {/each}
    </ul>
  {/if}
</div>

<style>
  .place-search {
    display: flex;
    flex-direction: column;
    gap: var(--space-1);
    position: relative;
  }

  input {
    padding: var(--space-2) var(--space-3);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    background: var(--surface-2);
    color: var(--color-text);
    font-size: var(--text-sm);
  }

  input:focus {
    outline: 2px solid var(--color-accent);
    outline-offset: -1px;
  }

  .hint {
    font-size: var(--text-xs);
    color: var(--color-text-muted);
    padding: 0 var(--space-1);
  }

  .hint.error {
    color: var(--color-danger);
  }

  .results {
    display: flex;
    flex-direction: column;
    gap: 2px;
    max-height: 12rem;
    overflow-y: auto;
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    background: var(--surface-1);
  }

  .results button {
    width: 100%;
    text-align: left;
    padding: var(--space-2) var(--space-3);
    border: none;
    background: transparent;
    color: var(--color-text);
    font-size: var(--text-sm);
    cursor: pointer;
  }

  .results button:hover {
    background: var(--surface-2);
  }
</style>
