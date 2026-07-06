import maplibregl from 'maplibre-gl';
import { state } from './state.js';

// Helper to convert Leaflet latlng [lat, lng] or {lat, lng} to MapLibre [lng, lat]
export function toLngLat(latlng) {
  if (Array.isArray(latlng)) {
    if (Array.isArray(latlng[0])) {
      return latlng.map(toLngLat);
    }
    return [latlng[1], latlng[0]];
  }
  if (latlng && typeof latlng === 'object') {
    if (latlng.lng !== undefined && latlng.lat !== undefined) {
      return [latlng.lng, latlng.lat];
    }
  }
  return latlng;
}

class ShimMarker {
  constructor(latlng, options = {}) {
    this.latlng = latlng;
    this.options = options;
    this.popupContent = null;
    this.marker = null;
    this.dragEndCallback = null;
  }

  addTo(target) {
    const map = state.map;
    if (!map) return this;

    const el = document.createElement('div');
    if (this.options.icon && this.options.icon.html) {
      el.innerHTML = this.options.icon.html;
      el.className = this.options.icon.className || '';
    } else {
      el.className = 'maplibre-default-marker';
      el.style.fontSize = '24px';
      el.textContent = '📍';
    }

    const markerOptions = { element: el };
    if (this.options.draggable) {
      markerOptions.draggable = true;
    }

    this.marker = new maplibregl.Marker(markerOptions)
      .setLngLat(toLngLat(this.latlng))
      .addTo(map);

    if (this.options.draggable) {
      this.marker.on('dragend', () => {
        const lngLat = this.marker.getLngLat();
        this.latlng = [lngLat.lat, lngLat.lng];
        if (typeof this.dragEndCallback === 'function') {
          this.dragEndCallback({ target: this });
        }
      });
    }

    if (this.popupContent) {
      el.style.cursor = 'pointer';
      el.addEventListener('click', (e) => {
        e.stopPropagation();
        this.openPopup();
      });
    }

    return this;
  }

  bindPopup(content, options = {}) {
    this.popupContent = content;
    if (this.marker) {
      const el = this.marker.getElement();
      el.style.cursor = 'pointer';
      el.addEventListener('click', (e) => {
        e.stopPropagation();
        this.openPopup();
      });
    }
    return this;
  }

  openPopup() {
    if (!this.popupContent || !state.map) return;
    new maplibregl.Popup({ offset: 25, maxWidth: '320px' })
      .setLngLat(toLngLat(this.latlng))
      .setHTML(this.popupContent)
      .addTo(state.map);
  }

  setLatLng(latlng) {
    this.latlng = latlng;
    if (this.marker) {
      this.marker.setLngLat(toLngLat(latlng));
    }
    return this;
  }

  on(event, callback) {
    if (event === 'dragend') {
      this.dragEndCallback = callback;
    }
    return this;
  }

  remove() {
    if (this.marker) {
      this.marker.remove();
      this.marker = null;
    }
    return this;
  }
}

class ShimPolyline {
  constructor(latlngs, options = {}) {
    this.latlngs = latlngs || [];
    this.options = options;
    this.id = 'poly-' + Math.random().toString(36).substr(2, 9);
    this.added = false;
  }

  addTo(target) {
    const map = state.map;
    if (!map) return this;

    const coordinates = this.latlngs.map(toLngLat);
    
    map.addSource(this.id, {
      type: 'geojson',
      data: {
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates: coordinates
        }
      }
    });

    map.addLayer({
      id: this.id + '-layer',
      type: 'line',
      source: this.id,
      layout: {
        'line-join': 'round',
        'line-cap': 'round'
      },
      paint: {
        'line-color': this.options.color || '#06b6d4',
        'line-width': this.options.weight || 4,
        'line-opacity': this.options.opacity || 0.85
      }
    });

