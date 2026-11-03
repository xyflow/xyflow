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
  const mouseDrag = zoomPanValues.mouseDrag;
  if (!mouseDrag || mouseDrag.moveStarted) {
    return;
  }

  mouseDrag.moveStarted = true;
  onPanZoomStart?.(sourceEvent as MouseEvent | null, zoomPanValues.prevViewport);
}

function startMouseDrag(
  zoomPanValues: ZoomPanValues,
  sourceEvent: MouseEvent,
  onDraggingChange: OnDraggingChange,
  onPanZoomStart?: OnPanZoom
) {
  if (!zoomPanValues.mouseDrag) {
    return;
  }

  startMove(zoomPanValues, sourceEvent, onPanZoomStart);
  zoomPanValues.mouseDrag.dragging = true;
  onDraggingChange(true);
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
    zoomPanValues.mouseDrag = null;

    if (sourceEvent.type === 'mousedown') {
      const mouseEvent = sourceEvent as MouseEvent;
      zoomPanValues.mouseDrag = {
        startX: mouseEvent.clientX,
        startY: mouseEvent.clientY,
        startTransform: event.transform,
        thresholdCrossed: false,
        lastMouseMove: null,
        moveStarted: false,
        dragging: false,
      };

      if (paneDragThreshold === 0) {
        startMouseDrag(zoomPanValues, mouseEvent, onDraggingChange, onPanZoomStart);
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
    const mouseDrag = zoomPanValues.mouseDrag;

    if (mouseDrag) {
      const isMouseMove = sourceEvent?.type === 'mousemove' && sourceEvent !== mouseDrag.lastMouseMove;

      if (isMouseMove) {
        mouseDrag.lastMouseMove = sourceEvent as MouseEvent;
      }

      if (isMouseMove && !mouseDrag.thresholdCrossed) {
        const { clientX, clientY } = sourceEvent as MouseEvent;
        const dx = clientX - mouseDrag.startX;
        const dy = clientY - mouseDrag.startY;
        // same check as d3-zoom's clickDistance, so a gesture is either a click or a drag
        mouseDrag.thresholdCrossed = dx * dx + dy * dy > paneDragThreshold * paneDragThreshold;
      }

      if (!mouseDrag.dragging) {
        if (!isMouseMove) {
          // e.g. wheel zoom or setViewport while the button is pressed: accept it as the new resting transform
          mouseDrag.startTransform = event.transform;
          if (!sourceEvent?.internal) {
            startMove(zoomPanValues, sourceEvent, onPanZoomStart);
          }
        } else if (mouseDrag.thresholdCrossed) {
          startMouseDrag(zoomPanValues, sourceEvent as MouseEvent, onDraggingChange, onPanZoomStart);
        } else {
          // below the threshold: undo the transform d3-zoom already stored, so it stays in sync with the viewport
          d3Selection.property('__zoom', mouseDrag.startTransform);
          return;
        }
      }
    }

    if (!sourceEvent?.sync) {
      onTransformChange([event.transform.x, event.transform.y, event.transform.k]);
    }

    if (onPanZoom && !sourceEvent?.internal && (!mouseDrag || mouseDrag.moveStarted)) {
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

    const mouseDrag = zoomPanValues.mouseDrag;
    zoomPanValues.mouseDrag = null;

    // with right-click panning the native contextmenu event is prevented by the pane, so we emit it here
    if (
      onPaneContextMenu &&
      isRightClickPan(panOnDrag, zoomPanValues.mouseButton ?? 0) &&
      !mouseDrag?.thresholdCrossed &&
      event.sourceEvent
    ) {
      onPaneContextMenu(event.sourceEvent as MouseEvent);
    }

    // nothing moved during the mouse gesture, so this was a click
    if (mouseDrag && !mouseDrag.moveStarted) {
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
