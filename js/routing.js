// Sirroco Marine Navigation - Dijkstra Route Planning Engine
// Calculates safe maritime routes avoiding land and following channels

import { calculateHaversineDistance } from './utils.js';

// Predefined marine waypoints (safe deep water nodes and corridor entrances)
export const WAYPOINTS = {
  // TOULON & APPROACH
  'toulon_port': { name: 'Port de Toulon', lat: 43.116, lon: 5.933 },
  'toulon_chenal': { name: 'Chenal de Toulon', lat: 43.104, lon: 5.940 },
  'toulon_rade': { name: 'Grande Rade de Toulon', lat: 43.100, lon: 5.965 },
  'toulon_passes': { name: 'Passes de la Rade', lat: 43.090, lon: 6.000 },
  'cape_cepet_w': { name: 'Cap Cépet (Ouest)', lat: 43.075, lon: 5.970 },
  'south_cepet': { name: 'Parage Sud de Cap Cépet', lat: 43.055, lon: 6.000 },
  'cape_cepet_e': { name: 'Cap Cépet (Est)', lat: 43.080, lon: 6.030 },
  
  // MARSEILLE
  'marseille_port': { name: 'Vieux-Port de Marseille', lat: 43.296, lon: 5.370 },
  'marseille_chenal': { name: 'Chenal de Marseille', lat: 43.290, lon: 5.340 },
  'marseille_rade': { name: 'Rade Sud de Marseille', lat: 43.270, lon: 5.300 },
  
  // COASTAL PASSAGES BETWEEN MARSEILLE AND TOULON
  'off_croisette': { name: 'Parage de Cap Croisette', lat: 43.180, lon: 5.320 },
  'south_sicie': { name: 'Parage de Cap Sicié', lat: 43.010, lon: 5.850 },
  
  // EAST OF TOULON / HYERES / PORQUEROLLES
  'south_giens': { name: 'Passage Sud de la presqu\'île de Giens', lat: 43.000, lon: 6.130 },
  'porquerolles_approach': { name: 'Approche de Porquerolles', lat: 43.015, lon: 6.200 },
  'porquerolles_port': { name: 'Port de Porquerolles', lat: 43.004, lon: 6.200 },
  
  // COTE D'AZUR
  'off_camarat': { name: 'Parage de Cap Camarat', lat: 43.150, lon: 6.750 },
  'cannes_approach': { name: 'Approche de Cannes', lat: 43.535, lon: 7.030 },
  'cannes_port': { name: 'Port de Cannes', lat: 43.551, lon: 7.016 },
  'nice_approach': { name: 'Approche de Nice', lat: 43.680, lon: 7.285 },
  'nice_port': { name: 'Port de Nice', lat: 43.692, lon: 7.285 },
  
  // CORSICA WEST
  'off_calvi': { name: 'Parage de Cap de la Revelata (Calvi)', lat: 42.600, lon: 8.650 },
  'calvi_approach': { name: 'Approche de Calvi', lat: 42.585, lon: 8.740 },
  'calvi_port': { name: 'Port de Calvi', lat: 42.568, lon: 8.760 },
  
  'off_capo_rosso': { name: 'Parage de Capo Rosso', lat: 42.250, lon: 8.450 },
  
  'ajaccio_approach': { name: 'Approche d\'Ajaccio', lat: 41.910, lon: 8.710 },
  'ajaccio_port': { name: 'Port d\'Ajaccio', lat: 41.928, lon: 8.745 },
  
  'off_senetosa': { name: 'Parage de Cap de Senetosa', lat: 41.500, lon: 8.680 },
  
  // CORSICA SOUTH & EAST
  'bonifacio_strait': { name: 'Détroit de Bonifacio (Sortie)', lat: 41.365, lon: 9.120 },
  'bonifacio_fjord': { name: 'Fjord de Bonifacio', lat: 41.386, lon: 9.140 },
  'bonifacio_port': { name: 'Port de Bonifacio', lat: 41.388, lon: 9.168 },
  
  'off_porto_vecchio': { name: 'Parage de Porto-Vecchio', lat: 41.600, lon: 9.400 },
  'off_ghisonaccia': { name: 'Parage de Ghisonaccia', lat: 42.000, lon: 9.500 },
  
  'north_cap_corse': { name: 'Parage Nord de Cap Corse', lat: 43.050, lon: 9.450 },
  'bastia_approach': { name: 'Approche de Bastia', lat: 42.700, lon: 9.480 },
  'bastia_port': { name: 'Vieux-Port de Bastia', lat: 42.702, lon: 9.455 },
  
  // ATLANTIC / CHANNEL
  'brest_port': { name: 'Port du Château (Brest)', lat: 48.385, lon: -4.470 },
  'brest_narrows': { name: 'Goulet de Brest', lat: 48.355, lon: -4.560 },
  'iroise_sea': { name: 'Mer d\'Iroise', lat: 48.250, lon: -4.750 },
  'ushant_channel': { name: 'Chenal du Four / Ouessant', lat: 48.550, lon: -5.100 },
  'casquets': { name: 'Parage des Casquets (Normandie)', lat: 49.800, lon: -2.400 },
  'cherbourg_approach': { name: 'Grande Rade de Cherbourg (Approche)', lat: 49.665, lon: -1.635 },
  'cherbourg_port': { name: 'Port Chantereyne (Cherbourg)', lat: 49.643, lon: -1.625 }
};