    this.added = true;
    return this;
  }

  setLatLngs(latlngs) {
    this.latlngs = latlngs;
    if (this.added && state.map) {
      const source = state.map.getSource(this.id);
      if (source) {
        source.setData({
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates: latlngs.map(toLngLat)
          }
        });
      }
    }
    return this;
  }

  getBounds() {
    if (this.latlngs.length === 0) return null;
    let minLat = Infinity, maxLat = -Infinity, minLng = Infinity, maxLng = -Infinity;
    this.latlngs.forEach(ll => {
      const lat = ll[0] !== undefined ? ll[0] : ll.lat;
      const lng = ll[1] !== undefined ? ll[1] : ll.lng;
      if (lat < minLat) minLat = lat;
      if (lat > maxLat) maxLat = lat;
      if (lng < minLng) minLng = lng;
      if (lng > maxLng) maxLng = lng;
    });
    return {
      getSouthWest: () => ({ lat: minLat, lng: minLng }),
      getNorthEast: () => ({ lat: maxLat, lng: maxLng })
    };
  }

  remove() {
    if (this.added && state.map) {
      if (state.map.getLayer(this.id + '-layer')) state.map.removeLayer(this.id + '-layer');
      if (state.map.getSource(this.id)) state.map.removeSource(this.id);
      this.added = false;
    }
    return this;
  }
}

class ShimCircle {
  constructor(latlng, radiusMeters, options = {}) {
    this.latlng = latlng;
    this.radius = radiusMeters;
    this.options = options;
    this.id = 'circle-' + Math.random().toString(36).substr(2, 9);
    this.added = false;
  }

  addTo(target) {
    const map = state.map;
    if (!map) return this;

    const geojson = this.getCircleGeoJSON();
    map.addSource(this.id, {
      type: 'geojson',
      data: geojson
    });

    map.addLayer({
      id: this.id + '-layer',
      type: 'fill',
      source: this.id,
      paint: {
        'fill-color': this.options.color || '#f43f5e',
        'fill-opacity': this.options.fillOpacity || 0.15
      }
    });

    map.addLayer({
      id: this.id + '-outline',
      type: 'line',
      source: this.id,
      paint: {
        'line-color': this.options.color || '#f43f5e',
        'line-width': this.options.weight || 2,
        'line-dasharray': [3, 3]
      }
    });

    this.added = true;
    return this;
  }

  setLatLng(latlng) {
    this.latlng = latlng;
    this.updateGeoJSON();
    return this;
  }

  setRadius(radiusMeters) {
    this.radius = radiusMeters;
    this.updateGeoJSON();
    return this;
  }

  updateGeoJSON() {
    if (this.added && state.map) {
      const source = state.map.getSource(this.id);
      if (source) {
        source.setData(this.getCircleGeoJSON());
      }
    }
  }

  getCircleGeoJSON() {
    const center = toLngLat(this.latlng);
    const radiusKM = this.radius / 1000;
    const points = 64;
    const coords = [];
    const distanceX = radiusKM / (111.32 * Math.cos(center[1] * Math.PI / 180));
    const distanceY = radiusKM / 110.57;

    for (let i = 0; i < points; i++) {
      const theta = (i / points) * (2 * Math.PI);
      const x = center[0] + distanceX * Math.cos(theta);
      const y = center[1] + distanceY * Math.sin(theta);
      coords.push([x, y]);
    }
    coords.push(coords[0]);

    return {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [coords]
      }
    };
  }

  remove() {
    if (this.added && state.map) {
      if (state.map.getLayer(this.id + '-layer')) state.map.removeLayer(this.id + '-layer');
      if (state.map.getLayer(this.id + '-outline')) state.map.removeLayer(this.id + '-outline');
      if (state.map.getSource(this.id)) state.map.removeSource(this.id);
      this.added = false;
    }
    return this;
  }
}

class ShimPolygon {
  constructor(latlngs, options = {}) {
    this.latlngs = latlngs;
    this.options = options;
    this.id = 'polygon-' + Math.random().toString(36).substr(2, 9);
    this.added = false;
    this.popupContent = null;
  }

