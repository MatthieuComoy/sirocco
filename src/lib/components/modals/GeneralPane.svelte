<script lang="ts">
  import { theme, toggleTheme } from '../../stores/theme';
  import { simOptionsEnabled } from '../../stores/settings';
  import Toggle from '../ui/Toggle.svelte';
  import { playAlarmSound, stopAlarmSound } from '../../services/anchorAlarm';

  let sirenTesting = $state(false);

  function toggleSirenTest() {
    sirenTesting = !sirenTesting;
    if (sirenTesting) playAlarmSound();
    else stopAlarmSound();
  }
</script>

<div class="general-pane">
  <h3>Général</h3>

  <div class="field">
    <span class="field-label">Thème</span>
    <button class="btn" onclick={toggleTheme}>
      🌓 Passer en thème {$theme === 'dark' ? 'clair' : 'sombre'}
    </button>
  </div>

  <div class="field">
    <span class="field-label">Sirène</span>
    <button class="btn" class:danger={sirenTesting} onclick={toggleSirenTest}>
      {sirenTesting ? '⏹ Arrêter le test' : '🔊 Tester la sirène'}
    </button>
  </div>

  <div class="row">
    <span>Options de simulation</span>
    <Toggle checked={$simOptionsEnabled} label="Options de simulation" onchange={(v) => simOptionsEnabled.set(v)} />
  </div>
  <p class="hint">Affiche l'onglet Simulateur GPS pour tester l'application sans être en mer.</p>
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
