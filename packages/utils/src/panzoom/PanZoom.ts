import { type ZoomTransform, zoom } from 'd3-zoom';
import { select } from 'd3-selection';
import {
  type CoordinateExtent,
  type Transform,
  type Viewport,
  D3ZoomInstance,
  D3SelectionInstance,
  D3ZoomHandler,
  PanZoomTransformOptions,
  PanZoomUpdateOptions,
  InitPanZoomParams,
  OnDraggingChange,
  OnTransformChange,
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

export function PanZoom(): PanZoomInstance {
  const zoomPanValues: ZoomPanValues = {
    isZoomingOrPanning: false,
    usedRightMouseButton: false,
    prevViewport: { x: 0, y: 0, zoom: 0 },
    mouseButton: 0,
    timerId: undefined,
  };

  let d3Selection: D3SelectionInstance | null = null;
  let d3ZoomHandler: D3ZoomHandler | null = null;
  let d3ZoomInstance: D3ZoomInstance | null = null;
  let onDraggingChange: OnDraggingChange;
  let onTransformChange: OnTransformChange;

  const funRun = FunctionRunner();

  function init({
    domNode,
    minZoom,
    maxZoom,
    translateExtent,
    viewport,
    onTransformChange: _onTransformChange,
    onDraggingChange: _onDraggingChange,
  }: InitPanZoomParams) {
    const bbox = domNode.getBoundingClientRect();
    d3ZoomInstance = zoom().scaleExtent([minZoom, maxZoom]).translateExtent(translateExtent);
    d3Selection = select(domNode).call(d3ZoomInstance);

    const extent: CoordinateExtent = [
      [0, 0],
      [bbox.width, bbox.height],
    ];

    const constrainedTransform = setTransformXYZConstrained(
      {
        x: viewport.x,
        y: viewport.y,
        zoom: clamp(viewport.zoom, minZoom, maxZoom),
      },
      extent,
      translateExtent
    );

    d3ZoomHandler = d3Selection.on('wheel.zoom') || null;

    onTransformChange = _onTransformChange;
    onDraggingChange = _onDraggingChange;

    return {
      transform: [
        constrainedTransform?.x ?? 0,
        constrainedTransform?.y ?? 0,
        constrainedTransform?.k ?? 1,
      ] as Transform,
    };
  }

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

  function setTransformXYZConstrained(
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

  function setTransformXYZ(viewport: Viewport, options?: PanZoomTransformOptions) {
    const nextTransform = viewportToTransform(viewport);

    setTransform(nextTransform, options);

    return nextTransform;
  }

  function setTransform(_transform: ZoomTransform, options?: PanZoomTransformOptions) {
    if (d3Selection) {
      d3ZoomInstance?.transform(getD3Transition(d3Selection, options?.duration), _transform);
    }
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
    init,
    update,
    setTransform,
    setTransformXYZ,
    setTransformXYZConstrained,
    scaleTo,
    scaleBy,
    setScaleExtent,
    setTranslateExtent,
  };
}
