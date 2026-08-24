// Tide math extracted from legacy/js/utils.js (calculateTidesForDay /
// getTideRangeForCoords) for readability — pure, no DOM/state access. Not
// real harmonic tide data: amplitude is a hardcoded per-region approximation
// and the phase is derived from a simulated moon age. Reproduced as-is.
import { calculateHaversineDistance } from './utils';

export interface TideSample {
  hour: number;
  height: number;
}

export interface TideExtreme {
  type: 'high' | 'low';
  timeStr: string;
  hour: number;
  height: number;
  isTomorrow: boolean;
}

export interface TideData {
  range: number;
  coefficient: number;
  samples: TideSample[];
  extremes: TideExtreme[];
  currentHeight: number;
  currentHour: number;
}

export function getTideRangeForCoords(lat: number, lon: number): number {
  // Mediterranean Sea: tiny tides (0.15m - 0.35m)
  if (lat >= 30 && lat <= 46 && lon >= -6 && lon <= 36) return 0.3;

  // English Channel & North Sea: huge tides!
  if (lat >= 48.2 && lat <= 58 && lon >= -6 && lon <= 9) {
    const distToStMalo = calculateHaversineDistance(lat, lon, 48.64, -2.02);
    if (distToStMalo < 120000) return 11.5; // within 120km of St Malo
    return 6.5;
  }

  // French & Iberian Atlantic: medium-high tides
  if (lat >= 36 && lat <= 48.2 && lon >= -10 && lon <= -1) return 4.2;

  // Baltic Sea: very small tides
  if (lat >= 53 && lat <= 70 && lon >= 9 && lon <= 30) return 0.15;

  // US East Coast / Atlantic: medium
  if (lat >= 25 && lat <= 48 && lon >= -85 && lon <= -65) return 2.2;

  // US West Coast / Pacific: medium
  if (lat >= 30 && lat <= 60 && lon >= -130 && lon <= -115) return 2.6;

  return 2.0; // Default ocean range
}

export function calculateTidesForDay(lat: number, lon: number, date: Date): TideData {
  const baseRange = getTideRangeForCoords(lat, lon);

  const knownNewMoon = new Date('2000-01-06T18:14:00Z');
  const msPerDay = 24 * 60 * 60 * 1000;
  const daysSinceNewMoon = ((date.getTime() - knownNewMoon.getTime()) / msPerDay) % 29.530588853;

  const springNeapFactor = 0.85 + 0.35 * Math.cos((2 * Math.PI * (daysSinceNewMoon % 14.765294)) / 14.765294);
  const tideCoefficient = Math.round(20 + 100 * ((springNeapFactor - 0.5) / 0.8));

  const longitudeOffsetHours = -lon / 15.0;
  let rawHighTideHour = (daysSinceNewMoon * 0.835 + longitudeOffsetHours + 2.5) % 12.4206;
  if (rawHighTideHour < 0) rawHighTideHour += 12.4206;

  const samples: TideSample[] = [];
  const amplitude = (baseRange / 2) * springNeapFactor;
  const meanLevel = baseRange / 2 + 0.1;

  for (let i = 0; i <= 96; i++) {
    const decimalHour = i * 0.5;
    const height = meanLevel + amplitude * Math.cos((2 * Math.PI * (decimalHour - rawHighTideHour)) / 12.4206);
    samples.push({ hour: decimalHour, height: Math.max(0.01, height) });
  }

  const extremesRaw: { type: 'high' | 'low'; hour: number; height: number }[] = [];
  for (let i = 1; i < samples.length - 1; i++) {
    const prev = samples[i - 1].height;
    const curr = samples[i].height;
    const next = samples[i + 1].height;
    if (curr > prev && curr > next) extremesRaw.push({ type: 'high', hour: samples[i].hour, height: curr });
    else if (curr < prev && curr < next) extremesRaw.push({ type: 'low', hour: samples[i].hour, height: curr });
  }

  const formatTime = (decimalHour: number) => {
    const h = Math.floor(decimalHour) % 24;
    const m = Math.round((decimalHour % 1) * 60);
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
  };

  const extremes: TideExtreme[] = extremesRaw.map((e) => ({
    type: e.type,
    timeStr: formatTime(e.hour),
    hour: e.hour,
    height: e.height,
    isTomorrow: e.hour >= 24,
  }));

  const now = new Date();
  const currentDecimalHour = now.getHours() + now.getMinutes() / 60;
  const currentHeight = meanLevel + amplitude * Math.cos((2 * Math.PI * (currentDecimalHour - rawHighTideHour)) / 12.4206);

  return {
    range: baseRange * springNeapFactor,
    coefficient: tideCoefficient,
    samples,
    extremes,
    currentHeight: Math.max(0.01, currentHeight),
    currentHour: currentDecimalHour,
  };
}