// Connections defining safe sea passage routes
const EDGES = [
  // Toulon harbor approach
  { from: 'toulon_port', to: 'toulon_chenal' },
  { from: 'toulon_chenal', to: 'toulon_rade' },
  { from: 'toulon_rade', to: 'toulon_passes' },
  { from: 'toulon_passes', to: 'cape_cepet_e' },
  
  // Going around Toulon Peninsula (Cap Cépet)
  { from: 'cape_cepet_e', to: 'south_cepet' },
  { from: 'south_cepet', to: 'cape_cepet_w' },
  
  // Marseille approach
  { from: 'marseille_port', to: 'marseille_chenal' },
  { from: 'marseille_chenal', to: 'marseille_rade' },
  
  // Route Marseille -> Toulon
  { from: 'marseille_rade', to: 'off_croisette' },
  { from: 'off_croisette', to: 'south_sicie' },
  { from: 'south_sicie', to: 'cape_cepet_w' },
  
  // Route Toulon -> Porquerolles
  { from: 'cape_cepet_e', to: 'south_giens' },
  { from: 'south_giens', to: 'porquerolles_approach' },
  { from: 'porquerolles_approach', to: 'porquerolles_port' },
  
  // Route East coast: Toulon/Porquerolles -> Cannes/Nice
  { from: 'south_giens', to: 'off_camarat' },
  { from: 'porquerolles_approach', to: 'off_camarat' },
  { from: 'off_camarat', to: 'cannes_approach' },
  { from: 'cannes_approach', to: 'cannes_port' },
  { from: 'cannes_approach', to: 'nice_approach' },
  { from: 'nice_approach', to: 'nice_port' },
  
  // Corsica Crossings
  { from: 'nice_approach', to: 'calvi_approach' },
  { from: 'off_camarat', to: 'calvi_approach' },
  { from: 'south_giens', to: 'calvi_approach' },
  { from: 'south_giens', to: 'ajaccio_approach' },
  
  // Corsica West Coast
  { from: 'calvi_port', to: 'calvi_approach' },
  { from: 'calvi_approach', to: 'off_calvi' },
  { from: 'off_calvi', to: 'off_capo_rosso' },
  { from: 'off_capo_rosso', to: 'ajaccio_approach' },
  { from: 'ajaccio_port', to: 'ajaccio_approach' },
  { from: 'ajaccio_approach', to: 'off_senetosa' },
  { from: 'off_senetosa', to: 'bonifacio_strait' },
  
  // Bonifacio Approach
  { from: 'bonifacio_port', to: 'bonifacio_fjord' },
  { from: 'bonifacio_fjord', to: 'bonifacio_strait' },
  
  // Corsica East Coast
  { from: 'bonifacio_strait', to: 'off_porto_vecchio' },
  { from: 'off_porto_vecchio', to: 'off_ghisonaccia' },
  { from: 'off_ghisonaccia', to: 'bastia_approach' },
  { from: 'bastia_approach', to: 'bastia_port' },
  
  // Cap Corse route
  { from: 'bastia_approach', to: 'north_cap_corse' },
  { from: 'north_cap_corse', to: 'nice_approach' },
  { from: 'north_cap_corse', to: 'calvi_approach' },
  
  // ATLANTIC / CHANNEL
  // Brest approach
  { from: 'brest_port', to: 'brest_narrows' },
  { from: 'brest_narrows', to: 'iroise_sea' },
  { from: 'iroise_sea', to: 'ushant_channel' },
  
  // Channel crossing
  { from: 'ushant_channel', to: 'casquets' },
  { from: 'casquets', to: 'cherbourg_approach' },
  { from: 'cherbourg_approach', to: 'cherbourg_port' }
];