  addTo(target) {
    const map = state.map;
    if (!map) return this;

    let coordinates = [];
    if (Array.isArray(this.latlngs[0])) {
      coordinates = [this.latlngs.map(toLngLat)];
    } else {
      coordinates = [this.latlngs.map(toLngLat)];
    }

    map.addSource(this.id, {
      type: 'geojson',
      data: {
        type: 'Feature',
        geometry: {
          type: 'Polygon',
          coordinates: coordinates
        }
      }
    });

    map.addLayer({
      id: this.id + '-layer',
      type: 'fill',
      source: this.id,
      paint: {
        'fill-color': this.options.fillColor || this.options.color || '#ef4444',
        'fill-opacity': this.options.fillOpacity || 0.2
      }
    });

    map.addLayer({
      id: this.id + '-outline',
      type: 'line',
      source: this.id,
      paint: {
        'line-color': this.options.color || '#ef4444',
        'line-width': this.options.weight || 2
      }
    });

    if (this.popupContent) {
      map.on('click', this.id + '-layer', (e) => {
        new maplibregl.Popup()
          .setLngLat(e.lngLat)
          .setHTML(this.popupContent)
          .addTo(map);
      });
    }

    this.added = true;
    return this;
  }

  bindPopup(content) {
    this.popupContent = content;
    return this;
  }

  remove() {
    if (this.added && state.map) {
      if (state.map.getLayer(this.id + '-layer')) state.map.removeLayer(this.id + '-layer');
      if (state.map.getLayer(this.id + '-outline')) state.map.removeLayer(this.id + '-outline');
      if (state.map.getSource(this.id)) state.map.removeSource(this.id);
      this.added = false;
    }
    return this;
  }
}

class ShimLayerGroup {
  constructor() {
    this.layers = new Set();
    this.map = null;
  }

  addTo(map) {
    this.map = map;
    this.layers.forEach(l => l.addTo(map));
    return this;
  }

  addLayer(layer) {
    this.layers.add(layer);
    if (this.map || state.map) {
      layer.addTo(this.map || state.map);
    }
    return this;
  }

  removeLayer(layer) {
    this.layers.delete(layer);
    layer.remove();
    return this;
  }

  clearLayers() {
    this.layers.forEach(l => l.remove());
    this.layers.clear();
    return this;
  }

  remove() {
    this.clearLayers();
    this.map = null;
  }
}

class ShimGeoJSON {
  constructor(geojson, options = {}) {
    this.geojson = geojson;
    this.options = options;
    this.id = 'geojson-' + Math.random().toString(36).substr(2, 9);
    this.added = false;
    this.popupContent = null;
  }

  addTo(target) {
    const map = state.map;
    if (!map) return this;

    map.addSource(this.id, {
      type: 'geojson',
      data: this.geojson
    });

    if (this.geojson.type === 'Point' || this.geojson.type === 'MultiPoint') {
      map.addLayer({
        id: this.id + '-circle',
        type: 'circle',
        source: this.id,
        paint: {
          'circle-radius': 8,
          'circle-color': '#ef4444',
          'circle-stroke-width': 2,
          'circle-stroke-color': '#ffffff'
        }
      });
      if (this.popupContent) {
        map.on('click', this.id + '-circle', (e) => {
          new maplibregl.Popup().setLngLat(e.lngLat).setHTML(this.popupContent).addTo(map);
        });
      }
    } else {
      map.addLayer({
        id: this.id + '-fill',
        type: 'fill',
        source: this.id,
        filter: ['==', '$type', 'Polygon'],
        paint: {
          'fill-color': '#ef4444',
          'fill-opacity': 0.2
        }
      });
      map.addLayer({
        id: this.id + '-stroke',
        type: 'line',
        source: this.id,
        paint: {
          'line-color': '#ef4444',
          'line-width': 2
        }
      });
      if (this.popupContent) {
        map.on('click', this.id + '-fill', (e) => {
          new maplibregl.Popup().setLngLat(e.lngLat).setHTML(this.popupContent).addTo(map);
        });
        map.on('click', this.id + '-stroke', (e) => {
          new maplibregl.Popup().setLngLat(e.lngLat).setHTML(this.popupContent).addTo(map);
        });
      }
    }

    this.added = true;
    return this;
  }

  bindPopup(content) {
    this.popupContent = content;
    return this;
  }

  remove() {
    if (this.added && state.map) {
      if (state.map.getLayer(this.id + '-circle')) state.map.removeLayer(this.id + '-circle');
      if (state.map.getLayer(this.id + '-fill')) state.map.removeLayer(this.id + '-fill');
      if (state.map.getLayer(this.id + '-stroke')) state.map.removeLayer(this.id + '-stroke');
      if (state.map.getSource(this.id)) state.map.removeSource(this.id);
      this.added = false;
    }
    return this;
  }
}

