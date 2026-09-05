<script lang="ts">
  import { _ } from 'svelte-i18n';
  import Modal from '../ui/Modal.svelte';
  import PlaceSearchInput from '../routePlanning/PlaceSearchInput.svelte';
  import { routePlan } from '../../stores/routePlan';
  import { telemetry } from '../../stores/telemetry';
  import {
    setDestination,
    setStartOverride,
    useCurrentPositionAsStart,
    beginPickStartOnMap,
    validateRoute,
    clearRoutePlan,
  } from '../../services/routePlanning';
  import type { PlaceResult } from '../../services/geocodingSearch';

  let { open = $bindable(false) }: { open?: boolean } = $props();

  let editingStart = $state(false);
  // Bumped on "Effacer" to force PlaceSearchInput to remount — it only
  // seeds its text from initialValue once (see the comment in that
  // component), so clearing the store alone wouldn't clear the field while
  // the modal stays open.
  let destinationFieldKey = $state(0);

  const startLabel = $derived(
    $routePlan.start?.label || `${$_('use_current_position')} (${$telemetry.lat.toFixed(3)}, ${$telemetry.lon.toFixed(3)})`
  );

  function onDestinationSelect(result: PlaceResult) {
    setDestination(result.lat, result.lon, result.label);
  }

  function onStartSelect(result: PlaceResult) {
    setStartOverride(result.lat, result.lon, result.label);
    editingStart = false;
  }

  function onUseCurrentPosition() {
    useCurrentPositionAsStart();
    editingStart = false;
  }

  function onPickOnMap() {
    beginPickStartOnMap();
    editingStart = false;
  }

  const errorKey = $derived(
    $routePlan.error === 'start_on_land'
      ? 'route_start_on_land_error'
      : $routePlan.error === 'destination_on_land'
        ? 'route_destination_on_land_error'
        : $routePlan.error === 'unreachable'
          ? 'route_unreachable_error'
          : $routePlan.error === 'search_failed'
            ? 'search_error'
            : null
  );

  const distanceNm = $derived($routePlan.route ? ($routePlan.route.distanceMeters / 1852).toFixed(1) : null);
</script>

<Modal bind:open title={$_('route_planning_title')}>
  <div class="route-plan">
    <div class="field-block">
      <span class="field-label">{$_('change_start_point')}</span>
      {#if editingStart}
        <PlaceSearchInput placeholder={$_('search_start_placeholder')} onSelect={onStartSelect} />
        <div class="start-actions">
          <button type="button" class="link-btn" onclick={onUseCurrentPosition}>{$_('use_current_position')}</button>
          <button type="button" class="link-btn" onclick={onPickOnMap}>{$_('pick_on_map')}</button>
          <button type="button" class="link-btn" onclick={() => (editingStart = false)}>{$_('cancel_btn')}</button>
        </div>
      {:else}
        <div class="start-display">
          <span>{startLabel}</span>
          <button type="button" class="link-btn" onclick={() => (editingStart = true)}>{$_('modify_btn')}</button>
        </div>
      {/if}
    </div>

    <div class="field-block">
      <span class="field-label">{$_('route_planning_title')}</span>
      {#key destinationFieldKey}
        <PlaceSearchInput
          placeholder={$_('search_destination_placeholder')}
          initialValue={$routePlan.destination?.label ?? ''}
          onSelect={onDestinationSelect}
        />
      {/key}
    </div>

    {#if errorKey}
      <p class="error-banner">{$_(errorKey)}</p>
    {/if}

    {#if distanceNm}
      <p class="distance-line">{$_('route_distance_lbl')} : <strong>{distanceNm} NM</strong></p>
    {/if}

    <div class="actions">
      <button type="button" class="clear-btn" onclick={() => { clearRoutePlan(); destinationFieldKey++; }}>{$_('clear_route')}</button>
      <button
        type="button"
        class="validate-btn"
        disabled={!$routePlan.destination || $routePlan.uiState === 'computing'}
        onclick={validateRoute}
      >
        {$routePlan.uiState === 'computing' ? $_('computing_route') + '…' : $_('validate_route')}
      </button>
    </div>
  </div>
</Modal>

<style>
  .route-plan {
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
  }

  .field-block {
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
  }

  .field-label {
    font-size: var(--text-xs);
    color: var(--color-text-muted);
    text-transform: uppercase;
    letter-spacing: 0.03em;
  }

  .start-display {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--space-2);
    padding: var(--space-2) var(--space-3);
    background: var(--surface-2);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    font-size: var(--text-sm);
  }

  .start-actions {
    display: flex;
    gap: var(--space-3);
    flex-wrap: wrap;
  }

  .link-btn {
    border: none;
    background: transparent;
    color: var(--color-accent);
    font-size: var(--text-xs);
    font-weight: 600;
    cursor: pointer;
    padding: 0;
  }

  .link-btn:hover {
    text-decoration: underline;
  }

  .error-banner {
    background: var(--color-danger-bg);
    color: var(--color-danger);
    border: 1px solid var(--color-danger);
    border-radius: var(--radius-md);
    padding: var(--space-2) var(--space-3);
    font-size: var(--text-sm);
  }

  .distance-line {
    font-size: var(--text-sm);
    color: var(--color-text-muted);
  }

  .actions {
    display: flex;
    gap: var(--space-2);
  }

  .clear-btn,
  .validate-btn {
    flex: 1;
    border: none;
    border-radius: var(--radius-lg);
    padding: var(--space-3);
    font-size: var(--text-sm);
    font-weight: 600;
    cursor: pointer;
  }

  .clear-btn {
    background: var(--surface-2);
    color: var(--color-text-muted);
  }

  .validate-btn {
    background: var(--color-accent);
    color: var(--slate-950);
  }

  .validate-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
</style>
