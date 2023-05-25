import type { D3ZoomEvent } from 'd3-zoom';
import { pointer } from 'd3-selection';
import {
  PanOnScrollMode,
  D3SelectionInstance,
  D3ZoomHandler,
  D3ZoomInstance,
  OnPanZoom,
  Viewport,
  OnDraggingChange,
  OnTransformChange,
} from '@reactflow/system';

import { isRightClickPan, isWrappedWithClass, transformToViewport, viewChanged } from './utils';

export type ZoomPanValues = {
  isZoomingOrPanning: boolean;
  usedRightMouseButton: boolean;
  prevViewport: Viewport;
  mouseButton: number;
  timerId: ReturnType<typeof setTimeout> | undefined;
};

export type PanOnScrollParams = {
  noWheelClassName: string;
  d3Selection: D3SelectionInstance;
  d3Zoom: D3ZoomInstance;
  panOnScrollMode: PanOnScrollMode;
  panOnScrollSpeed: number;
  zoomOnPinch: boolean;
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
  noWheelClassName,
  d3Selection,
  d3Zoom,
  panOnScrollMode,
  panOnScrollSpeed,
  zoomOnPinch,
}: PanOnScrollParams) {
  return (event: any) => {
    if (isWrappedWithClass(event, noWheelClassName)) {
      return false;
    }
    event.preventDefault();
    event.stopImmediatePropagation();

    const currentZoom = d3Selection.property('__zoom').k || 1;

    if (event.ctrlKey && zoomOnPinch) {
      const point = pointer(event);
      // taken from https://github.com/d3/d3-zoom/blob/master/src/zoom.js
      const pinchDelta = -event.deltaY * (event.deltaMode === 1 ? 0.05 : event.deltaMode ? 1 : 0.002) * 10;
      const zoom = currentZoom * Math.pow(2, pinchDelta);
      d3Zoom.scaleTo(d3Selection, zoom, point);

      return;
    }

    // increase scroll speed in firefox
    // firefox: deltaMode === 1; chrome: deltaMode === 0
    const deltaNormalize = event.deltaMode === 1 ? 20 : 1;
    const deltaX = panOnScrollMode === PanOnScrollMode.Vertical ? 0 : event.deltaX * deltaNormalize;
    const deltaY = panOnScrollMode === PanOnScrollMode.Horizontal ? 0 : event.deltaY * deltaNormalize;

    d3Zoom.translateBy(
      d3Selection,
      -(deltaX / currentZoom) * panOnScrollSpeed,
      -(deltaY / currentZoom) * panOnScrollSpeed
    );
  };
}

export function createZoomOnScrollHandler({ noWheelClassName, preventScrolling, d3ZoomHandler }: ZoomOnScrollParams) {
  return function (this: Element, event: any, d: unknown) {
    if (!preventScrolling || isWrappedWithClass(event, noWheelClassName)) {
      return null;
    }

    event.preventDefault();

    d3ZoomHandler.call(this, event, d);
  };
}

export function createPanZoomStartHandler({ zoomPanValues, onDraggingChange, onPanZoomStart }: PanZoomStartParams) {
  return (event: D3ZoomEvent<HTMLDivElement, any>) => {
    // we need to remember it here, because it's always 0 in the "zoom" event
    zoomPanValues.mouseButton = event.sourceEvent?.button || 0;

    zoomPanValues.isZoomingOrPanning = true;

    if (event.sourceEvent?.type === 'mousedown') {
      onDraggingChange(true);
    }

    if (onPanZoomStart) {
      const viewport = transformToViewport(event.transform);
      zoomPanValues.prevViewport = viewport;

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

    onTransformChange([event.transform.x, event.transform.y, event.transform.k]);

    if (onPanZoom) {
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

    if (onPanZoomEnd && viewChanged(zoomPanValues.prevViewport, event.transform)) {
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
