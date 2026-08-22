import { writable } from 'svelte/store';

export type WarningType = 'navarea' | 'avurnav' | 'avinav' | 'avurnav_local';

export type WarningGeometry =
  | { type: 'Point'; coordinates: [number, number] }
  | { type: 'MultiPoint'; coordinates: [number, number][] }
  | { type: 'Polygon'; coordinates: [number, number][] }
  | { type: 'LineString'; coordinates: [number, number][] };

export interface WarningPreamble {
  nameOfSeries: string;
  warningNumber: string;
  year: string;
  publicationDate: string;
  generalArea: string;
  hazardTypeGeneral: string;
}

export interface Warning {
  gmlId: string;
  type: WarningType;
  preamble: WarningPreamble | null;
  hazardTypeDetails: string;
  information: string;
  geometry: WarningGeometry | null;
  visible: boolean;
}

export interface WarningsFilter {
  showAll: boolean;
  showAvurnav: boolean;
  showAvurnavLocal: boolean;
  showAvinav: boolean;
}

export interface WarningsState {
  list: Warning[];
  loading: boolean;
  sourceInfo: string;
  filter: WarningsFilter;
  wmsEnabled: boolean;
}

export const warnings = writable<WarningsState>({
  list: [],
  loading: false,
  sourceInfo: '',
  filter: { showAll: true, showAvurnav: true, showAvurnavLocal: true, showAvinav: true },
  wmsEnabled: true,
});
