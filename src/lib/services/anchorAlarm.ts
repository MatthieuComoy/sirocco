// Ported from legacy/js/anchorAlarm.js — Web Audio siren logic kept identical
// (lazy AudioContext creation, sawtooth sweep 880→440Hz every 600ms).
import { get } from 'svelte/store';
import { anchor, isAlarmTriggered, type AnchorLatLng } from '../stores/anchor';
import { telemetry } from '../stores/telemetry';

let audioCtx: AudioContext | null = null;
let alarmOscInterval: ReturnType<typeof setInterval> | null = null;
let started = false;

export function activateAnchor(resetRadius = false) {
  const t = get(telemetry);
  anchor.update((a) => ({
    active: true,
    latLng: { lat: t.lat, lon: t.lon },
    radiusNm: resetRadius ? 0.03 : a.radiusNm,
  }));
}

export function deactivateAnchor() {
  anchor.update((a) => ({ ...a, active: false, latLng: null }));
  stopAlarmSound();
}

export function setAnchorRadius(radiusNm: number) {
  anchor.update((a) => ({ ...a, radiusNm }));
}

export function moveAnchor(lat: number, lon: number) {
  anchor.update((a) => ({ ...a, latLng: { lat, lon } }));
}

export function playAlarmSound() {
  if (!audioCtx) {
    audioCtx = new AudioContext();
  }
  if (alarmOscInterval) return;

  alarmOscInterval = setInterval(() => {
    if (!audioCtx) return;
    if (audioCtx.state === 'suspended') audioCtx.resume();

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(880, audioCtx.currentTime);
    osc.frequency.linearRampToValueAtTime(440, audioCtx.currentTime + 0.45);

    gain.gain.setValueAtTime(0.6, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.49);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + 0.5);
  }, 600);
}

export function stopAlarmSound() {
  if (alarmOscInterval) {
    clearInterval(alarmOscInterval);
    alarmOscInterval = null;
  }
}

/** Starts/stops the siren as isAlarmTriggered flips — call once at bootstrap. */
export function initAnchorAlarm() {
  if (started) return;
  started = true;
  isAlarmTriggered.subscribe((triggered) => {
    if (triggered) playAlarmSound();
    else stopAlarmSound();
  });
}

export type { AnchorLatLng };
