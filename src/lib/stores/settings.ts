import { persisted } from './persisted';

// Same storage key as the legacy app (localStorage 'sirroco_sim_options_enabled')
// so an existing user's preference (and the simulator tab's visibility) carries over.
export const simOptionsEnabled = persisted<boolean>('sirroco_sim_options_enabled', false);
