<script lang="ts">
  import { boatProfile } from '../../stores/boatProfile';

  let form = $state({ ...$boatProfile });
  let saved = $state(false);

  function submit(e: SubmitEvent) {
    e.preventDefault();
    boatProfile.set({ ...form });
    saved = true;
    setTimeout(() => (saved = false), 1500);
  }
</script>

<form class="boat-pane" onsubmit={submit}>
  <h3>Mon Bateau</h3>

  <div class="field">
    <label for="boat-name">Nom du Bateau</label>
    <input id="boat-name" type="text" bind:value={form.name} required />
  </div>

  <div class="field-row">
    <div class="field">
      <label for="boat-length">Longueur (m)</label>
      <input id="boat-length" type="number" step="0.1" min="1" bind:value={form.length} required />
    </div>
    <div class="field">
      <label for="boat-width">Largeur (m)</label>
      <input id="boat-width" type="number" step="0.1" min="0.5" bind:value={form.width} required />
    </div>
  </div>

  <div class="field-row">
    <div class="field">
      <label for="boat-draft">Tirant d'eau (m)</label>
      <input id="boat-draft" type="number" step="0.1" min="0.1" bind:value={form.draft} required />
    </div>
    <div class="field">
      <label for="boat-clearance">Pied de pilote (m)</label>
      <input id="boat-clearance" type="number" step="0.1" min="0" bind:value={form.clearance} required />
    </div>
  </div>

  <button type="submit" class="save-btn">{saved ? '✓ Profil enregistré' : 'Enregistrer le Profil'}</button>
</form>

<style>
  .boat-pane {
    display: flex;
    flex-direction: column;
    gap: var(--space-3);
  }

  h3 {
    font-size: var(--text-base);
    font-weight: 600;
  }

  .field {
    display: flex;
    flex-direction: column;
    gap: var(--space-1);
    flex: 1;
  }

  .field label {
    font-size: var(--text-xs);
    color: var(--color-text-muted);
  }

  .field input {
    padding: var(--space-2) var(--space-3);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    background: var(--surface-2);
    color: var(--color-text);
    font-size: var(--text-sm);
  }

  .field input:focus {
    outline: 2px solid var(--color-accent);
    outline-offset: -1px;
  }

  .field-row {
    display: flex;
    gap: var(--space-3);
  }

  .save-btn {
    margin-top: var(--space-2);
    border: none;
    border-radius: var(--radius-lg);
    background: var(--color-accent);
    color: var(--slate-950, #0b0f19);
    font-weight: 600;
    font-size: var(--text-sm);
    padding: var(--space-3);
    cursor: pointer;
  }
</style>
