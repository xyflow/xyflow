import { D3ZoomEvent, zoom, zoomIdentity } from 'd3-zoom';
import { select, pointer } from 'd3-selection';
import {
  PanOnScrollMode,
  type CoordinateExtent,
  type Transform,
  type Viewport,
  D3ZoomInstance,
  D3SelectionInstance,
  D3ZoomHandler,
  OnMoveStart,
  OnMove,
  OnMoveEnd,
} from '@reactflow/system';

import { clamp } from './utils';

const viewChanged = (prevViewport: Viewport, eventViewport: any): boolean =>
  prevViewport.x !== eventViewport.x || prevViewport.y !== eventViewport.y || prevViewport.zoom !== eventViewport.k;

const eventToFlowTransform = (eventViewport: any): Viewport => ({
  x: eventViewport.x,
  y: eventViewport.y,
  zoom: eventViewport.k,
});

const isWrappedWithClass = (event: any, className: string | undefined) => event.target.closest(`.${className}`);

const isRightClickPan = (panOnDrag: boolean | number[], usedButton: number) =>
  usedButton === 2 && Array.isArray(panOnDrag) && panOnDrag.includes(2);

export type InitPanZoomParams = {
  domNode: Element;
  minZoom: number;
  maxZoom: number;
  defaultViewport: Viewport;
  translateExtent: CoordinateExtent;
};

export function initPanZoom({ domNode, minZoom, maxZoom, translateExtent, defaultViewport }: InitPanZoomParams): {
  d3ZoomInstance: D3ZoomInstance;
  d3Selection: D3SelectionInstance;
  d3ZoomHandler: D3ZoomHandler | null;
  transform: Transform;
} {
  const bbox = domNode.getBoundingClientRect();
  const d3ZoomInstance = zoom().scaleExtent([minZoom, maxZoom]).translateExtent(translateExtent);
  const d3Selection = select(domNode).call(d3ZoomInstance);
  const updatedTransform = zoomIdentity
    .translate(defaultViewport.x, defaultViewport.y)
    .scale(clamp(defaultViewport.zoom, minZoom, maxZoom));
  const extent: CoordinateExtent = [
    [0, 0],
    [bbox.width, bbox.height],
  ];

  const constrainedTransform = d3ZoomInstance.constrain()(updatedTransform, extent, translateExtent);
  d3ZoomInstance.transform(d3Selection, constrainedTransform);
  const d3ZoomHandler = d3Selection.on('wheel.zoom') || null;

  return {
    d3ZoomInstance,
    d3Selection,
    d3ZoomHandler,
    // we need to pass transform because zoom handler is not registered when we set the initial transform
    transform: [constrainedTransform.x, constrainedTransform.y, constrainedTransform.k],
  };
}

