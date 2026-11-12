/* eslint-disable @typescript-eslint/ban-ts-comment */
import type { D3ZoomEvent } from 'd3-zoom';
import { pointer } from 'd3-selection';
import type { ZoomTransform } from 'd3-zoom';

import {
  PanOnScrollMode,
  type D3SelectionInstance,
  type D3ZoomHandler,
  type D3ZoomInstance,
  type OnPanZoom,
  type OnDraggingChange,
  type OnTransformChange,
} from '../types';
import { isRightClickPan, isWrappedWithClass, transformToViewport, wheelDelta } from './utils';
import { isMacOs } from '../utils';
import { type D3ZoomInputEvent, type XYFlowSourceEvent } from '../utils/events';
import { type ZoomPanValues } from './XYPanZoom';

export type PanOnScrollParams = {
  zoomPanValues: ZoomPanValues;
  noWheelClassName: string;
  d3Selection: D3SelectionInstance;
  d3Zoom: D3ZoomInstance;
  panOnScrollMode: PanOnScrollMode;
  panOnScrollSpeed: number;
  zoomOnPinch: boolean;
  onPanZoomStart?: OnPanZoom;
  onPanZoom?: OnPanZoom;
  onPanZoomEnd?: OnPanZoom;
};

export type ZoomOnScrollParams = {
  noWheelClassName: string;
  preventScrolling: boolean;
  d3ZoomHandler: D3ZoomHandler;
};

export type PanZoomStartParams = {
  zoomPanValues: ZoomPanValues;
  paneDragThreshold: number;
  onDraggingChange: OnDraggingChange;
  onPanZoomStart?: OnPanZoom;
};

export type PanZoomParams = {
  zoomPanValues: ZoomPanValues;
  d3Selection: D3SelectionInstance;
  paneDragThreshold: number;
  onDraggingChange: OnDraggingChange;
  onTransformChange: OnTransformChange;
  onPanZoomStart?: OnPanZoom;
  onPanZoom?: OnPanZoom;
};

export type PanZoomEndParams = {
  zoomPanValues: ZoomPanValues;
  panOnDrag: boolean | number[];
  panOnScroll: boolean;
  onDraggingChange: (isDragging: boolean) => void;
  onPanZoomEnd?: OnPanZoom;
  onPaneContextMenu?: (event: MouseEvent) => void;
};

export function createPanOnScrollHandler({
  zoomPanValues,
  noWheelClassName,
  d3Selection,
  d3Zoom,
  panOnScrollMode,
  panOnScrollSpeed,
  zoomOnPinch,
  onPanZoomStart,
  onPanZoom,
  onPanZoomEnd,
}: PanOnScrollParams) {
  return (event: WheelEvent) => {
    if (isWrappedWithClass(event, noWheelClassName)) {
      if (event.ctrlKey) {
        event.preventDefault(); // stop native page zoom for pinch zooming
      }
      return false;
    }
    event.preventDefault();
    event.stopImmediatePropagation();

    const currentZoom = (d3Selection.property('__zoom') as ZoomTransform).k || 1;

    // macos sets ctrlKey=true for pinch gesture on a trackpad
    if (event.ctrlKey && zoomOnPinch) {
      const point = pointer(event);
      const pinchDelta = wheelDelta(event);
      const zoom = currentZoom * Math.pow(2, pinchDelta);
      // @ts-ignore
      d3Zoom.scaleTo(d3Selection, zoom, point, event);

      return;
    }

    /*
     * increase scroll speed in firefox
     * firefox: deltaMode === 1; chrome: deltaMode === 0
     */
    const deltaNormalize = event.deltaMode === 1 ? 20 : 1;
    let deltaX = panOnScrollMode === PanOnScrollMode.Vertical ? 0 : event.deltaX * deltaNormalize;
    let deltaY = panOnScrollMode === PanOnScrollMode.Horizontal ? 0 : event.deltaY * deltaNormalize;

    // this enables vertical scrolling with shift + scroll on windows
    if (!isMacOs() && event.shiftKey && panOnScrollMode !== PanOnScrollMode.Vertical) {
      deltaX = event.deltaY * deltaNormalize;
      deltaY = 0;
    }

    d3Zoom.translateBy(
      d3Selection,
      -(deltaX / currentZoom) * panOnScrollSpeed,
      -(deltaY / currentZoom) * panOnScrollSpeed,
      // @ts-ignore
      { internal: true }
    );

    const nextViewport = transformToViewport(d3Selection.property('__zoom') as ZoomTransform);

    clearTimeout(zoomPanValues.panScrollTimeout);

    /*
     * for pan on scroll we need to handle the event calls on our own
     * we can't use the start, zoom and end events from d3-zoom
     * because start and move gets called on every scroll event and not once at the beginning
     */
    if (!zoomPanValues.isPanScrolling) {
      zoomPanValues.isPanScrolling = true;

      onPanZoomStart?.(event, nextViewport);
    } else {
      onPanZoom?.(event, nextViewport);
    }

    zoomPanValues.panScrollTimeout = setTimeout(() => {
      onPanZoomEnd?.(event, nextViewport);

      zoomPanValues.isPanScrolling = false;
    }, 150);
  };
}

