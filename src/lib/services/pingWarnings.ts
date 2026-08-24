// Ported from legacy/js/pingWarnings.js — S-124 XML parsing, NGA JSON parsing
// and the free-text coordinate fallback are pure and reproduced as-is. The
// sidebar warning list (#avurnav-list-container) was never wired to any
// opener in the legacy app (dead markup) — not rebuilt here, per the
// architecture plan's decision to stay scope-neutral on it.
import { warnings, type Warning, type WarningGeometry, type WarningPreamble, type WarningType } from '../stores/warnings';

interface SeriesDef {
  name: string;
  id: string;
  fallbackUrl: string;
  enabled: boolean;
  type: WarningType;
  liveUrl?: string;
}

const SERIES: SeriesDef[] = [
  { name: 'NAVAREA II', id: 'NAVAREA II', fallbackUrl: '/data/navarea2.xml', enabled: false, type: 'navarea' },

  { name: 'AVURNAV Toulon', id: 'AVURNAV TOULON', fallbackUrl: '/data/toulon.xml', enabled: true, type: 'avurnav' },
  { name: 'AVURNAV Brest', id: 'AVURNAV BREST', fallbackUrl: '/data/brest.xml', enabled: true, type: 'avurnav' },
  { name: 'AVURNAV Cherbourg', id: 'AVURNAV CHERBOURG', fallbackUrl: '/data/cherbourg.xml', enabled: true, type: 'avurnav' },

  { name: 'AVINAV Toulon', id: 'AVINAV TOULON', fallbackUrl: '/data/avinav_toulon.xml', enabled: true, type: 'avinav' },
  { name: 'AVINAV Brest', id: 'AVINAV BREST', fallbackUrl: '/data/avinav_brest.xml', enabled: true, type: 'avinav' },
  { name: 'AVINAV Cherbourg', id: 'AVINAV CHERBOURG', fallbackUrl: '/data/avinav_cherbourg.xml', enabled: true, type: 'avinav' },

  { name: 'AVURNAV Local Toulon', id: 'AVURNAV LOCAL TOULON', fallbackUrl: '/data/avurnav_local_toulon.xml', enabled: true, type: 'avurnav_local' },
  { name: 'AVURNAV Local Brest', id: 'AVURNAV LOCAL BREST', fallbackUrl: '/data/avurnav_local_brest.xml', enabled: true, type: 'avurnav_local' },
  { name: 'AVURNAV Local Cherbourg', id: 'AVURNAV LOCAL CHERBOURG', fallbackUrl: '/data/avurnav_local_cherbourg.xml', enabled: true, type: 'avurnav_local' },

  { name: 'AVURNAV Antilles', id: 'AVURNAV ANTILLES', fallbackUrl: '/data/antilles.xml', enabled: true, type: 'avurnav' },
  { name: 'AVURNAV Guyane', id: 'AVURNAV GUYANE', fallbackUrl: '/data/guyane.xml', enabled: true, type: 'avurnav' },
  { name: 'AVURNAV Réunion', id: 'AVURNAV REUNION', fallbackUrl: '/data/reunion.xml', enabled: true, type: 'avurnav' },
  { name: 'AVURNAV Mayotte', id: 'AVURNAV MAYOTTE', fallbackUrl: '/data/mayotte.xml', enabled: true, type: 'avurnav' },
  { name: 'AVURNAV Nouvelle Calédonie', id: 'AVURNAV NOUVELLE CALEDONIE', fallbackUrl: '/data/nouvelle_caledonie.xml', enabled: true, type: 'avurnav' },
  { name: 'AVURNAV Polynésie', id: 'AVURNAV POLYNESIE', fallbackUrl: '/data/polynesie.xml', enabled: true, type: 'avurnav' },
  { name: 'AVURNAV St Pierre et Miquelon', id: 'AVURNAV ST PIERRE ET MIQUELON', fallbackUrl: '/data/st_pierre_miquelon.xml', enabled: true, type: 'avurnav' },

  { name: 'AVINAV Antilles', id: 'AVINAV ANTILLES', fallbackUrl: '/data/avinav_antilles.xml', enabled: true, type: 'avinav' },
  { name: 'AVINAV Guyane', id: 'AVINAV GUYANE', fallbackUrl: '/data/avinav_guyane.xml', enabled: true, type: 'avinav' },
  { name: 'AVINAV Réunion', id: 'AVINAV REUNION', fallbackUrl: '/data/avinav_reunion.xml', enabled: true, type: 'avinav' },
  { name: 'AVINAV Mayotte', id: 'AVINAV MAYOTTE', fallbackUrl: '/data/avinav_mayotte.xml', enabled: true, type: 'avinav' },
  { name: 'AVINAV Nouvelle Calédonie', id: 'AVINAV NOUVELLE CALEDONIE', fallbackUrl: '/data/avinav_nouvelle_caledonie.xml', enabled: true, type: 'avinav' },
  { name: 'AVINAV Polynésie', id: 'AVINAV POLYNESIE', fallbackUrl: '/data/avinav_polynesie.xml', enabled: true, type: 'avinav' },
  { name: 'AVINAV St Pierre et Miquelon', id: 'AVINAV ST PIERRE ET MIQUELON', fallbackUrl: '/data/avinav_st_pierre_miquelon.xml', enabled: true, type: 'avinav' },

  { name: 'AVURNAV Local Antilles', id: 'AVURNAV LOCAL ANTILLES', fallbackUrl: '/data/avurnav_local_antilles.xml', enabled: true, type: 'avurnav_local' },
  { name: 'AVURNAV Local Guyane', id: 'AVURNAV LOCAL GUYANE', fallbackUrl: '/data/avurnav_local_guyane.xml', enabled: true, type: 'avurnav_local' },
  { name: 'AVURNAV Local Réunion', id: 'AVURNAV LOCAL REUNION', fallbackUrl: '/data/avurnav_local_reunion.xml', enabled: true, type: 'avurnav_local' },
  { name: 'AVURNAV Local Mayotte', id: 'AVURNAV LOCAL MAYOTTE', fallbackUrl: '/data/avurnav_local_mayotte.xml', enabled: true, type: 'avurnav_local' },
  { name: 'AVURNAV Local Nouvelle Calédonie', id: 'AVURNAV LOCAL NOUVELLE CALEDONIE', fallbackUrl: '/data/avurnav_local_nouvelle_caledonie.xml', enabled: true, type: 'avurnav_local' },
  { name: 'AVURNAV Local Polynésie', id: 'AVURNAV LOCAL POLYNESIE', fallbackUrl: '/data/avurnav_local_polynesie.xml', enabled: true, type: 'avurnav_local' },
  { name: 'AVURNAV Local St Pierre et Miquelon', id: 'AVURNAV LOCAL ST PIERRE ET MIQUELON', fallbackUrl: '/data/avurnav_local_st_pierre_miquelon.xml', enabled: true, type: 'avurnav_local' },
];

