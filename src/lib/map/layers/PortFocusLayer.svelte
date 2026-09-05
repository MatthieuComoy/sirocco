<script lang="ts">
  import L from 'leaflet';
  import { getContext, onDestroy } from 'svelte';
  import { get } from 'svelte/store';
  import { _ } from 'svelte-i18n';
  import type { MapStore } from '../context';
  import { MAP_CONTEXT_KEY } from '../context';
  import { portFocus, type PortFocusRequest } from '../../stores/portFocus';
  import { escapeXml } from '../../services/utils';
  import type { Port } from '../../services/portSearch';
  import type { WikipediaSummary } from '../../services/portEnrichment';

  const FOCUS_ZOOM = 14;

  const PORT_ICON = L.divIcon({
    className: 'port-focus-marker',
    html: `
      <svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="#0ea5e9" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M5 21c1.5-1.2 3-1.2 4.5 0s3 1.2 4.5 0 3-1.2 4.5 0" fill="none" />
        <path d="M12 3v11" />
        <path d="M12 3l6 3-6 3" fill="#0ea5e9" stroke="none" />
      </svg>
    `,
    iconSize: [30, 30],
    iconAnchor: [15, 24],
    popupAnchor: [0, -22],
  });

  const mapStore = getContext<MapStore>(MAP_CONTEXT_KEY);

  let marker: L.Marker | null = null;

  // Same fix as WarningsLayer: Leaflet's default autoPan only nudges the
  // view enough to fit the popup at an edge, which here tends to leave it
  // half-hidden behind the sidebar overlay. Panning so the popup's own
  // on-screen center lands at the view's center sidesteps that.
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

  function buildPopupHtml(port: Port, wiki?: WikipediaSummary | null): string {
    const rows: string[] = [];
    if (port.vhfChannel !== null) {
      rows.push(`<div class="port-popup-row"><span>${$_('port_vhf_lbl')}</span><span>VHF ${port.vhfChannel}</span></div>`);
    }
    if (port.phone) {
      rows.push(`<div class="port-popup-row"><span>${$_('port_phone_lbl')}</span><span>${escapeXml(port.phone)}</span></div>`);
    }
    if (port.visitorBerths !== null) {
      rows.push(`<div class="port-popup-row"><span>${$_('port_visitor_berths_lbl')}</span><span>${port.visitorBerths}</span></div>`);
    }

    const thumbnail = wiki?.thumbnailUrl
      ? `<img class="port-popup-photo" src="${escapeXml(wiki.thumbnailUrl)}" alt="${escapeXml(wiki.title)}" />`
      : '';
    const wikiBlock = wiki
      ? `
        ${thumbnail}
        <p class="port-popup-desc">${escapeXml(wiki.extract)}</p>
        <a class="port-popup-wiki-link" href="${escapeXml(wiki.pageUrl)}" target="_blank" rel="noopener noreferrer">${$_('port_wiki_link_lbl')}</a>
      `
      : '';

    return `
      <div class="port-popup">
        <div class="port-popup-title">${escapeXml(port.name)}</div>
        <div class="port-popup-city">${escapeXml(port.city)}</div>
        <p class="port-popup-desc">${escapeXml(port.description)}</p>
        ${rows.join('')}
        ${wikiBlock}
      </div>
    `;
  }

  const unsub = portFocus.subscribe((request: PortFocusRequest | null) => {
    const map = get(mapStore);
    if (!map || !request) return;

    const { port, wiki } = request;
    if (!marker) {
      marker = L.marker([port.lat, port.lon], { icon: PORT_ICON }).addTo(map);
      marker.bindPopup(buildPopupHtml(port, wiki), { maxWidth: 320, minWidth: 220 });
      marker.on('popupopen', (e) => {
        const openMap = get(mapStore);
        if (openMap) centerOnPopup(openMap, e.popup);
      });
    } else {
      marker.setLatLng([port.lat, port.lon]);
      marker.setPopupContent(buildPopupHtml(port, wiki));
    }
    map.flyTo([port.lat, port.lon], Math.max(map.getZoom(), FOCUS_ZOOM), { duration: 0.6 });
    marker.openPopup();
  });

  onDestroy(() => {
    unsub();
    marker?.remove();
  });
</script>

<style>
  :global(.port-popup) {
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
  }

  :global(.port-popup-title) {
    font-weight: 700;
    font-size: 0.95rem;
  }

  :global(.port-popup-city) {
    font-size: 0.8rem;
    opacity: 0.75;
  }

  :global(.port-popup-desc) {
    font-size: 0.82rem;
    line-height: 1.4;
    margin: 0.15rem 0;
  }

  :global(.port-popup-row) {
    display: flex;
    justify-content: space-between;
    gap: 0.75rem;
    font-size: 0.82rem;
    border-top: 1px solid rgba(128, 128, 128, 0.25);
    padding-top: 0.2rem;
  }

  :global(.port-popup-photo) {
    width: 100%;
    max-height: 140px;
    object-fit: cover;
    border-radius: 6px;
    margin-top: 0.2rem;
  }

  :global(.port-popup-wiki-link) {
    font-size: 0.78rem;
    color: #0ea5e9;
  }
</style>
