import { type ZoomTransform, zoom, zoomTransform } from 'd3-zoom';
import { select } from 'd3-selection';
import {
  type CoordinateExtent,
  type Viewport,
  PanZoomTransformOptions,
  PanZoomUpdateOptions,
  PanZoomParams,
  PanZoomInstance,
} from '@reactflow/system';

import { clamp } from '../utils';
import FunctionRunner from '../function-runner';
import { getD3Transition, viewportToTransform } from './utils';
import {
  createPanOnScrollHandler,
  createPanZoomEndHandler,
  createPanZoomHandler,
  createPanZoomStartHandler,
  createZoomOnScrollHandler,
} from './eventhandler';
import { createFilter } from './filter';

export type ZoomPanValues = {
  isZoomingOrPanning: boolean;
  usedRightMouseButton: boolean;
  prevViewport: Viewport;
  mouseButton: number;
  timerId: ReturnType<typeof setTimeout> | undefined;
};

export function XYPanZoom({
  domNode,
  minZoom,
  maxZoom,
  translateExtent,
  viewport,
  onTransformChange,
  onDraggingChange,
}: PanZoomParams): PanZoomInstance {
  const zoomPanValues: ZoomPanValues = {
    isZoomingOrPanning: false,
    usedRightMouseButton: false,
    prevViewport: { x: 0, y: 0, zoom: 0 },
    mouseButton: 0,
    timerId: undefined,
  };
  const funRun = FunctionRunner();
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

  const d3ZoomHandler = d3Selection.on('wheel.zoom') || null;

  function setTransform(transform: ZoomTransform, options?: PanZoomTransformOptions) {
    if (d3Selection) {
      d3ZoomInstance?.transform(getD3Transition(d3Selection, options?.duration), transform);
    }
  }

  // public functions
  function update({
    noWheelClassName,
    noPanClassName,
    onPanZoom,
    onPanZoomStart,
    onPanZoomEnd,
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
  }: PanZoomUpdateOptions) {
    funRun.restart();
    // wheel scroll / pan handling
    funRun.onChange(() => {
      if (!d3ZoomInstance || !d3Selection) {
        return;
      }

      if (panOnScroll && !zoomActivationKeyPressed && !userSelectionActive) {
        const panOnScrollHandler = createPanOnScrollHandler({
          noWheelClassName,
          d3Selection,
          d3Zoom: d3ZoomInstance,
          panOnScrollMode,
          panOnScrollSpeed,
          zoomOnPinch,
        });
        d3Selection.on('wheel.zoom', panOnScrollHandler, { passive: false });
      } else if (d3ZoomHandler !== null) {
        const zoomOnScrollHandler = createZoomOnScrollHandler({
          noWheelClassName,
          preventScrolling,
          d3ZoomHandler,
        });
        d3Selection.on('wheel.zoom', zoomOnScrollHandler, { passive: false });
      }
    }, [
      userSelectionActive,
      panOnScroll,
      panOnScrollMode,
      d3Selection,
      d3ZoomInstance,
      d3ZoomHandler,
      zoomActivationKeyPressed,
      zoomOnPinch,
      preventScrolling,
      noWheelClassName,
    ]);

    // pan zoom start
    funRun.onChange(() => {
      const startHandler = createPanZoomStartHandler({
        zoomPanValues,
        onDraggingChange,
        onPanZoomStart,
      });
      d3ZoomInstance?.on('start', startHandler);
    }, [d3ZoomInstance, onPanZoomStart]);

    // pan zoom
    funRun.onChange(() => {
      if (userSelectionActive && !zoomPanValues.isZoomingOrPanning) {
        d3ZoomInstance?.on('zoom', null);
      } else if (!userSelectionActive) {
        const panZoomHandler = createPanZoomHandler({
          zoomPanValues,
          panOnDrag,
          onPaneContextMenu: !!onPaneContextMenu,
          onPanZoom,
          onTransformChange,
        });
        d3ZoomInstance?.on('zoom', panZoomHandler);
      }
    }, [userSelectionActive, d3ZoomInstance, onPanZoom, panOnDrag, onPaneContextMenu]);

    // pan zoom end
    funRun.onChange(() => {
      const panZoomEndHandler = createPanZoomEndHandler({
        zoomPanValues,
        panOnDrag,
        panOnScroll,
        onPaneContextMenu,
        onPanZoomEnd,
        onDraggingChange,
      });
      d3ZoomInstance?.on('end', panZoomEndHandler);
    }, [d3ZoomInstance, panOnScroll, panOnDrag, onPanZoomEnd, onPaneContextMenu]);

    // apply filter
    funRun.onChange(() => {
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
      });
      d3ZoomInstance?.filter(filter);
    }, [
      userSelectionActive,
      d3ZoomInstance,
      zoomOnScroll,
      zoomOnPinch,
      panOnScroll,
      zoomOnDoubleClick,
      panOnDrag,
      zoomActivationKeyPressed,
    ]);
  }

  function setViewportConstrained(
    viewport: Viewport,
    extent: CoordinateExtent,
    translateExtent: CoordinateExtent
  ): ZoomTransform | undefined {
    const nextTransform = viewportToTransform(viewport);
    const contrainedTransform = d3ZoomInstance?.constrain()(nextTransform, extent, translateExtent);

    if (contrainedTransform) {
      setTransform(contrainedTransform);
    }

    return contrainedTransform;
  }

  function setViewport(viewport: Viewport, options?: PanZoomTransformOptions) {
    const nextTransform = viewportToTransform(viewport);

    setTransform(nextTransform, options);

    return nextTransform;
  }

  function getViewport(): Viewport {
    const transform = d3Selection ? zoomTransform(d3Selection.node() as Element) : { x: 0, y: 0, k: 1 };
    return { x: transform.x, y: transform.y, zoom: transform.k };
  }

  function scaleTo(zoom: number, options?: PanZoomTransformOptions) {
    if (d3Selection) {
      d3ZoomInstance?.scaleTo(getD3Transition(d3Selection, options?.duration), zoom);
    }
  }

  function scaleBy(factor: number, options?: PanZoomTransformOptions) {
    if (d3Selection) {
      d3ZoomInstance?.scaleBy(getD3Transition(d3Selection, options?.duration), factor);
    }
  }

  function setScaleExtent(scaleExtent: [number, number]) {
    d3ZoomInstance?.scaleExtent(scaleExtent);
  }

  function setTranslateExtent(translateExtent: CoordinateExtent) {
    d3ZoomInstance?.translateExtent(translateExtent);
  }

  return {
    update,
    setViewport,
    setViewportConstrained,
    getViewport,
    scaleTo,
    scaleBy,
    setScaleExtent,
    setTranslateExtent,
  };
}
