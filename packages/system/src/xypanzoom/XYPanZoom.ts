import { type ZoomTransform, zoom, zoomTransform } from 'd3-zoom';
import { select } from 'd3-selection';
import { interpolateZoom, interpolate } from 'd3-interpolate';

import {
  type CoordinateExtent,
  type Viewport,
  PanZoomTransformOptions,
  PanZoomUpdateOptions,
  PanZoomParams,
  PanZoomInstance,
} from '../types';
import { clamp, isNumeric } from '../utils';
import { getD3Transition, viewportToTransform, wheelDelta } from './utils';
import {
  createPanOnScrollHandler,
  createPanZoomEndHandler,
  createPanZoomHandler,
  createPanZoomStartHandler,
  createZoomOnScrollHandler,
} from './eventhandler';
import { createFilter } from './filter';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { transition } from 'd3-transition';

export type ZoomPanValues = {
  isZoomingOrPanning: boolean;
  usedRightMouseButton: boolean;
  prevViewport: Viewport;
  mouseButton: number;
  timerId: ReturnType<typeof setTimeout> | undefined;
  panScrollTimeout: ReturnType<typeof setTimeout> | undefined;
  isPanScrolling: boolean;
};

export function XYPanZoom({
  domNode,
  minZoom,
  maxZoom,
  translateExtent,
  viewport,
  onPanZoom,
  onPanZoomStart,
  onPanZoomEnd,
  onDraggingChange,
}: PanZoomParams): PanZoomInstance {
  const zoomPanValues: ZoomPanValues = {
    isZoomingOrPanning: false,
    usedRightMouseButton: false,
    prevViewport: { x: 0, y: 0, zoom: 0 },
    mouseButton: 0,
    timerId: undefined,
    panScrollTimeout: undefined,
    isPanScrolling: false,
  };
  const bbox = domNode.getBoundingClientRect();
  const d3ZoomInstance = zoom().scaleExtent([minZoom, maxZoom]).translateExtent(translateExtent);
  const d3Selection = select(domNode).call(d3ZoomInstance);

  setViewportConstrained(
    {
      x: viewport.x,
      y: viewport.y,
      zoom: clamp(viewport.zoom, minZoom, maxZoom),
    },
    [
      [0, 0],
      [bbox.width, bbox.height],
    ],
    translateExtent
  );

  const d3ZoomHandler = d3Selection.on('wheel.zoom')!;
  const d3DblClickZoomHandler = d3Selection.on('dblclick.zoom')!;
  d3ZoomInstance.wheelDelta(wheelDelta);

  function setTransform(transform: ZoomTransform, options?: PanZoomTransformOptions) {
    if (d3Selection) {
      return new Promise<boolean>((resolve) => {
        d3ZoomInstance?.interpolate(options?.interpolate === 'linear' ? interpolate : interpolateZoom).transform(
          getD3Transition(d3Selection, options?.duration, options?.ease, () => resolve(true)),
          transform
        );
      });
    }

    return Promise.resolve(false);
  }

  // public functions
  function update({
    noWheelClassName,
    noPanClassName,
    onPaneContextMenu,
    userSelectionActive,
    panOnScroll,
    panOnDrag,
    panOnScrollMode,
    panOnScrollSpeed,
    preventScrolling,
    zoomOnPinch,
    zoomOnScroll,
    zoomOnDoubleClick,
    zoomActivationKeyPressed,
    lib,
    onTransformChange,
    connectionInProgress,
    paneClickDistance,
    selectionOnDrag,
  }: PanZoomUpdateOptions) {
    if (userSelectionActive && !zoomPanValues.isZoomingOrPanning) {
      destroy();
    }

    const isPanOnScroll = panOnScroll && !zoomActivationKeyPressed && !userSelectionActive;

    d3ZoomInstance.clickDistance(
      selectionOnDrag ? Infinity : !isNumeric(paneClickDistance) || paneClickDistance < 0 ? 0 : paneClickDistance
    );

    const wheelHandler = isPanOnScroll
      ? createPanOnScrollHandler({
          zoomPanValues,
          noWheelClassName,
          d3Selection,
          d3Zoom: d3ZoomInstance,
          panOnScrollMode,
          panOnScrollSpeed,
          zoomOnPinch,
          onPanZoomStart,
          onPanZoom,
          onPanZoomEnd,
        })
      : createZoomOnScrollHandler({
          noWheelClassName,
          preventScrolling,
          d3ZoomHandler,
        });

    d3Selection.on('wheel.zoom', wheelHandler, { passive: false });

    if (!userSelectionActive) {
      // pan zoom start
      const startHandler = createPanZoomStartHandler({
        zoomPanValues,
        onDraggingChange,
        onPanZoomStart,
      });
      d3ZoomInstance.on('start', startHandler);

      // pan zoom
      const panZoomHandler = createPanZoomHandler({
        zoomPanValues,
        panOnDrag,
        onPaneContextMenu: !!onPaneContextMenu,
        onPanZoom,
        onTransformChange,
      });
      d3ZoomInstance.on('zoom', panZoomHandler);

      // pan zoom end
      const panZoomEndHandler = createPanZoomEndHandler({
        zoomPanValues,
        panOnDrag,
        panOnScroll,
        onPaneContextMenu,
        onPanZoomEnd,
        onDraggingChange,
      });
      d3ZoomInstance.on('end', panZoomEndHandler);
    }

    const filter = createFilter({
      zoomActivationKeyPressed,
      panOnDrag,
      zoomOnScroll,
      panOnScroll,
      zoomOnDoubleClick,
      zoomOnPinch,
      userSelectionActive,
      noPanClassName,
      noWheelClassName,
      lib,
      connectionInProgress,
    });
    d3ZoomInstance.filter(filter);

    /*
     * We cannot add zoomOnDoubleClick to the filter above because
     * double tapping on touch screens circumvents the filter and
     * dblclick.zoom is fired on the selection directly
     */
    if (zoomOnDoubleClick) {
      d3Selection.on('dblclick.zoom', d3DblClickZoomHandler);
    } else {
      d3Selection.on('dblclick.zoom', null);
    }
  }

  function destroy() {
    d3ZoomInstance.on('zoom', null);
  }

  async function setViewportConstrained(
    viewport: Viewport,
    extent: CoordinateExtent,
    translateExtent: CoordinateExtent
  ): Promise<ZoomTransform | undefined> {
    const nextTransform = viewportToTransform(viewport);
    const contrainedTransform = d3ZoomInstance?.constrain()(nextTransform, extent, translateExtent);

    if (contrainedTransform) {
      await setTransform(contrainedTransform);
    }

    return new Promise((resolve) => resolve(contrainedTransform));
  }

  async function setViewport(viewport: Viewport, options?: PanZoomTransformOptions) {
    const nextTransform = viewportToTransform(viewport);

    await setTransform(nextTransform, options);

    return new Promise<ZoomTransform>((resolve) => resolve(nextTransform));
  }

  function syncViewport(viewport: Viewport) {
    if (d3Selection) {
      const nextTransform = viewportToTransform(viewport);
      const currentTransform = d3Selection.property('__zoom');

      if (
        currentTransform.k !== viewport.zoom ||
        currentTransform.x !== viewport.x ||
        currentTransform.y !== viewport.y
      ) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        d3ZoomInstance?.transform(d3Selection, nextTransform, null, { sync: true });
      }
    }
  }

  function getViewport(): Viewport {
    const transform = d3Selection ? zoomTransform(d3Selection.node() as Element) : { x: 0, y: 0, k: 1 };
    return { x: transform.x, y: transform.y, zoom: transform.k };
  }

  function scaleTo(zoom: number, options?: PanZoomTransformOptions) {
    if (d3Selection) {
      return new Promise<boolean>((resolve) => {
        d3ZoomInstance?.interpolate(options?.interpolate === 'linear' ? interpolate : interpolateZoom).scaleTo(
          getD3Transition(d3Selection, options?.duration, options?.ease, () => resolve(true)),
          zoom
        );
      });
    }

    return Promise.resolve(false);
  }

  function scaleBy(factor: number, options?: PanZoomTransformOptions) {
    if (d3Selection) {
      return new Promise<boolean>((resolve) => {
        d3ZoomInstance?.interpolate(options?.interpolate === 'linear' ? interpolate : interpolateZoom).scaleBy(
          getD3Transition(d3Selection, options?.duration, options?.ease, () => resolve(true)),
          factor
        );
      });
    }

    return Promise.resolve(false);
  }

  function setScaleExtent(scaleExtent: [number, number]) {
    d3ZoomInstance?.scaleExtent(scaleExtent);
  }

  function setTranslateExtent(translateExtent: CoordinateExtent) {
    d3ZoomInstance?.translateExtent(translateExtent);
  }

  function setClickDistance(distance: number) {
    const validDistance = !isNumeric(distance) || distance < 0 ? 0 : distance;
    d3ZoomInstance?.clickDistance(validDistance);
  }

  return {
    update,
    destroy,
    setViewport,
    setViewportConstrained,
    getViewport,
    scaleTo,
    scaleBy,
    setScaleExtent,
    setTranslateExtent,
    syncViewport,
    setClickDistance,
  };
}
