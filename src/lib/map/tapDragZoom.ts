import type L from 'leaflet';

// Google Maps' one-finger zoom, with the vertical direction flipped per this
// app's own convention: tap twice quickly in the same spot and, instead of
// releasing the second tap, drag down to zoom in or up to zoom out — the
// point under the tap stays anchored. A plain double-tap with no drag still
// zooms in by one level, same as the native gesture this replaces (see the
// doubleClickZoom.disable() below).
const DOUBLE_TAP_MAX_DELAY_MS = 300;
const DOUBLE_TAP_MAX_DIST_PX = 30;
const DRAG_MOVE_THRESHOLD_PX = 8; // below this, the 2nd tap counts as a plain tap
const PIXELS_PER_ZOOM_LEVEL = 80;

function dist(a: { x: number; y: number }, b: { x: number; y: number }): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

/** Wires the gesture onto `map`; returns a cleanup function that removes it. */
export function enableTapDragZoom(map: L.Map): () => void {
  const container = map.getContainer();

  let lastTapTime = 0;
  let lastTapPoint: { x: number; y: number } | null = null;

  let armed = false; // 2nd tap of a double-tap landed; waiting to see if it drags
  let dragMoved = false;
  let dragStartClientY = 0;
  let dragStartZoom = 0;
  let dragAnchorLatLng: L.LatLng | null = null;
  let appliedZoom = 0;
  let wasDraggingEnabled = true;

  function onTouchStart(e: TouchEvent) {
    if (e.touches.length !== 1) {
      // A second finger joined (pinch) — this isn't our gesture.
      if (armed) endGesture();
      return;
    }

    const touch = e.touches[0];
    const point = { x: touch.clientX, y: touch.clientY };
    const now = Date.now();

    if (lastTapPoint && now - lastTapTime < DOUBLE_TAP_MAX_DELAY_MS && dist(point, lastTapPoint) < DOUBLE_TAP_MAX_DIST_PX) {
      // Second tap: arm the gesture instead of letting it start a pan or
      // fire the browser's own double-tap-to-zoom.
      e.preventDefault();
      armed = true;
      dragMoved = false;
      dragStartClientY = touch.clientY;
      dragStartZoom = map.getZoom();
      appliedZoom = dragStartZoom;
      const rect = container.getBoundingClientRect();
      dragAnchorLatLng = map.containerPointToLatLng([point.x - rect.left, point.y - rect.top]);
      wasDraggingEnabled = map.dragging.enabled();
      map.dragging.disable();
      lastTapPoint = null;
    } else {
      lastTapTime = now;
      lastTapPoint = point;
    }
  }

  function onTouchMove(e: TouchEvent) {
    if (!armed || e.touches.length !== 1 || !dragAnchorLatLng) return;
    e.preventDefault();

    const touch = e.touches[0];
    const deltaY = touch.clientY - dragStartClientY; // dragging down = positive = zoom in
    if (!dragMoved && Math.abs(deltaY) > DRAG_MOVE_THRESHOLD_PX) dragMoved = true;
    if (!dragMoved) return;

    const zoomDelta = Math.round(deltaY / PIXELS_PER_ZOOM_LEVEL);
    const newZoom = Math.max(map.getMinZoom(), Math.min(map.getMaxZoom(), dragStartZoom + zoomDelta));
    if (newZoom !== appliedZoom) {
      appliedZoom = newZoom;
      map.setZoomAround(dragAnchorLatLng, newZoom, { animate: false });
    }
  }

  function endGesture() {
    if (!dragMoved && dragAnchorLatLng) {
      // Plain double-tap, no drag: zoom in one level, matching the default
      // touch behavior this gesture takes over from.
      map.setZoomAround(dragAnchorLatLng, dragStartZoom + 1, { animate: false });
    }
    if (wasDraggingEnabled) map.dragging.enable();
    armed = false;
    dragAnchorLatLng = null;
  }

  function onTouchEnd(e: TouchEvent) {
    if (armed && e.touches.length === 0) endGesture();
  }

  container.addEventListener('touchstart', onTouchStart, { passive: false });
  container.addEventListener('touchmove', onTouchMove, { passive: false });
  container.addEventListener('touchend', onTouchEnd);
  container.addEventListener('touchcancel', onTouchEnd);
  map.doubleClickZoom.disable();

  return () => {
    container.removeEventListener('touchstart', onTouchStart);
    container.removeEventListener('touchmove', onTouchMove);
    container.removeEventListener('touchend', onTouchEnd);
    container.removeEventListener('touchcancel', onTouchEnd);
    map.doubleClickZoom.enable();
  };
}