for (const s of SERIES) {
  if (s.enabled) {
    s.liveUrl = `https://services.ping-info-nautique.fr/nw/v1/Get_NW_Messages?nameOfSeries=${encodeURIComponent(s.id)}&lang=fr`;
  }
}

export function mercatorToWgs84(x: number, y: number): [number, number] {
  const rMajor = 6378137;
  const lon = (x / rMajor) * (180 / Math.PI);
  const lat = (180 / Math.PI) * (2 * Math.atan(Math.exp(y / rMajor)) - Math.PI / 2);
  return [lon, lat];
}

function parseGmlCoordinates(coordStr: string | undefined): [number, number][] {
  const coords: [number, number][] = [];
  if (!coordStr) return coords;
  for (const token of coordStr.trim().split(/\s+/)) {
    if (!token) continue;
    const parts = token.split(',');
    if (parts.length === 2) {
      const x = parseFloat(parts[0]);
      const y = parseFloat(parts[1]);
      if (!Number.isNaN(x) && !Number.isNaN(y)) {
        const [lon, lat] = mercatorToWgs84(x, y);
        coords.push([lat, lon]);
      }
    }
  }
  return coords;
}

function todayIsoDate(): string {
  return new Date().toISOString().slice(0, 10);
}

function getElements(parent: Element | Document, localName: string): Element[] {
  let elms = parent.getElementsByTagName('S124:' + localName);
  if (elms.length === 0) elms = parent.getElementsByTagName(localName);
  if (elms.length === 0) elms = parent.getElementsByTagName('S100:' + localName);
  if (elms.length === 0) elms = parent.getElementsByTagName('gml:' + localName);
  return Array.from(elms);
}

