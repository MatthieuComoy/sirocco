<script lang="ts">
  import { isAlarmTriggered, driftDistanceNm } from '../../stores/anchor';
  import { deactivateAnchor } from '../../services/anchorAlarm';
  import { stopRouteTracking } from '../../services/tracking';

  function stopAlarm() {
    deactivateAnchor();
    stopRouteTracking();
  }
</script>

{#if $isAlarmTriggered}
  <div class="alarm-overlay" role="alertdialog" aria-label="Alarme de mouillage">
    <div class="alarm-icon">⚓</div>
    <h1>Alarme de mouillage</h1>
    <p>Le bateau a dérivé au-delà du rayon de sécurité de l'ancre !</p>
    <div class="distance">{$driftDistanceNm.toFixed(3)} NM</div>
    <button class="stop-btn" onclick={stopAlarm}>Arrêter Alarme &amp; Trace</button>
  </div>
{/if}

<style>
  .alarm-overlay {
    position: fixed;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--space-3);
    background: rgba(120, 10, 10, 0.92);
    backdrop-filter: var(--glass-blur);
    color: white;
    text-align: center;
    padding: var(--space-4);
    z-index: 3000;
  }

  .alarm-icon {
    font-size: 4rem;
    animation: pulse-scale 1s ease-in-out infinite;
  }

  h1 {
    font-size: var(--text-2xl);
    font-weight: 700;
  }

  p {
    max-width: 26rem;
    opacity: 0.9;
  }

  .distance {
    font-family: var(--font-mono);
    font-size: var(--text-xl);
    font-weight: 700;
    background: rgba(0, 0, 0, 0.25);
    padding: var(--space-2) var(--space-4);
    border-radius: var(--radius-lg);
  }

  .stop-btn {
    margin-top: var(--space-3);
    border: none;
    border-radius: var(--radius-lg);
    background: white;
    color: #7a0a0a;
    font-weight: 700;
    font-size: var(--text-base);
    padding: var(--space-3) var(--space-6);
    cursor: pointer;
    width: min(24rem, 100%);
  }

  @keyframes pulse-scale {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.15); }
  }
</style>
