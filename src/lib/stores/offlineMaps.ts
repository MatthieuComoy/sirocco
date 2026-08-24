import { writable } from 'svelte/store';

export interface DownloadProgress {
  current: number;
  total: number;
  active: boolean;
  failed: number;
}

export interface OfflineMapsState {
  installed: Record<string, boolean>;
  downloads: Record<string, DownloadProgress>;
  storageUsedMB: number | null;
}

export const offlineMaps = writable<OfflineMapsState>({
  installed: {},
  downloads: {},
  storageUsedMB: null,
});
