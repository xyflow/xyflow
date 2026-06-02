import { isMouseEvent, isTouchEvent, type D3ZoomInputEvent } from '../utils/events';
import { isWrappedWithClass } from './utils';

export type FilterParams = {
  zoomActivationKeyPressed: boolean;
  zoomOnScroll: boolean;
  zoomOnPinch: boolean;
  panOnDrag: boolean | number[];
  panOnScroll: boolean;
  zoomOnDoubleClick: boolean;
  userSelectionActive: boolean;
  noWheelClassName: string;
  noPanClassName: string;
  lib: string;
  connectionInProgress: boolean;
};

export function createFilter({
  zoomActivationKeyPressed,
  zoomOnScroll,
  zoomOnPinch,
  panOnDrag,
  panOnScroll,
  zoomOnDoubleClick,
  userSelectionActive,
  noWheelClassName,
  noPanClassName,
  lib,
  connectionInProgress,
}: FilterParams) {
  return (event: D3ZoomInputEvent): boolean => {
    const zoomScroll = zoomActivationKeyPressed || zoomOnScroll;
    const pinchZoom = zoomOnPinch && event.ctrlKey;
    const isWheelEvent = event.type === 'wheel';

    if (
      isMouseEvent(event) &&
      event.button === 1 &&
      event.type === 'mousedown' &&
      (isWrappedWithClass(event, `${lib}-flow__node`) || isWrappedWithClass(event, `${lib}-flow__edge`))
    ) {
      return true;
    }

    // if all interactions are disabled, we prevent all zoom events
    if (!panOnDrag && !zoomScroll && !panOnScroll && !zoomOnDoubleClick && !zoomOnPinch) {
      return false;
    }

    // during a selection we prevent all other interactions
    if (userSelectionActive) {
      return false;
    }

    // we want to disable pinch-zooming while making a connection
    if (connectionInProgress && !isWheelEvent) {
      return false;
    }

    // if the target element is inside an element with the nowheel class, we prevent zooming
    if (isWrappedWithClass(event, noWheelClassName) && isWheelEvent) {
      return false;
    }

    // if the target element is inside an element with the nopan class, we prevent panning
    if (
      isWrappedWithClass(event, noPanClassName) &&
      (!isWheelEvent || (panOnScroll && isWheelEvent && !zoomActivationKeyPressed))
    ) {
      return false;
    }

    if (!zoomOnPinch && event.ctrlKey && isWheelEvent) {
      return false;
    }

    if (!zoomOnPinch && isTouchEvent(event) && event.type === 'touchstart' && event.touches.length > 1) {
      event.preventDefault(); // if you manage to start with 2 touches, we prevent native zoom
      return false;
    }

    // when there is no scroll handling enabled, we prevent all wheel events
    if (!zoomScroll && !panOnScroll && !pinchZoom && isWheelEvent) {
      return false;
    }

    // if the pane is not movable, we prevent dragging it with mousestart or touchstart
    if (!panOnDrag && (event.type === 'mousedown' || event.type === 'touchstart')) {
      return false;
    }

    // if the pane is only movable using allowed clicks
    if (Array.isArray(panOnDrag) && isMouseEvent(event) && !panOnDrag.includes(event.button)) {
      return false;
    }

    // We only allow right clicks if pan on drag is set to right click
    const button = isMouseEvent(event) ? event.button : 0;
    const buttonAllowed = (Array.isArray(panOnDrag) && panOnDrag.includes(button)) || button <= 1;

    // default filter for d3-zoom
    return (!event.ctrlKey || isWheelEvent) && buttonAllowed;
  };
}
