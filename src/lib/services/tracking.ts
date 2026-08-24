// Ported from legacy/js/tracking.js — GPX export and stats are pure; only the
// DOM writes (history list rendering, window.* globals) were dropped, replaced
// by TrackList.svelte reading the `savedTracks` store directly.
import { get } from 'svelte/store';
import { telemetry } from '../stores/telemetry';
import { currentTrack, isTracking, savedTracks, type SavedTrack, type TrackPoint } from '../stores/tracking';
import { calculateHaversineDistance, escapeXml, getPointOfSail, type PointOfSail } from './utils';

const POINTS_OF_SAIL: PointOfSail[] = [
  'Bout au vent', 'Près', 'Bon plein', 'Travers', 'Largue', 'Grand largue', 'Vent arrière',
];

function snapshotPoint(): TrackPoint {
  const t = get(telemetry);
  const windDir = t.windDirectionDeg ?? 290;
  return {
    lat: t.lat,
    lng: t.lon,
    time: Date.now(),
    speed: t.speedKts,
    heading: t.headingDeg,
    windDir,
    pointOfSail: getPointOfSail(t.headingDeg, windDir),
  };
}

export function startRouteTracking() {
  if (get(isTracking)) return;
  isTracking.set(true);
  currentTrack.set([snapshotPoint()]);
}

/** Called by positionOrchestrator on every telemetry update while tracking. */
export function pushTrackPoint() {
  currentTrack.update((track) => [...track, snapshotPoint()]);
}

function calculateTrackDistance(points: TrackPoint[]): number {
  let total = 0;
  for (let i = 0; i < points.length - 1; i++) {
    total += calculateHaversineDistance(points[i].lat, points[i].lng, points[i + 1].lat, points[i + 1].lng);
  }
  return total;
}

export function stopRouteTracking() {
  if (!get(isTracking)) return;
  isTracking.set(false);

  const track = get(currentTrack);
  if (track.length <= 1) return;

  const name = `Track ${new Date().toLocaleDateString('fr-FR')} ${new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`;
  const speeds = track.map((p) => p.speed || 0);
  const maxSpeed = Math.max(...speeds, 0);
  const avgSpeed = speeds.length > 0 ? speeds.reduce((a, b) => a + b, 0) / speeds.length : 0;

  const recap = Object.fromEntries(POINTS_OF_SAIL.map((p) => [p, 0])) as Record<PointOfSail, number>;
  for (let i = 0; i < track.length - 1; i++) {
    const durationMs = track[i + 1].time - track[i].time;
    if (durationMs > 0 && durationMs < 600000) {
      recap[track[i].pointOfSail] += durationMs;
    }
  }

  const saved: SavedTrack = {
    name,
    date: new Date().toISOString(),
    coordinates: track,
    distance: calculateTrackDistance(track),
    avgSpeed,
    maxSpeed,
    pointsOfSailRecap: recap,
  };

  savedTracks.update((tracks) => [...tracks, saved]);
}

export function deleteTrack(index: number) {
  if (!confirm('Supprimer cette trace ?')) return;
  savedTracks.update((tracks) => tracks.filter((_, i) => i !== index));
}

export function clearHistory() {
  savedTracks.set([]);
}

export function exportTrackToGPX(track: SavedTrack) {
  const name = track.name;
  const dateStr = track.date;

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<gpx version="1.1" creator="Sirroco Marine" xmlns="http://www.topografix.com/GPX/1/1" xmlns:sirroco="https://sirroco.app/gpx/1/0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd">\n`;
  xml += `  <metadata>\n    <name>${escapeXml(name)}</name>\n    <time>${dateStr}</time>\n  </metadata>\n`;
  xml += `  <trk>\n    <name>${escapeXml(name)}</name>\n`;

  xml += `    <extensions>\n`;
  xml += `      <sirroco:distanceNM>${(track.distance / 1852).toFixed(2)}</sirroco:distanceNM>\n`;
  xml += `      <sirroco:avgSpeedKts>${track.avgSpeed.toFixed(2)}</sirroco:avgSpeedKts>\n`;
  xml += `      <sirroco:maxSpeedKts>${track.maxSpeed.toFixed(2)}</sirroco:maxSpeedKts>\n`;
  Object.entries(track.pointsOfSailRecap).forEach(([allure, ms]) => {
    if (ms > 0) {
      const tag = allure.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-zA-Z0-9]/g, '');
      xml += `      <sirroco:duration${tag}Ms>${ms}</sirroco:duration${tag}Ms>\n`;
    }
  });
  xml += `    </extensions>\n    <trkseg>\n`;

  track.coordinates.forEach((pt) => {
    xml += `      <trkpt lat="${pt.lat.toFixed(6)}" lon="${pt.lng.toFixed(6)}">\n`;
    xml += `        <time>${new Date(pt.time).toISOString()}</time>\n`;
    xml += `        <extensions>\n`;
    xml += `          <speed>${(pt.speed * 0.514444).toFixed(2)}</speed>\n`;
    xml += `          <sirroco:speedKts>${pt.speed.toFixed(1)}</sirroco:speedKts>\n`;
    xml += `          <sirroco:heading>${Math.round(pt.heading)}</sirroco:heading>\n`;
    xml += `          <sirroco:windDir>${Math.round(pt.windDir)}</sirroco:windDir>\n`;
    xml += `          <sirroco:pointOfSail>${escapeXml(pt.pointOfSail)}</sirroco:pointOfSail>\n`;
    xml += `        </extensions>\n      </trkpt>\n`;
  });

  xml += `    </trkseg>\n  </trk>\n</gpx>`;

  const blob = new Blob([xml], { type: 'application/gpx+xml' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.gpx`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