function getElementValue(parent: Element | Document, localName: string, defaultValue = ''): string {
  const elms = getElements(parent, localName);
  return elms.length > 0 ? (elms[0].textContent ?? '').trim() : defaultValue;
}

/** Parse free-text coordinates in a warning's description (used when the XML
 *  carries no GML geometry) — supports DD-MM.MM, DD MM.MM and decimal forms. */
export function parseCoordsFromText(text: string | undefined): [number, number][] {
  if (!text) return [];
  const coords: [number, number][] = [];

  const patterns = [
    /\b(\d{1,2})-(\d{1,2}(?:\.\d+)?)\s*([NSns])\s+(\d{1,3})-(\d{1,2}(?:\.\d+)?)\s*([EOWewoO])\b/g,
    /\b(\d{1,2})\s+(\d{1,2}(?:\.\d+)?)\s*([NSns])\s+(\d{1,3})\s+(\d{1,2}(?:\.\d+)?)\s*([EOWewoO])\b/g,
  ];

  for (const regex of patterns) {
    let match: RegExpExecArray | null;
    while ((match = regex.exec(text)) !== null) {
      const latDeg = parseInt(match[1], 10);
      const latMin = parseFloat(match[2]);
      const latDir = match[3].toUpperCase();
      const lngDeg = parseInt(match[4], 10);
      const lngMin = parseFloat(match[5]);
      const lngDir = match[6].toUpperCase();

      let lat = latDeg + latMin / 60.0;
      if (latDir === 'S') lat = -lat;
      let lng = lngDeg + lngMin / 60.0;
      if (lngDir === 'W' || lngDir === 'O') lng = -lng;
      coords.push([lat, lng]);
    }
  }

  const decimalRegex = /\b(\d{1,2}(?:\.\d+)?)\s*([NSns])\b[\s,]*\b(\d{1,3}(?:\.\d+)?)\s*([EOWewoO])\b/g;
  let match: RegExpExecArray | null;
  while ((match = decimalRegex.exec(text)) !== null) {
    let lat = parseFloat(match[1]);
    const latDir = match[2].toUpperCase();
    let lng = parseFloat(match[3]);
    const lngDir = match[4].toUpperCase();
    if (latDir === 'S') lat = -lat;
    if (lngDir === 'W' || lngDir === 'O') lng = -lng;
    coords.push([lat, lng]);
  }

  return coords;
}

function determineGeometry(parsedCoords: [number, number][], text: string): WarningGeometry | null {
  if (!parsedCoords || parsedCoords.length === 0) return null;
  if (parsedCoords.length === 1) return { type: 'Point', coordinates: parsedCoords[0] };

  const textCleaned = (text || '').toLowerCase().replace(/navarea/g, '');
  const isLine = ['line', 'cable', 'pipeline', 'track', 'tow', 'towing', 'transit'].some((k) => textCleaned.includes(k));
  const isArea = ['area', 'bound', 'within', 'enclosed', 'polygon', 'firing', 'exercice', 'exercise', 'danger'].some((k) =>
    textCleaned.includes(k)
  );

  if (parsedCoords.length === 2) {
    return { type: isLine ? 'LineString' : 'MultiPoint', coordinates: parsedCoords };
  }
  if (isArea) return { type: 'Polygon', coordinates: parsedCoords };
  if (isLine) return { type: 'LineString', coordinates: parsedCoords };
  return { type: 'MultiPoint', coordinates: parsedCoords };
}

