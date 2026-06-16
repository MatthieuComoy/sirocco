// Sirroco Marine Navigation - Pure utility and calculation functions

export function calculateHaversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371000; // Earth radius in meters
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c; // returns distance in meters
}

export function getWindCardinal(degrees) {
  const cardinals = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round(degrees / 22.5) % 16;
  return cardinals[index];
}

export function getTideRangeForCoords(lat, lon) {
  // Mediterranean Sea: tiny tides (0.15m - 0.35m)
  if (lat >= 30 && lat <= 46 && lon >= -6 && lon <= 36) {
    return 0.3;
  }
  // English Channel & North Sea: huge tides!
  if (lat >= 48.2 && lat <= 58 && lon >= -6 && lon <= 9) {
    const distToStMalo = calculateHaversineDistance(lat, lon, 48.64, -2.02);
    if (distToStMalo < 120000) { // within 120km of St Malo
      return 11.5;
    }
    return 6.5;
  }
  // French & Iberian Atlantic: medium-high tides
  if (lat >= 36 && lat <= 48.2 && lon >= -10 && lon <= -1) {
    return 4.2;
  }
  // Baltic Sea: very small tides
  if (lat >= 53 && lat <= 70 && lon >= 9 && lon <= 30) {
    return 0.15;
  }
  // US East Coast / Atlantic: medium
  if (lat >= 25 && lat <= 48 && lon >= -85 && lon <= -65) {
    return 2.2;
  }
  // US West Coast / Pacific: medium
  if (lat >= 30 && lat <= 60 && lon >= -130 && lon <= -115) {
    return 2.6;
  }
  // Default ocean range
  return 2.0;
}

export function calculateTidesForDay(lat, lon, date) {
  const baseRange = getTideRangeForCoords(lat, lon);

  // 1. Calculate moon age (days since new moon)
  const knownNewMoon = new Date('2000-01-06T18:14:00Z');
  const msPerDay = 24 * 60 * 60 * 1000;
  const daysSinceNewMoon = ((date.getTime() - knownNewMoon.getTime()) / msPerDay) % 29.530588853;

  // Spring/Neap coefficient (vive-eau / morte-eau)
  const springNeapFactor = 0.85 + 0.35 * Math.cos(2 * Math.PI * (daysSinceNewMoon % 14.765294) / 14.765294);
  const tideCoefficient = Math.round(20 + 100 * ((springNeapFactor - 0.5) / 0.8));

  // 2. High tide phase shift.
  const longitudeOffsetHours = -lon / 15.0; // 15 deg = 1h
  
  // Calculate first high tide time of the day
  let rawHighTideHour = (daysSinceNewMoon * 0.835 + longitudeOffsetHours + 2.5) % 12.4206;
  if (rawHighTideHour < 0) rawHighTideHour += 12.4206;

  // Generate hourly samples (48 points, every 30 minutes)
  const samples = [];
  const amplitude = (baseRange / 2) * springNeapFactor;
  const meanLevel = baseRange / 2 + 0.1;
  
  for (let i = 0; i <= 48; i++) {
    const decimalHour = i * 0.5;
    const height = meanLevel + amplitude * Math.cos(2 * Math.PI * (decimalHour - rawHighTideHour) / 12.4206);
    samples.push({
      hour: decimalHour,
      height: Math.max(0.01, height)
    });
  }

  // 3. Find high tides and low tides in the 24-hour period
  const extremes = [];
  for (let i = 1; i < samples.length - 1; i++) {
    const prev = samples[i-1].height;
    const curr = samples[i].height;
    const next = samples[i+1].height;
    
    if (curr > prev && curr > next) {
      extremes.push({
        type: 'high',
        hour: samples[i].hour,
        height: curr
      });
    } else if (curr < prev && curr < next) {
      extremes.push({
        type: 'low',
        hour: samples[i].hour,
        height: curr
      });
    }
  }
  
  const formatTime = (decimalHour) => {
    const h = Math.floor(decimalHour);
    const m = Math.round((decimalHour - h) * 60);
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
  };

  const formattedExtremes = extremes.map(e => ({
    type: e.type,
    timeStr: formatTime(e.hour),
    hour: e.hour,
    height: e.height
  }));

  // Calculate current tide height for the current time
  const now = new Date();
  const currentDecimalHour = now.getHours() + now.getMinutes() / 60;
  const currentHeight = meanLevel + amplitude * Math.cos(2 * Math.PI * (currentDecimalHour - rawHighTideHour) / 12.4206);

  return {
    range: baseRange * springNeapFactor,
    coefficient: tideCoefficient,
    samples: samples,
    extremes: formattedExtremes,
    currentHeight: Math.max(0.01, currentHeight),
    currentHour: currentDecimalHour
  };
}

export function getPointOfSail(heading, windDir) {
  if (heading === null || windDir === null || heading === undefined || windDir === undefined) {
    return 'Bout au vent';
  }
  
  let diff = Math.abs(heading - windDir) % 360;
  if (diff > 180) {
    diff = 360 - diff;
  }
  
  if (diff < 35) {
    return 'Bout au vent';
  } else if (diff >= 35 && diff < 55) {
    return 'Près';
  } else if (diff >= 55 && diff < 80) {
    return 'Bon plein';
  } else if (diff >= 80 && diff < 110) {
    return 'Travers';
  } else if (diff >= 110 && diff < 145) {
    return 'Largue';
  } else if (diff >= 145 && diff < 165) {
    return 'Grand largue';
  } else {
    return 'Vent arrière';
  }
}

export function formatDurationShort(ms) {
  const totalSecs = Math.floor(ms / 1000);
  const hrs = Math.floor(totalSecs / 3600);
  const mins = Math.floor((totalSecs % 3600) / 60);
  const secs = totalSecs % 60;
  
  if (hrs > 0) {
    return `${hrs}h ${mins}m`;
  }
  if (mins > 0) {
    return `${mins}m ${secs}s`;
  }
  return `${secs}s`;
}

export function escapeXml(unsafe) {
  if (!unsafe) return '';
  return unsafe.replace(/[<>&'"]/g, function (c) {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
    }
  });
}

export function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r},${g},${b}`;
}

export function getSimulatedDepth(lat, lng) {
  const harborCenter = L.latLng(43.115, 5.93);
  const dist = calculateHaversineDistance(lat, lng, harborCenter.lat, harborCenter.lng);
  
  // Depth decreases near harbor/shore, increases out to open sea (south)
  let depth = 15.0 - 13.0 * Math.max(0, 1.0 - dist / 2500);
  if (depth < 1.2) depth = 1.2;
  return depth;
}
