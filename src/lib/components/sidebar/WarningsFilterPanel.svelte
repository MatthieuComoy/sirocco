<script lang="ts">
  import { _ } from 'svelte-i18n';
  import { warnings } from '../../stores/warnings';
  import { setWarningsFilter } from '../../services/pingWarnings';
  import Toggle from '../ui/Toggle.svelte';
  import Collapsible from '../ui/Collapsible.svelte';

  const activeCount = $derived($warnings.list.filter((w) => w.visible).length);
  const sourceBadge = $derived.by(() => {
    if ($warnings.loading) return { text: $_('loading_lbl') + '…', color: 'var(--color-text-muted)' };
    if ($warnings.sourceInfo === 'local') return { text: $_('offline_badge'), color: 'var(--color-warning)' };
    if ($warnings.sourceInfo.includes('offline')) return { text: 'Mixte', color: 'var(--color-accent)' };
    if ($warnings.sourceInfo === 'live') return { text: 'Direct', color: 'var(--color-success)' };
    return null;
  });
</script>

<div class="warnings-panel">
  <div class="row master">
    <div class="label">
      <span>{$_('nav_warnings_title')}</span>
      <span class="count">{activeCount} {$_('active_count_lbl')}{#if sourceBadge} · <span style:color={sourceBadge.color}>{sourceBadge.text}</span>{/if}</span>
    </div>
    <Toggle checked={$warnings.filter.showAll} label={$_('nav_warnings_title')} onchange={(v) => setWarningsFilter({ showAll: v })} />
  </div>

  <Collapsible title="Catégories">
    <div class="row">
      <span>AVURNAV</span>
      <Toggle checked={$warnings.filter.showAvurnav} label="AVURNAV" onchange={(v) => setWarningsFilter({ showAvurnav: v })} />
    </div>
    <div class="row">
      <span>AVURNAV Local</span>
      <Toggle checked={$warnings.filter.showAvurnavLocal} label="AVURNAV Local" onchange={(v) => setWarningsFilter({ showAvurnavLocal: v })} />
    </div>
    <div class="row">
      <span>AVINAV</span>
      <Toggle checked={$warnings.filter.showAvinav} label="AVINAV" onchange={(v) => setWarningsFilter({ showAvinav: v })} />
    </div>
  </Collapsible>
</div>

<style>
  .warnings-panel {
    display: flex;
    flex-direction: column;
    gap: var(--space-3);
    padding-bottom: var(--space-3);
    border-bottom: 1px solid var(--color-border);
  }

  .row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: var(--text-sm);
  }

  .row.master {
    align-items: flex-start;
  }

  .label {
    display: flex;
    flex-direction: column;
    gap: 0.15rem;
  }

  .count {
    font-size: var(--text-xs);
    color: var(--color-text-muted);
  }
</style>