export function createZoomOnScrollHandler({ noWheelClassName, preventScrolling, d3ZoomHandler }: ZoomOnScrollParams) {
  return function (this: Element, event: D3ZoomInputEvent, d: unknown) {
    const isWheel = event.type === 'wheel';
    // we still want to enable pinch zooming even if preventScrolling is set to false
    const preventZoom = !preventScrolling && isWheel && !event.ctrlKey;
    const hasNoWheelClass = isWrappedWithClass(event, noWheelClassName);

    // if user is pinch zooming above a nowheel element, we don't want the browser to zoom
    if (event.ctrlKey && isWheel && hasNoWheelClass) {
      event.preventDefault();
    }

    if (preventZoom || hasNoWheelClass) {
      return null;
    }

    event.preventDefault();

    d3ZoomHandler.call(this, event, d);
  };
}

function startMove(zoomPanValues: ZoomPanValues, sourceEvent: Event | null, onPanZoomStart?: OnPanZoom) {
  const pointerDrag = zoomPanValues.pointerDrag;
  if (!pointerDrag || pointerDrag.moveStarted) {
    return;
  }

  pointerDrag.moveStarted = true;
  onPanZoomStart?.(sourceEvent as MouseEvent | TouchEvent | null, zoomPanValues.prevViewport);
}

function startPointerDrag(
  zoomPanValues: ZoomPanValues,
  sourceEvent: Event,
  onDraggingChange: OnDraggingChange,
  onPanZoomStart?: OnPanZoom
) {
  const pointerDrag = zoomPanValues.pointerDrag;
  if (!pointerDrag) {
    return;
  }

  startMove(zoomPanValues, sourceEvent, onPanZoomStart);
  pointerDrag.dragging = true;

  // touch gestures never toggled the dragging state
  if (!pointerDrag.isTouch) {
    onDraggingChange(true);
  }
}

function isPointerMove(sourceEvent: Event | null): sourceEvent is MouseEvent | TouchEvent {
  return sourceEvent?.type === 'mousemove' || sourceEvent?.type === 'touchmove';
}

function getPointerPosition(sourceEvent: MouseEvent | TouchEvent, touchId: number | null) {
  if (!('touches' in sourceEvent)) {
    return sourceEvent;
  }

  return Array.from(sourceEvent.touches).find((touch) => touch.identifier === touchId) ?? null;
}

export function createPanZoomStartHandler({
  zoomPanValues,
  paneDragThreshold,
  onDraggingChange,
  onPanZoomStart,
}: PanZoomStartParams) {
  return (event: D3ZoomEvent<HTMLDivElement, unknown>) => {
    const sourceEvent = event.sourceEvent as XYFlowSourceEvent | null;

    if (!sourceEvent || sourceEvent.internal) {
      return;
    }

    const viewport = transformToViewport(event.transform);

    // we need to remember it here, because it's always 0 in the "zoom" event
    zoomPanValues.mouseButton = 'button' in sourceEvent ? sourceEvent.button : 0;
    zoomPanValues.isZoomingOrPanning = true;
    zoomPanValues.prevViewport = viewport;
    zoomPanValues.pointerDrag = null;

    const isTouch = sourceEvent.type === 'touchstart';

    if (sourceEvent.type === 'mousedown' || isTouch) {
      const touch = isTouch ? (sourceEvent as TouchEvent).touches[0] : null;
      const { clientX, clientY } = touch ?? (sourceEvent as MouseEvent);

      zoomPanValues.pointerDrag = {
        isTouch,
        touchId: touch?.identifier ?? null,
        startX: clientX,
        startY: clientY,
        startTransform: event.transform,
        thresholdCrossed: false,
        lastMove: null,
        moveStarted: false,
        dragging: false,
      };

      if (paneDragThreshold === 0) {
        startPointerDrag(zoomPanValues, sourceEvent, onDraggingChange, onPanZoomStart);
      }

      return;
    }

    onPanZoomStart?.(sourceEvent, viewport);
  };
}

