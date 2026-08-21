import { persisted } from './persisted';

export interface BoatProfile {
  name: string;
  length: number;
  width: number;
  draft: number;
  clearance: number;
}

// Defaults + storage key match the legacy app (js/state.js, localStorage
// key 'sirroco_boat_profile') so existing installs keep their saved profile.
export const boatProfile = persisted<BoatProfile>('sirroco_boat_profile', {
  name: 'Sirroco II',
  length: 11.5,
  width: 3.8,
  draft: 1.9,
  clearance: 0.5,
});
