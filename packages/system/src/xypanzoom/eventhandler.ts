/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import type { D3ZoomEvent } from 'd3-zoom';
import { pointer } from 'd3-selection';

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
import { ZoomPanValues } from './XYPanZoom';

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

    const nextViewport = transformToViewport(d3Selection.property('__zoom'));

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

      zoomPanValues.panScrollTimeout = setTimeout(() => {
        onPanZoomEnd?.(event, nextViewport);

        zoomPanValues.isPanScrolling = false;
      }, 150);
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

      clearTimeout(zoomPanValues.timerId);
      zoomPanValues.timerId = setTimeout(
        () => {
          onPanZoomEnd?.(event.sourceEvent as MouseEvent | TouchEvent, viewport);
        },
        // we need a setTimeout for panOnScroll to supress multiple end events fired during scroll
        panOnScroll ? 150 : 0
      );
    }
  };
}