/** Emoji per hazard type, matched heuristically against fr/en keywords. */
export function getWarningEmoji(hazardType: string | undefined, textInfo = ''): string {
  const infoLower = textInfo.toLowerCase();
  const hazardLower = (hazardType || '').toLowerCase();

  if (hazardLower.includes('wreck') || infoLower.includes('épave') || infoLower.includes('wreck')) return '⚓';
  if (hazardLower.includes('firing') || infoLower.includes('tir') || infoLower.includes('firing') || infoLower.includes('exercise') || infoLower.includes('exercice')) return '💣';
  if (hazardLower.includes('cable') || infoLower.includes('câble') || infoLower.includes('cable') || infoLower.includes('pipeline')) return '🔌';
  if (hazardLower.includes('rig') || hazardLower.includes('platform') || infoLower.includes('forage') || infoLower.includes('plateforme') || infoLower.includes('modu')) return '🏗️';
  if (infoLower.includes('derive') || infoLower.includes('dérive') || infoLower.includes('drifting') || infoLower.includes('derelict') || infoLower.includes('vessel') || infoLower.includes('tow') || infoLower.includes('remorquage')) return '🚨';
  if (infoLower.includes('shoal') || infoLower.includes('reef') || infoLower.includes('haut fond') || infoLower.includes('obstruction') || infoLower.includes('danger')) return '🪨';
  if (hazardLower.includes('light') || infoLower.includes('feu') || infoLower.includes('phare') || infoLower.includes('buoy') || infoLower.includes('bouée') || infoLower.includes('beacon') || infoLower.includes('balise') || infoLower.includes('unlit') || infoLower.includes('éteint')) return '🏮';
  if (hazardLower.includes('survey') || infoLower.includes('recherche') || infoLower.includes('scientifique') || infoLower.includes('scientific')) return '🔬';
  if (infoLower.includes('mooring') || infoLower.includes('corps-mort') || infoLower.includes('mouillage')) return '⚓';
  if (hazardLower.includes('bulletin')) return '📋';
  return '⚠️';
}

async function fetchXml(series: SeriesDef): Promise<{ series: SeriesDef; xmlText: string; source: 'live' | 'local' }> {
  try {
    const response = await fetch(series.liveUrl!);
    if (!response.ok) throw new Error('CORS or Server Error');
    return { series, xmlText: await response.text(), source: 'live' };
  } catch (err) {
    console.warn(`Could not fetch live ${series.name} XML (likely due to CORS or offline). Falling back to local copy.`, err);
    const response = await fetch(series.fallbackUrl);
    if (!response.ok) throw new Error('Local fallback file not found');
    return { series, xmlText: await response.text(), source: 'local' };
  }
}