export function createPanZoomHandler({
  zoomPanValues,
  d3Selection,
  paneDragThreshold,
  onDraggingChange,
  onTransformChange,
  onPanZoomStart,
  onPanZoom,
}: PanZoomParams) {
  return (event: D3ZoomEvent<HTMLDivElement, unknown>) => {
    const sourceEvent = event.sourceEvent as XYFlowSourceEvent | null;
    const pointerDrag = zoomPanValues.pointerDrag;

    if (pointerDrag) {
      const isMove = isPointerMove(sourceEvent) && sourceEvent !== pointerDrag.lastMove;

      if (isMove) {
        pointerDrag.lastMove = sourceEvent;
      }

      if (isMove && !pointerDrag.thresholdCrossed) {
        const position = getPointerPosition(sourceEvent, pointerDrag.touchId);
        // a pinch (more than one touch) or a lost first touch always starts the gesture
        const isMultiTouch = 'touches' in sourceEvent && sourceEvent.touches.length > 1;

        if (!position || isMultiTouch) {
          pointerDrag.thresholdCrossed = true;
        } else {
          const dx = position.clientX - pointerDrag.startX;
          const dy = position.clientY - pointerDrag.startY;
          // same check as d3-zoom's clickDistance, so a gesture is either a click or a drag
          pointerDrag.thresholdCrossed = dx * dx + dy * dy > paneDragThreshold * paneDragThreshold;
        }
      }

      if (!pointerDrag.dragging) {
        if (!isMove) {
          // e.g. wheel zoom or setViewport while the pointer is pressed: accept it as the new resting transform
          pointerDrag.startTransform = event.transform;
          if (!sourceEvent?.internal) {
            startMove(zoomPanValues, sourceEvent, onPanZoomStart);
          }
        } else if (pointerDrag.thresholdCrossed) {
          startPointerDrag(zoomPanValues, sourceEvent, onDraggingChange, onPanZoomStart);
        } else {
          // below the threshold: undo the transform d3-zoom already stored, so it stays in sync with the viewport
          d3Selection.property('__zoom', pointerDrag.startTransform);
          return;
        }
      }
    }

    if (!sourceEvent?.sync) {
      onTransformChange([event.transform.x, event.transform.y, event.transform.k]);
    }

    if (onPanZoom && !sourceEvent?.internal && (!pointerDrag || pointerDrag.moveStarted)) {
      onPanZoom?.(event.sourceEvent as MouseEvent | TouchEvent, transformToViewport(event.transform));
    }
  };
}

export function createPanZoomEndHandler({
  zoomPanValues,
  panOnDrag,
  panOnScroll,
  onDraggingChange,
  onPanZoomEnd,
  onPaneContextMenu,
}: PanZoomEndParams) {
  return (event: D3ZoomEvent<HTMLDivElement, unknown>) => {
    const sourceEvent = event.sourceEvent as XYFlowSourceEvent | null;

    if (sourceEvent?.internal) {
      return;
    }

    zoomPanValues.isZoomingOrPanning = false;

    const pointerDrag = zoomPanValues.pointerDrag;
    zoomPanValues.pointerDrag = null;

    // with right-click panning the native contextmenu event is prevented by the pane, so we emit it here
    if (
      onPaneContextMenu &&
      isRightClickPan(panOnDrag, zoomPanValues.mouseButton ?? 0) &&
      !pointerDrag?.thresholdCrossed &&
      event.sourceEvent
    ) {
      onPaneContextMenu(event.sourceEvent as MouseEvent);
    }

    // nothing moved during the mouse or touch gesture, so this was a click or tap
    if (pointerDrag && !pointerDrag.moveStarted) {
      return;
    }

    onDraggingChange(false);

    if (onPanZoomEnd) {
      const viewport = transformToViewport(event.transform);
      zoomPanValues.prevViewport = viewport;

      clearTimeout(zoomPanValues.timerId);
      zoomPanValues.timerId = setTimeout(
        () => {
          onPanZoomEnd?.(event.sourceEvent as MouseEvent | TouchEvent, viewport);
        },
        // we need a setTimeout for panOnScroll to suppress multiple end events fired during scroll
        panOnScroll ? 150 : 0
      );
    }
  };
}
