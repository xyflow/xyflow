/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import type { D3ZoomEvent } from 'd3-zoom';

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
import type { ZoomPanValues } from './XYPanZoom';

const wheelGestureTimeout = 150;

type PendingPanZoomEnd = {
  callback: OnPanZoom | undefined;
  deadline: number;
  event: MouseEvent | TouchEvent | null;
  viewport: ReturnType<typeof transformToViewport>;
};

const pendingPanZoomEnds = new WeakMap<ZoomPanValues, PendingPanZoomEnd>();

export type PanOnScrollParams = {
  zoomPanValues: ZoomPanValues;
  domNode: Element;
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
  onDraggingChange: OnDraggingChange;
  onPanZoomStart?: OnPanZoom;
};

export type PanZoomParams = {
  zoomPanValues: ZoomPanValues;
  panOnDrag: boolean | number[];
  onPaneContextMenu: boolean;
  onTransformChange: OnTransformChange;
  onPanZoom?: OnPanZoom;
};

export type PanZoomEndParams = {
  zoomPanValues: ZoomPanValues;
  panOnDrag: boolean | number[];
  panOnScroll: boolean;
  onDraggingChange: (isDragging: boolean) => void;
  onPanZoomEnd?: OnPanZoom;
  onPaneContextMenu?: (event: any) => void;
};

