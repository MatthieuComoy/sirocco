import { writable } from 'svelte/store';

/** Whether the map should follow the boat position (navigation mode). Reset
 *  to false as soon as the user manually drags the map. */
export const autoCenter = writable(true);