function parseSeriesXml(xmlDoc: Document, seriesFallbackName: string, seriesType: WarningType): Warning[] {
  const out: Warning[] = [];
  const preambles = new Map<string, WarningPreamble>();

  getElements(xmlDoc, 'NWPreamble').forEach((preamble) => {
    const gmlId = preamble.getAttribute('gml:id') || preamble.getAttribute('id') || getElementValue(preamble, 'id');
    const seriesIdEl = getElements(preamble, 'messageSeriesIdentifier')[0];
    const nameOfSeries = seriesIdEl ? getElementValue(seriesIdEl, 'nameOfSeries') : seriesFallbackName;
    const warningNumber = seriesIdEl ? getElementValue(seriesIdEl, 'warningNumber') : '';
    const year = seriesIdEl ? getElementValue(seriesIdEl, 'year') : '';
    const publicationDate = getElementValue(preamble, 'publicationDate');

    const areaTexts: string[] = [];
    getElements(preamble, 'generalArea').forEach((area) => {
      getElements(area, 'locationName').forEach((loc) => {
        const txt = getElementValue(loc, 'text');
        if (txt) areaTexts.push(txt);
      });
    });

    preambles.set(gmlId, {
      nameOfSeries,
      warningNumber,
      year,
      publicationDate,
      generalArea: areaTexts.join(' > ') || 'Zone inconnue',
      hazardTypeGeneral: getElementValue(preamble, 'warningHazardTypeGeneral'),
    });
  });

  getElements(xmlDoc, 'NavigationalWarningFeaturePart').forEach((part) => {
    const gmlId = part.getAttribute('gml:id') || part.getAttribute('id') || '';
    const header = getElements(part, 'header')[0];
    let preambleHref = header ? header.getAttribute('xlink:href') || header.getAttribute('href') || '' : '';
    if (preambleHref.startsWith('#')) preambleHref = preambleHref.substring(1);
    const preamble = preambles.get(preambleHref) ?? null;

    if (preamble?.hazardTypeGeneral === 'IN_FORCE_BULLETIN') return;

    const dateRangeEl = getElements(part, 'fixedDateRange')[0];
    const dateEndEl = dateRangeEl ? getElements(dateRangeEl, 'dateEnd')[0] : undefined;
    const dateEnd = dateEndEl ? getElementValue(dateEndEl, 'date') || null : null;
    // Local snapshot data can go stale between downloads — a warning whose
    // dateEnd has already passed is no longer in force and shouldn't be
    // shown as if it were (open-ended notices with no dateEnd are kept).
    if (dateEnd && dateEnd < todayIsoDate()) return;

    const warnInfo = getElements(part, 'warningInformation')[0];
    const hazardTypeDetails = warnInfo ? getElementValue(warnInfo, 'warningHazardTypeDetails') : '';
    const information = warnInfo ? getElementValue(warnInfo, 'information') : getElementValue(part, 'information');

    let geometry: WarningGeometry | null = null;
    const pointElms = getElements(part, 'Point');
    const polyElms = getElements(part, 'Polygon');
    const lineElms = getElements(part, 'LineString');

    if (pointElms.length > 0) {
      const coords = parseGmlCoordinates(getElementValue(pointElms[0], 'coordinates'));
      if (coords.length > 0) geometry = { type: 'Point', coordinates: coords[0] };
    } else if (polyElms.length > 0) {
      const coords = parseGmlCoordinates(getElementValue(polyElms[0], 'coordinates'));
      if (coords.length > 0) geometry = { type: 'Polygon', coordinates: coords };
    } else if (lineElms.length > 0) {
      const coords = parseGmlCoordinates(getElementValue(lineElms[0], 'coordinates'));
      if (coords.length > 0) geometry = { type: 'LineString', coordinates: coords };
    }

    if (!geometry && information) {
      geometry = determineGeometry(parseCoordsFromText(information), information);
    }

    out.push({ gmlId, preamble, hazardTypeDetails, information, geometry, visible: true, type: seriesType, dateEnd });
  });

  return out;
}

interface NgaWarningRaw {
  text?: string;
  issueDate?: string;
  navArea?: string;
  area?: string;
  msgNumber?: string | number;
  number?: string | number;
  msgYear?: string | number;
  year?: string | number;
}

