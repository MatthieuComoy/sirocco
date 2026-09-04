<script lang="ts">
  import L from 'leaflet';
  import { getContext, onDestroy } from 'svelte';
  import { get } from 'svelte/store';
  import type { MapStore } from '../context';
  import { MAP_CONTEXT_KEY } from '../context';
  import { warnings, type Warning } from '../../stores/warnings';
  import { buildWarningPopupHtml, getWarningEmoji } from '../../services/pingWarnings';

  // Below this zoom, individual point-warning icons are skipped: there can be
  // hundreds of markers loaded across all French territories at once, and
  // rendering them all when zoomed way out is what tanks map performance.
  const MIN_ZOOM_FOR_POINT_ICONS = 8;

  const mapStore = getContext<MapStore>(MAP_CONTEXT_KEY);

  let layerGroup: L.LayerGroup | null = null;
  let wmsLayer: L.TileLayer.WMS | null = null;
  let debounceTimer: ReturnType<typeof setTimeout> | null = null;

  function createWarningIcon(emoji: string): L.DivIcon {
    return L.divIcon({
      html: `<div class="warning-map-marker">${emoji}</div>`,
      className: 'custom-warning-div-icon',
      iconSize: [32, 32],
      iconAnchor: [16, 16],
      popupAnchor: [0, -16],
    });
  }

  function getGeometryBounds(geometry: Warning['geometry']): L.LatLngBounds | null {
    if (!geometry) return null;
    if (geometry.type === 'Point') return L.latLngBounds([geometry.coordinates, geometry.coordinates]);
    if (Array.isArray(geometry.coordinates) && geometry.coordinates.length > 0) {
      return L.latLngBounds(geometry.coordinates as L.LatLngExpression[]);
    }
    return null;
  }

  /**
   * Pans the map so the popup itself — not the marker/zone it's attached to
   * — ends up centered on screen. Leaflet's default autoPan only nudges the
   * view just enough to fit the popup at an edge, which for a large area/
   * line warning can leave the popup (and the zone) barely on screen.
   * Popups reposition purely off their anchor's LatLng and the current view,
   * so panning to whatever LatLng currently renders at the popup's own
   * on-screen center lands it dead center once the pan settles.
   */
  function centerOnPopup(map: L.Map, popup: L.Popup) {
    const popupEl = popup.getElement();
    if (!popupEl) return;
    const popupRect = popupEl.getBoundingClientRect();
    const mapRect = map.getContainer().getBoundingClientRect();
    const popupCenterPoint = L.point(
      popupRect.left + popupRect.width / 2 - mapRect.left,
      popupRect.top + popupRect.height / 2 - mapRect.top
    );
    map.panTo(map.containerPointToLatLng(popupCenterPoint));
  }

  function isAnyPopupOpen(): boolean {
    if (!layerGroup) return false;
    let open = false;
    layerGroup.eachLayer((layer: L.Layer) => {
      const withPopup = layer as L.Layer & { isPopupOpen?: () => boolean; eachLayer?: (fn: (l: L.Layer) => void) => void };
      if (withPopup.isPopupOpen?.()) open = true;
      withPopup.eachLayer?.((sub) => {
        const subWithPopup = sub as L.Layer & { isPopupOpen?: () => boolean };
        if (subWithPopup.isPopupOpen?.()) open = true;
      });
    });
    return open;
  }

  function plot() {
    const map = get(mapStore);
    if (!map || !layerGroup) return;
    if (isAnyPopupOpen()) return; // don't tear down a marker whose popup is open

    layerGroup.clearLayers();

    const { list, filter } = get(warnings);
    const zoom = map.getZoom();
    const viewBounds = map.getBounds().pad(0.5);
    const showPointIcons = zoom >= MIN_ZOOM_FOR_POINT_ICONS;

    for (const warn of list) {
      if (!warn.geometry || !warn.visible) continue;

      let filteredOut = !filter.showAll;
      if (!filteredOut) {
        if (warn.type === 'avinav' && !filter.showAvinav) filteredOut = true;
        if (warn.type === 'avurnav_local' && !filter.showAvurnavLocal) filteredOut = true;
        if ((warn.type === 'avurnav' || warn.type === 'navarea') && !filter.showAvurnav) filteredOut = true;
      }
      if (filteredOut) continue;

      const isPointType = warn.geometry.type === 'Point' || warn.geometry.type === 'MultiPoint';
      if (isPointType && !showPointIcons) continue;

      const geomBounds = getGeometryBounds(warn.geometry);
      if (geomBounds && !viewBounds.intersects(geomBounds)) continue;

      const emoji = getWarningEmoji(warn.hazardTypeDetails || warn.preamble?.hazardTypeGeneral, warn.information);
      const isAvinav = warn.type === 'avinav';
      const color = isAvinav ? '#f59e0b' : '#ef4444';
      const headerColor = isAvinav ? '#d97706' : '#ef4444';

      let mapLayer: L.Layer | null = null;

      if (warn.geometry.type === 'Point') {
        mapLayer = L.marker(warn.geometry.coordinates, { icon: createWarningIcon(emoji) });
      } else if (warn.geometry.type === 'Polygon') {
        mapLayer = L.polygon(warn.geometry.coordinates, { color, weight: 2, fillColor: color, fillOpacity: 0.2 });
      } else if (warn.geometry.type === 'LineString') {
        mapLayer = L.polyline(warn.geometry.coordinates, { color, weight: 3, opacity: 0.8 });
      } else if (warn.geometry.type === 'MultiPoint') {
        const group = L.featureGroup();
        const icon = createWarningIcon(emoji);
        warn.geometry.coordinates.forEach((c) => L.marker(c, { icon }).addTo(group));
        mapLayer = group;
      }

      if (mapLayer) {
        mapLayer.bindPopup(() => buildWarningPopupHtml(warn, emoji, headerColor), { maxWidth: 440, minWidth: 320 });
        mapLayer.on('popupopen', (e) => {
          const openMap = get(mapStore);
          if (openMap) centerOnPopup(openMap, e.popup);
        });
        layerGroup.addLayer(mapLayer);
      }
    }
  }

  function schedulePlot() {
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(plot, 250);
  }

  function syncWmsLayer(map: L.Map) {
    const { filter } = get(warnings);
    const shouldShow = filter.showAll && (filter.showAvurnav || filter.showAvurnavLocal || filter.showAvinav);
    if (!wmsLayer) {
      wmsLayer = L.tileLayer.wms('https://services.ping-info-nautique.fr/wms', {
        layers: 'avurnav_active_zones',
        format: 'image/png',
        transparent: true,
        attribution: '© SHOM - Portail PING',
      });
    }
    if (shouldShow) {
      if (!map.hasLayer(wmsLayer)) wmsLayer.addTo(map);
    } else if (map.hasLayer(wmsLayer)) {
      map.removeLayer(wmsLayer);
    }
  }

  let attachedMap: L.Map | null = null;

  const unsubMap = mapStore.subscribe((map) => {
    if (!map || attachedMap) return;
    attachedMap = map;
    layerGroup = L.layerGroup().addTo(map);
    map.on('moveend zoomend', schedulePlot);
    syncWmsLayer(map);
    plot();
  });

  const unsubWarnings = warnings.subscribe(() => {
    if (!attachedMap) return;
    plot();
    syncWmsLayer(attachedMap);
  });

  onDestroy(() => {
    unsubMap();
    unsubWarnings();
    if (debounceTimer) clearTimeout(debounceTimer);
    layerGroup?.remove();
    if (wmsLayer && attachedMap?.hasLayer(wmsLayer)) attachedMap.removeLayer(wmsLayer);
  });
</script>

<style>
  :global(.warning-map-marker) {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    font-size: 1.7rem;
    cursor: pointer;
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.4));
  }
</style>
