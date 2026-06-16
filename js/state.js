// Sirroco Marine Navigation Shared State Object

export const state = {
  map: null,
  userMarker: null,
  trackLine: null,
  currentTrack: [],
  isTracking: false,
  savedTracks: [],

  // App Operation Modes
  appMode: 'consultation', // 'consultation', 'navigation', or 'weather'
  autoCenter: true, // Auto-center map on user/boat position

  // Boat Profile
  boatProfile: {
    name: 'Sirroco II',
    length: 11.5,
    width: 3.8,
    draft: 1.9,
    clearance: 0.5
  },

  // Navigation Session Stats
  navigationStartTime: null,
  navigationDistance: 0,
  lastNavLatLng: null,
  navTimerInterval: null,

  // Harbors (Ports de plaisance) dynamic data state
  currentHarbors: [],
  harborMarkers: [],
  harborsLayer: null,
  allHarborsCache: new Map(),
  isFetchingHarbors: false,
  harborsDebounceTimeout: null,

  // Anchor Alarm State
  isAnchorAlarmActive: false,
  anchorLatLng: null,
  alarmRadius: 0.030, // default 0.030 NM (approx. 55 meters)
  anchorMarker: null,
  anchorCircle: null,

  // Telemetry State
  currentLat: 43.1167, // Toulon Lat
  currentLon: 5.9333,  // Toulon Lon
  currentSpeed: 0.0,   // Knots
  currentHeading: 0,   // Degrees
  currentWindDirection: null, // Degrees (from weather API)

  // GPS Simulation State
  isSimulating: true, // default true for testing and PC environment
  simHeading: 180,    // south
  simSpeed: 4.5,      // 4.5 knots
  simTimer: null,
  isDrifting: false,

  // Web Audio API Synth Alarm
  audioCtx: null,
  alarmOscInterval: null,

  // Weather & Tide Calculations & Drawing
  lastFetchedLat: null,
  lastFetchedLon: null,
  weatherDebounceTimeout: null,
  currentTideData: null,

  // Danger Zone Layers
  dangerZoneLayer: null,
  avurnavNotices: [],
  pingWmsLayer: null,
  osm: null,
  openseamap: null,

  // General App settings
  currentLang: 'fr' // Default to French
};
