import { writable } from 'svelte/store';

/** Grounding / shallow-depth warning text, shown by DangerBanner in navigation
 *  mode. null when clear. Text is hardcoded French for now — full i18n lands
 *  in Phase 10 (see legacy js/app.js::updatePosition for the fr/en pair). */
export const dangerWarning = writable<string | null>(null);