export function createPanOnScrollHandler({
  zoomPanValues,
  domNode,
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
  let pinchPointerOrigin: [number, number] | undefined;
  let pinchPointerOriginDeadline = 0;
  let panScrollEndDeadline = 0;
  let panScrollEndEvent: MouseEvent | TouchEvent | null = null;
  let panScrollEndViewport: ReturnType<typeof transformToViewport> | undefined;

  const flushPanScrollEnd = () => {
    const remaining = panScrollEndDeadline - Date.now();

    if (remaining > 0) {
      zoomPanValues.panScrollTimeout = setTimeout(flushPanScrollEnd, remaining);
      return;
    }

    zoomPanValues.panScrollTimeout = undefined;
    const event = panScrollEndEvent;
    const viewport = panScrollEndViewport;
    panScrollEndEvent = null;
    panScrollEndViewport = undefined;

    if (viewport) {
      onPanZoomEnd?.(event, viewport);
    }

    zoomPanValues.isPanScrolling = false;
  };

  return (event: any) => {
    if (isWrappedWithClass(event, noWheelClassName)) {
      if (event.ctrlKey) {
        event.preventDefault(); // stop native page zoom for pinch zooming
      }
      return false;
    }
    event.preventDefault();
    event.stopImmediatePropagation();

    const currentZoom = d3Selection.property('__zoom').k || 1;

    // macos sets ctrlKey=true for pinch gesture on a trackpad
    if (event.ctrlKey && zoomOnPinch) {
      const now = Date.now();
      if (!pinchPointerOrigin || now >= pinchPointerOriginDeadline) {
        const rect = domNode.getBoundingClientRect();
        pinchPointerOrigin = [rect.left + domNode.clientLeft, rect.top + domNode.clientTop];
      }
      pinchPointerOriginDeadline = now + wheelGestureTimeout;

      const point = [event.clientX - pinchPointerOrigin[0], event.clientY - pinchPointerOrigin[1]];
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

    const nextViewport = transformToViewport(d3Selection.property('__zoom'));

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

    const scheduleEnd = panScrollEndEvent === null;
    panScrollEndDeadline = Date.now() + wheelGestureTimeout;
    panScrollEndEvent = event;
    panScrollEndViewport = nextViewport;

    if (scheduleEnd) {
      if (zoomPanValues.panScrollTimeout !== undefined) {
        clearTimeout(zoomPanValues.panScrollTimeout);
      }
      zoomPanValues.panScrollTimeout = setTimeout(flushPanScrollEnd, wheelGestureTimeout);
    }
  };
}

export function createZoomOnScrollHandler({ noWheelClassName, preventScrolling, d3ZoomHandler }: ZoomOnScrollParams) {
  return function (this: Element, event: any, d: unknown) {
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

export function createPanZoomStartHandler({ zoomPanValues, onDraggingChange, onPanZoomStart }: PanZoomStartParams) {
  return (event: D3ZoomEvent<HTMLDivElement, any>) => {
    if (event.sourceEvent?.internal) {
      return;
    }

    const viewport = transformToViewport(event.transform);

    // we need to remember it here, because it's always 0 in the "zoom" event
    zoomPanValues.mouseButton = event.sourceEvent?.button || 0;
    zoomPanValues.isZoomingOrPanning = true;
    zoomPanValues.prevViewport = viewport;

    if (event.sourceEvent?.type === 'mousedown') {
      onDraggingChange(true);
    }

    if (onPanZoomStart) {
      onPanZoomStart?.(event.sourceEvent as MouseEvent | TouchEvent, viewport);
    }
  };
}

export function createPanZoomHandler({
  zoomPanValues,
  panOnDrag,
  onPaneContextMenu,
  onTransformChange,
  onPanZoom,
}: PanZoomParams) {
  return (event: D3ZoomEvent<HTMLDivElement, any>) => {
    zoomPanValues.usedRightMouseButton = !!(
      onPaneContextMenu && isRightClickPan(panOnDrag, zoomPanValues.mouseButton ?? 0)
    );

    if (!event.sourceEvent?.sync) {
      onTransformChange([event.transform.x, event.transform.y, event.transform.k]);
    }

    if (onPanZoom && !event.sourceEvent?.internal) {
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
  const pendingPanZoomEnd = getPendingPanZoomEnd(zoomPanValues);

  return (event: D3ZoomEvent<HTMLDivElement, any>) => {
    if (event.sourceEvent?.internal) {
      return;
    }

    zoomPanValues.isZoomingOrPanning = false;

    if (
      onPaneContextMenu &&
      isRightClickPan(panOnDrag, zoomPanValues.mouseButton ?? 0) &&
      !zoomPanValues.usedRightMouseButton &&
      event.sourceEvent
    ) {
      onPaneContextMenu(event.sourceEvent);
    }
    zoomPanValues.usedRightMouseButton = false;

    onDraggingChange(false);

    if (onPanZoomEnd) {
      const viewport = transformToViewport(event.transform);
      zoomPanValues.prevViewport = viewport;

      if (panOnScroll) {
        schedulePanZoomEnd(
          zoomPanValues,
          pendingPanZoomEnd,
          onPanZoomEnd,
          event.sourceEvent as MouseEvent | TouchEvent,
          viewport
        );
      } else {
        clearTimeout(zoomPanValues.timerId);
        pendingPanZoomEnd.callback = undefined;
        zoomPanValues.timerId = setTimeout(() => {
          zoomPanValues.timerId = undefined;
          onPanZoomEnd(event.sourceEvent as MouseEvent | TouchEvent, viewport);
        }, 0);
      }
    }
  };
}

function schedulePanZoomEnd(
  zoomPanValues: ZoomPanValues,
  pending: PendingPanZoomEnd,
  callback: OnPanZoom,
  event: MouseEvent | TouchEvent,
  viewport: ReturnType<typeof transformToViewport>
) {
  if (zoomPanValues.timerId !== undefined && pending.callback === undefined) {
    clearTimeout(zoomPanValues.timerId);
    zoomPanValues.timerId = undefined;
  }

  pending.callback = callback;
  pending.deadline = Date.now() + wheelGestureTimeout;
  pending.event = event;
  pending.viewport = viewport;

  if (zoomPanValues.timerId === undefined) {
    zoomPanValues.timerId = setTimeout(() => flushPanZoomEnd(zoomPanValues, pending), wheelGestureTimeout);
  }
}

function flushPanZoomEnd(zoomPanValues: ZoomPanValues, pending: PendingPanZoomEnd) {
  const remaining = pending.deadline - Date.now();

  if (remaining > 0) {
    zoomPanValues.timerId = setTimeout(() => flushPanZoomEnd(zoomPanValues, pending), remaining);
    return;
  }

  zoomPanValues.timerId = undefined;
  const callback = pending.callback;
  const event = pending.event;
  const viewport = pending.viewport;
  pending.callback = undefined;
  pending.event = null;
  callback?.(event, viewport);
}

function getPendingPanZoomEnd(zoomPanValues: ZoomPanValues): PendingPanZoomEnd {
  let pending = pendingPanZoomEnds.get(zoomPanValues);

  if (!pending) {
    pending = {
      callback: undefined,
      deadline: 0,
      event: null,
      viewport: { x: 0, y: 0, zoom: 0 },
    };
    pendingPanZoomEnds.set(zoomPanValues, pending);
  }

  return pending;
}