function parseNgaWarning(ngaObj: NgaWarningRaw): Warning {
  const text = ngaObj.text || '';
  const geometry = determineGeometry(parseCoordsFromText(text), text);

  const issueDateStr = ngaObj.issueDate || '';
  let pubDate = new Date();
  const dateMatch = issueDateStr.match(/(\d{6})Z\s+([A-Z]{3})\s+(\d{4})/i);
  if (dateMatch) {
    const months: Record<string, number> = { JAN: 0, FEB: 1, MAR: 2, APR: 3, MAY: 4, JUN: 5, JUL: 6, AUG: 7, SEP: 8, OCT: 9, NOV: 10, DEC: 11 };
    const day = parseInt(dateMatch[1].substring(0, 2), 10);
    const month = months[dateMatch[2].toUpperCase()] ?? 0;
    const year = parseInt(dateMatch[3], 10);
    const hour = parseInt(dateMatch[1].substring(2, 4), 10);
    const min = parseInt(dateMatch[1].substring(4, 6), 10);
    pubDate = new Date(Date.UTC(year, month, day, hour, min));
  }

  const lower = text.toLowerCase();
  let hazardType = 'Alerte';
  if (lower.includes('wreck') || lower.includes('épave')) hazardType = 'Wreck';
  else if (lower.includes('firing') || lower.includes('tir')) hazardType = 'Firing';
  else if (lower.includes('cable') || lower.includes('câble')) hazardType = 'Cable';
  else if (lower.includes('scientific') || lower.includes('survey')) hazardType = 'Scientific';
  else if (lower.includes('light') || lower.includes('phare')) hazardType = 'Light';

  return {
    gmlId: `nga-${ngaObj.msgYear || ngaObj.year || '2026'}-${ngaObj.msgNumber || ngaObj.number || '0'}`,
    type: 'navarea',
    preamble: {
      nameOfSeries: `NAVAREA ${ngaObj.navArea || ngaObj.area || ''}`,
      warningNumber: String(ngaObj.msgNumber || ngaObj.number || ''),
      year: String(ngaObj.msgYear || ngaObj.year || ''),
      publicationDate: pubDate.toISOString(),
      generalArea: text.split('\n')[0] || `NAVAREA ${ngaObj.navArea || ngaObj.area || ''}`,
      hazardTypeGeneral: hazardType,
    },
    hazardTypeDetails: hazardType,
    information: text,
    geometry,
    visible: true,
    dateEnd: null,
  };
}

async function loadNgaWarnings(): Promise<{ items: Warning[]; source: 'live' | 'local' | null }> {
  let raw: NgaWarningRaw[] | null = null;
  let source: 'live' | 'local' = 'live';

  try {
    const response = await fetch('https://msi.nga.mil/api/publications/broadcast-warn?status=active&output=json');
    if (!response.ok) throw new Error('CORS or Server Error');
    const data = await response.json();
    raw = data['broadcast-warn'] || [];
  } catch (err) {
    console.warn('Could not fetch live NGA warnings. Falling back to local copy.', err);
    try {
      const response = await fetch('/data/nga_warnings.json');
      if (!response.ok) throw new Error('Local fallback file not found');
      raw = await response.json();
      source = 'local';
    } catch (localErr) {
      console.error('Failed to load local NGA fallback:', localErr);
      return { items: [], source: null };
    }
  }

  return { items: (raw ?? []).map(parseNgaWarning), source };
}

export async function loadAllWarnings() {
  warnings.update((w) => ({ ...w, loading: true }));

  const activeSeries = SERIES.filter((s) => s.enabled);
  const results = await Promise.all(
    activeSeries.map((s) =>
      fetchXml(s).catch((err) => {
        console.error(`Failed to fetch ${s.name}:`, err);
        return null;
      })
    )
  );

  const parser = new DOMParser();
  let liveCount = 0;
  let localCount = 0;
  const parsed: Warning[] = [];

  for (const result of results) {
    if (!result) continue;
    if (result.source === 'live') liveCount++;
    else localCount++;

    await new Promise((resolve) => setTimeout(resolve, 0)); // yield to keep UI interactive

    const xmlDoc = parser.parseFromString(result.xmlText, 'application/xml');
    if (xmlDoc.getElementsByTagName('parsererror').length > 0) {
      console.error(`XML Parse error in series ${result.series.name}`);
      continue;
    }
    parsed.push(...parseSeriesXml(xmlDoc, result.series.name, result.series.type));
  }

  let sourceInfo = 'mixed';
  const totalActive = activeSeries.length;
  if (liveCount === totalActive) sourceInfo = 'live';
  else if (localCount === totalActive) sourceInfo = 'local';
  else sourceInfo = `live (${liveCount}) + offline (${localCount})`;

  const nga = await loadNgaWarnings().catch((err) => {
    console.error('Failed to load global NAVAREA warnings:', err);
    return { items: [] as Warning[], source: null };
  });
  parsed.push(...nga.items);
  if (nga.source === 'live') sourceInfo = 'live';

  warnings.update((w) => ({ ...w, list: parsed, loading: false, sourceInfo }));
}