export function findRoute(startLat, startLon, destLat, destLon) {
  // 1. Clone WAYPOINTS and EDGES so we don't pollute global objects
  const localNodes = { ...WAYPOINTS };
  const localEdges = [...EDGES];

  // 2. Add Start ('start') and Destination ('dest') nodes
  localNodes['start'] = { name: 'Départ', lat: startLat, lon: startLon };
  localNodes['dest'] = { name: 'Destination', lat: destLat, lon: destLon };

  // 3. Find closest existing waypoint to 'start' and 'dest' to hook them up.
  // To avoid projecting across land:
  // - If the start or dest point is within 2.5 Nautical Miles of a 'port' node, we allow projecting directly to it.
  // - Otherwise, we MUST project to a 'sea' node (open sea node) to avoid land interception.
  let closestStartNode = null;
  let minDistStart = Infinity;
  let closestDestNode = null;
  let minDistDest = Infinity;

  const maxPortProjDistNM = 2.5;

  for (const nodeId in WAYPOINTS) {
    const node = WAYPOINTS[nodeId];
    // Haversine returns meters, convert to NM
    const dStartNM = calculateHaversineDistance(startLat, startLon, node.lat, node.lon) / 1852;
    const isPort = node.type === 'port';

    if (!isPort || dStartNM <= maxPortProjDistNM) {
      if (dStartNM < minDistStart) {
        minDistStart = dStartNM;
        closestStartNode = nodeId;
      }
    }
  }

  for (const nodeId in WAYPOINTS) {
    const node = WAYPOINTS[nodeId];
    const dDestNM = calculateHaversineDistance(destLat, destLon, node.lat, node.lon) / 1852;
    const isPort = node.type === 'port';

    if (!isPort || dDestNM <= maxPortProjDistNM) {
      if (dDestNM < minDistDest) {
        minDistDest = dDestNM;
        closestDestNode = nodeId;
      }
    }
  }

  // Hook 'start' and 'dest' to their closest neighbors in both directions (undirected graph)
  if (closestStartNode) {
    localEdges.push({ from: 'start', to: closestStartNode });
  }
  if (closestDestNode) {
    localEdges.push({ from: 'dest', to: closestDestNode });
  }

  // 4. Build adjacency list representation of the graph
  const adj = {};
  for (const nodeId in localNodes) {
    adj[nodeId] = [];
  }

  localEdges.forEach(edge => {
    const fromNode = localNodes[edge.from];
    const toNode = localNodes[edge.to];
    if (fromNode && toNode) {
      const dist = calculateHaversineDistance(fromNode.lat, fromNode.lon, toNode.lat, toNode.lon);
      // Undirected graph edges
      adj[edge.from].push({ to: edge.to, weight: dist });
      adj[edge.to].push({ to: edge.from, weight: dist });
    }
  });

  // 5. Dijkstra shortest path search
  const distances = {};
  const previous = {};
  const unvisited = new Set();

  for (const nodeId in localNodes) {
    distances[nodeId] = Infinity;
    previous[nodeId] = null;
    unvisited.add(nodeId);
  }
  distances['start'] = 0;

  while (unvisited.size > 0) {
    // Find node in unvisited with smallest distance
    let u = null;
    let minD = Infinity;
    unvisited.forEach(nodeId => {
      if (distances[nodeId] < minD) {
        minD = distances[nodeId];
        u = nodeId;
      }
    });

    // If no reachable node is found or destination is reached, stop
    if (u === null || u === 'dest') break;

    unvisited.delete(u);

    // Relax neighbors
    const neighbors = adj[u] || [];
    neighbors.forEach(edge => {
      const v = edge.to;
      if (unvisited.has(v)) {
        const alt = distances[u] + edge.weight;
        if (alt < distances[v]) {
          distances[v] = alt;
          previous[v] = u;
        }
      }
    });
  }

  // 6. Reconstruct path
  if (distances['dest'] === Infinity) {
    return null; // Route not found
  }

  const path = [];
  let curr = 'dest';
  while (curr !== null) {
    path.push(curr);
    curr = previous[curr];
  }
  path.reverse();

  // 7. Map nodes to coordinates and compute total distance
  const coordinates = path.map(nodeId => [localNodes[nodeId].lat, localNodes[nodeId].lon]);
  
  // Calculate total route distance in Nautical Miles
  let totalDistanceMeters = 0;
  for (let i = 0; i < coordinates.length - 1; i++) {
    const c1 = coordinates[i];
    const c2 = coordinates[i + 1];
    totalDistanceMeters += calculateHaversineDistance(c1[0], c1[1], c2[0], c2[1]);
  }
  const distanceNM = totalDistanceMeters / 1852;

  return {
    coordinates,
    distanceNM,
    waypoints: path.map(nodeId => localNodes[nodeId].name)
  };
}