class ShimImageOverlay {
  constructor(url, bounds, options = {}) {
    this.url = url;
    this.bounds = bounds;
    this.options = options;
    this.id = 'image-overlay-' + Math.random().toString(36).substr(2, 9);
    this.added = false;
  }

  addTo(target) {
    const map = state.map;
    if (!map) return this;

    const sw = this.bounds.getSouthWest();
    const ne = this.bounds.getNorthEast();

    const coordinates = [
      [sw.lng, ne.lat],
      [ne.lng, ne.lat],
      [ne.lng, sw.lat],
      [sw.lng, sw.lat]
    ];

    map.addSource(this.id, {
      type: 'image',
      url: this.url,
      coordinates: coordinates
    });

    map.addLayer({
      id: this.id + '-layer',
      type: 'raster',
      source: this.id,
      paint: {
        'raster-opacity': this.options.opacity || 1.0
      }
    });

    this.added = true;
    return this;
  }

  setUrl(url) {
    this.url = url;
    if (this.added && state.map) {
      const source = state.map.getSource(this.id);
      if (source) {
        source.updateImage({ url: url });
      }
    }
    return this;
  }

  remove() {
    if (this.added && state.map) {
      if (state.map.getLayer(this.id + '-layer')) state.map.removeLayer(this.id + '-layer');
      if (state.map.getSource(this.id)) state.map.removeSource(this.id);
      this.added = false;
    }
    return this;
  }
}

// Global L object definition
window.L = {
  map: (container, options) => {
    return state.map;
  },
  marker: (latlng, options) => new ShimMarker(latlng, options),
  polyline: (latlngs, options) => new ShimPolyline(latlngs, options),
  circle: (latlng, radius, options) => new ShimCircle(latlng, radius, options),
  polygon: (latlngs, options) => new ShimPolygon(latlngs, options),
  layerGroup: () => new ShimLayerGroup(),
  featureGroup: () => new ShimLayerGroup(),
  geoJSON: (geojson, options) => new ShimGeoJSON(geojson, options),
  imageOverlay: (url, bounds, options) => new ShimImageOverlay(url, bounds, options),
  divIcon: (options) => ({ html: options.html, className: options.className }),
  circleMarker: (latlng, options) => {
    const radius = options.radius || 8;
    const color = options.color || '#06b6d4';
    const dotIcon = window.L.divIcon({
      className: 'circle-marker-dot',
      html: `<div style="background: ${color}; width: ${radius*2}px; height: ${radius*2}px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 5px rgba(0,0,0,0.5);"></div>`
    });
    return new ShimMarker(latlng, { icon: dotIcon });
  },
  latLng: (lat, lng) => [lat, lng],
  latLngBounds: (coords) => {
    let minLat = Infinity, maxLat = -Infinity, minLng = Infinity, maxLng = -Infinity;
    coords.forEach(c => {
      const lat = c[0] !== undefined ? c[0] : c.lat;
      const lng = c[1] !== undefined ? c[1] : c.lng;
      if (lat < minLat) minLat = lat;
      if (lat > maxLat) maxLat = lat;
      if (lng < minLng) minLng = lng;
      if (lng > maxLng) maxLng = lng;
    });
    return {
      getSouthWest: () => ({ lat: minLat, lng: minLng }),
      getNorthEast: () => ({ lat: maxLat, lng: maxLng })
    };
  },
  DomEvent: {
    disableClickPropagation: () => {},
    disableScrollPropagation: () => {},
    preventDefault: (e) => e.preventDefault(),
    stopPropagation: (e) => e.stopPropagation(),
    on: (el, type, fn) => el.addEventListener(type, fn)
  },
  Control: {
    extend: (options) => {
      return class CustomControl {
        onAdd(map) {
          return options.onAdd(map);
        }
        onRemove(map) {
          if (options.onRemove) options.onRemove(map);
        }
      };
    }
  },
  control: {
    recenter: (options) => ({
      addTo: (map) => {}
    })
  }
};