type PanOnScrollParams = {
  noWheelClassName: string;
  d3Selection: D3SelectionInstance;
  d3Zoom: D3ZoomInstance;
  panOnScrollMode: PanOnScrollMode;
  panOnScrollSpeed: number;
  zoomOnPinch: boolean;
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

type ZoomOnScrollParams = {
  noWheelClassName: string;
  preventScrolling: boolean;
  d3ZoomHandler: D3ZoomHandler;
};

export function createZoomOnScrollHandler({ noWheelClassName, preventScrolling, d3ZoomHandler }: ZoomOnScrollParams) {
  return function (this: Element, event: any, d: unknown) {
    if (!preventScrolling || isWrappedWithClass(event, noWheelClassName)) {
      return null;
    }

    event.preventDefault();

    d3ZoomHandler.call(this, event, d);
  };
}

export type ZoomPanValues = {
  isZoomingOrPanning: boolean;
  zoomedWithRightMouseButton: boolean;
  prevTransform: Viewport;
  mouseButton: number;
  timerId: ReturnType<typeof setTimeout> | undefined;
};

export type PanZoomStartParams = {
  zoomPanValues: ZoomPanValues;
  setDragging: (isDragging: boolean) => void;
  onMoveStart?: OnMoveStart;
  onViewportChangeStart?: (viewport: Viewport) => void;
};

export function createPanZoomStartHandler({
  zoomPanValues,
  setDragging,
  onMoveStart,
  onViewportChangeStart,
}: PanZoomStartParams) {
  return (event: D3ZoomEvent<HTMLDivElement, any>) => {
    // we need to remember it here, because it's always 0 in the "zoom" event
    zoomPanValues.mouseButton = event.sourceEvent?.button || 0;

    zoomPanValues.isZoomingOrPanning = true;

    if (event.sourceEvent?.type === 'mousedown') {
      setDragging(true);
    }

    if (onMoveStart || onViewportChangeStart) {
      const flowTransform = eventToFlowTransform(event.transform);
      zoomPanValues.prevTransform = flowTransform;

      onViewportChangeStart?.(flowTransform);
      onMoveStart?.(event.sourceEvent as MouseEvent | TouchEvent, flowTransform);
    }
  };
}

export type PanZoomParams = {
  zoomPanValues: ZoomPanValues;
  panOnDrag: boolean | number[];
  onPaneContextMenu: boolean;
  setTransform: (transform: Transform) => void;
  onMove?: OnMove;
  onViewportChange?: (viewport: Viewport) => void;
};

export function createPanZoomHandler({
  zoomPanValues,
  panOnDrag,
  onPaneContextMenu,
  setTransform,
  onMove,
  onViewportChange,
}: PanZoomParams) {
  return (event: D3ZoomEvent<HTMLDivElement, any>) => {
    zoomPanValues.zoomedWithRightMouseButton = !!(
      onPaneContextMenu && isRightClickPan(panOnDrag, zoomPanValues.mouseButton ?? 0)
    );

    setTransform([event.transform.x, event.transform.y, event.transform.k]);

    if (onMove || onViewportChange) {
      const flowTransform = eventToFlowTransform(event.transform);

      onViewportChange?.(flowTransform);
      onMove?.(event.sourceEvent as MouseEvent | TouchEvent, flowTransform);
    }
  };
}

export type PanZoomEndParams = {
  zoomPanValues: ZoomPanValues;
  panOnDrag: boolean | number[];
  panOnScroll: boolean;
  setDragging: (isDragging: boolean) => void;
  onMoveEnd?: OnMoveEnd;
  onViewportChangeEnd?: (viewport: Viewport) => void;
  onPaneContextMenu?: (event: any) => void;
};

export function createPanZoomEndHandler({
  zoomPanValues,
  panOnDrag,
  panOnScroll,
  setDragging,
  onMoveEnd,
  onViewportChangeEnd,
  onPaneContextMenu,
}: PanZoomEndParams) {
  return (event: D3ZoomEvent<HTMLDivElement, any>) => {
    zoomPanValues.isZoomingOrPanning = false;

    if (
      onPaneContextMenu &&
      isRightClickPan(panOnDrag, zoomPanValues.mouseButton ?? 0) &&
      !zoomPanValues.zoomedWithRightMouseButton &&
      event.sourceEvent
    ) {
      onPaneContextMenu(event.sourceEvent);
    }
    zoomPanValues.zoomedWithRightMouseButton = false;

    setDragging(false);

    if ((onMoveEnd || onViewportChangeEnd) && viewChanged(zoomPanValues.prevTransform, event.transform)) {
      const flowTransform = eventToFlowTransform(event.transform);
      zoomPanValues.prevTransform = flowTransform;

      clearTimeout(zoomPanValues.timerId);
      zoomPanValues.timerId = setTimeout(
        () => {
          onViewportChangeEnd?.(flowTransform);
          onMoveEnd?.(event.sourceEvent as MouseEvent | TouchEvent, flowTransform);
        },
        panOnScroll ? 150 : 0
      );
    }
  };
}

type FilterParams = {
  zoomActivationKeyPressed: boolean;
  zoomOnScroll: boolean;
  zoomOnPinch: boolean;
  panOnDrag: boolean | number[];
  panOnScroll: boolean;
  zoomOnDoubleClick: boolean;
  userSelectionActive: boolean;
  noWheelClassName: string;
  noPanClassName: string;
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
}: FilterParams) {
  return (event: any): boolean => {
    const zoomScroll = zoomActivationKeyPressed || zoomOnScroll;
    const pinchZoom = zoomOnPinch && event.ctrlKey;

    if (
      event.button === 1 &&
      event.type === 'mousedown' &&
      (isWrappedWithClass(event, 'react-flow__node') || isWrappedWithClass(event, 'react-flow__edge'))
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

    // if zoom on double click is disabled, we prevent the double click event
    if (!zoomOnDoubleClick && event.type === 'dblclick') {
      return false;
    }

    // if the target element is inside an element with the nowheel class, we prevent zooming
    if (isWrappedWithClass(event, noWheelClassName) && event.type === 'wheel') {
      return false;
    }

    // if the target element is inside an element with the nopan class, we prevent panning
    if (isWrappedWithClass(event, noPanClassName) && event.type !== 'wheel') {
      return false;
    }

    if (!zoomOnPinch && event.ctrlKey && event.type === 'wheel') {
      return false;
    }

    // when there is no scroll handling enabled, we prevent all wheel events
    if (!zoomScroll && !panOnScroll && !pinchZoom && event.type === 'wheel') {
      return false;
    }

    // if the pane is not movable, we prevent dragging it with mousestart or touchstart
    if (!panOnDrag && (event.type === 'mousedown' || event.type === 'touchstart')) {
      return false;
    }

    // if the pane is only movable using allowed clicks
    if (
      Array.isArray(panOnDrag) &&
      !panOnDrag.includes(event.button) &&
      (event.type === 'mousedown' || event.type === 'touchstart')
    ) {
      return false;
    }

    // We only allow right clicks if pan on drag is set to right click
    const buttonAllowed =
      (Array.isArray(panOnDrag) && panOnDrag.includes(event.button)) || !event.button || event.button <= 1;

    // default filter for d3-zoom
    return (!event.ctrlKey || event.type === 'wheel') && buttonAllowed;
  };
}
