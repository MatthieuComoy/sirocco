<script lang="ts">
  import { _ } from 'svelte-i18n';
  import { theme, toggleTheme } from '../../stores/theme';
  import { simOptionsEnabled } from '../../stores/settings';
  import Toggle from '../ui/Toggle.svelte';
  import { playAlarmSound, stopAlarmSound } from '../../services/anchorAlarm';
  import { LANGS, LANG_NAMES, setLanguage, type Lang } from '../../i18n';
  import { locale } from 'svelte-i18n';

  let sirenTesting = $state(false);

  function toggleSirenTest() {
    sirenTesting = !sirenTesting;
    if (sirenTesting) playAlarmSound();
    else stopAlarmSound();
  }

  function onLangChange(e: Event) {
    setLanguage((e.target as HTMLSelectElement).value as Lang);
  }
</script>

<div class="general-pane">
  <h3>{$_('settings_general')}</h3>

  <div class="field">
    <span class="field-label">{$_('lang_lbl')}</span>
    <select class="select" value={$locale} onchange={onLangChange}>
      {#each LANGS as lang (lang)}
        <option value={lang}>{LANG_NAMES[lang]}</option>
      {/each}
    </select>
  </div>

  <div class="field">
    <span class="field-label">{$_('theme_lbl')}</span>
    <button class="btn" onclick={toggleTheme}>
      {$theme === 'dark' ? $_('theme_toggle_light') : $_('theme_toggle_dark')}
    </button>
  </div>

  <div class="field">
    <span class="field-label">{$_('siren_test')}</span>
    <button class="btn" class:danger={sirenTesting} onclick={toggleSirenTest}>
      {sirenTesting ? $_('stop_siren_test') : `🔊 ${$_('siren_test')}`}
    </button>
  </div>

  <div class="row">
    <span>{$_('settings_enable_simulation')}</span>
    <Toggle checked={$simOptionsEnabled} label={$_('settings_enable_simulation')} onchange={(v) => simOptionsEnabled.set(v)} />
  </div>
  <p class="hint">{$_('sim_options_hint')}</p>
</div>

<style>
  .general-pane {
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
  }

  h3 {
    font-size: var(--text-base);
    font-weight: 600;
  }

  .field {
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
  }

  .field-label {
    font-size: var(--text-sm);
    color: var(--color-text-muted);
  }

  .btn {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: var(--space-2);
    width: 100%;
    padding: var(--space-3);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
    background: var(--surface-2);
    color: var(--color-text);
    font-size: var(--text-sm);
    font-weight: 500;
    cursor: pointer;
  }

  .btn.danger {
    background: var(--color-danger-bg);
    color: var(--color-danger);
    border-color: var(--color-danger);
  }

  .select {
    width: 100%;
    padding: var(--space-3);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
    background: var(--surface-2);
    color: var(--color-text);
    font-size: var(--text-sm);
    font-weight: 500;
    cursor: pointer;
  }

  .row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-top: var(--space-3);
    border-top: 1px solid var(--color-border);
    font-size: var(--text-sm);
    font-weight: 500;
  }

  .hint {
    font-size: var(--text-xs);
    color: var(--color-text-muted);
    margin-top: calc(-1 * var(--space-2));
  }
</style>