/** Popup HTML built lazily by Leaflet only when the user opens a marker —
 *  not up front for every warning (there can be hundreds loaded at once). */
export function buildWarningPopupHtml(warn: Warning, emoji: string, headerColor: string): string {
  const p = warn.preamble;
  const seriesTitle = p?.nameOfSeries || 'NAVAREA';
  const warningNum = `${p?.warningNumber || ''}/${p?.year || ''}`;

  let formattedDate = '';
  if (p?.publicationDate) {
    const pubDate = new Date(p.publicationDate);
    const day = String(pubDate.getUTCDate()).padStart(2, '0');
    const hour = String(pubDate.getUTCHours()).padStart(2, '0');
    const min = String(pubDate.getUTCMinutes()).padStart(2, '0');
    const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    formattedDate = `${day}${hour}${min}z UTC ${months[pubDate.getUTCMonth()]} ${pubDate.getUTCFullYear()}`;
  }

  let validityLine = '';
  if (warn.dateEnd) {
    const [y, m, d] = warn.dateEnd.split('-');
    validityLine = `<div style="font-size: 0.7rem; color: var(--color-warning); margin-top: 0.3rem;">⏳ En vigueur jusqu'au ${d}/${m}/${y}</div>`;
  }

  return `
    <div style="font-family: var(--font-sans), sans-serif; line-height: 1.45; color: var(--color-text); font-size: 0.8rem; width: 100%;">
      <div style="font-size: 1.2rem; font-weight: 600; margin-bottom: 0.4rem; display: flex; align-items: center; gap: 0.5rem;">
        <span>${emoji}</span>
        <span style="letter-spacing: -0.01em;">${seriesTitle}</span>
      </div>
      <hr style="margin: 6px 0; border: none; border-top: 1px solid var(--color-border); opacity: 0.4;">
      <div style="font-family: var(--font-mono), monospace; font-size: 0.78rem; font-weight: 700; color: ${headerColor}; display: flex; flex-direction: column; gap: 0.15rem; margin-bottom: 0.4rem;">
        <div>${warningNum}</div>
        <div style="color: var(--color-text-muted); font-size: 0.72rem; font-weight: 500;">${formattedDate}</div>
        ${validityLine}
      </div>
      <hr style="margin: 6px 0; border: none; border-top: 1px solid var(--color-border); opacity: 0.4;">
      <div style="font-family: var(--font-mono), monospace; font-size: 0.75rem; white-space: pre-wrap; word-break: break-word; line-height: 1.4; max-height: 220px; overflow-y: auto; margin: 6px 0; padding-right: 4px;">${warn.information}</div>
      <hr style="margin: 6px 0; border: none; border-top: 1px solid var(--color-border); opacity: 0.4;">
      <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.7rem; color: var(--color-text-muted);">
        <span>📍 ${p?.generalArea || ''}</span>
        <span style="text-transform: uppercase; font-weight: 700; letter-spacing: 0.05em; color: ${headerColor}; font-size: 0.65rem;">${warn.hazardTypeDetails || p?.hazardTypeGeneral || 'Alerte'}</span>
      </div>
    </div>
  `;
}

export function setWarningsFilter(patch: Partial<import('../stores/warnings').WarningsFilter>) {
  warnings.update((w) => {
    const filter = { ...w.filter, ...patch };
    // Mirror legacy behavior: toggling the master flips all sub-categories;
    // toggling any sub-category re-derives the master (checked if any is on).
    if ('showAll' in patch) {
      filter.showAvurnav = filter.showAll;
      filter.showAvurnavLocal = filter.showAll;
      filter.showAvinav = filter.showAll;
    } else {
      filter.showAll = filter.showAvurnav || filter.showAvurnavLocal || filter.showAvinav;
    }
    return { ...w, filter };
  });
}
