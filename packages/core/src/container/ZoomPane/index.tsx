/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef } from 'react';
import { zoom, zoomIdentity } from 'd3-zoom';
import type { D3ZoomEvent } from 'd3-zoom';
import { select, pointer } from 'd3-selection';
import shallow from 'zustand/shallow';

import { clamp } from '../../utils';
import useKeyPress from '../../hooks/useKeyPress';
import useResizeHandler from '../../hooks/useResizeHandler';
import { useStore, useStoreApi } from '../../hooks/useStore';
import { containerStyle } from '../../styles';
import type { FlowRendererProps } from '../FlowRenderer';
import { PanOnScrollMode } from '../../types';
import type { Viewport, ReactFlowState } from '../../types';

type ZoomPaneProps = Omit<
  FlowRendererProps,
  'deleteKeyCode' | 'selectionKeyCode' | 'multiSelectionKeyCode' | 'noDragClassName' | 'disableKeyboardA11y'
> & { selectionKeyPressed: boolean };

const viewChanged = (prevViewport: Viewport, eventViewport: any): boolean =>
  prevViewport.x !== eventViewport.x || prevViewport.y !== eventViewport.y || prevViewport.zoom !== eventViewport.k;

const eventToFlowTransform = (eventViewport: any): Viewport => ({
  x: eventViewport.x,
  y: eventViewport.y,
  zoom: eventViewport.k,
});

const isWrappedWithClass = (event: any, className: string | undefined) => event.target.closest(`.${className}`);

const selector = (s: ReactFlowState) => ({
  d3Zoom: s.d3Zoom,
  d3Selection: s.d3Selection,
  d3ZoomHandler: s.d3ZoomHandler,
});

const ZoomPane = ({
  onMove,
  onMoveStart,
  onMoveEnd,
  zoomOnScroll = true,
  zoomOnPinch = true,
  panOnScroll = false,
  panOnScrollSpeed = 0.5,
  panOnScrollMode = PanOnScrollMode.Free,
  zoomOnDoubleClick = true,
  selectionKeyPressed,
  elementsSelectable,
  panOnDrag = true,
  defaultViewport,
  translateExtent,
  minZoom,
  maxZoom,
  zoomActivationKeyCode,
  preventScrolling = true,
  children,
  noWheelClassName,
  noPanClassName,
}: ZoomPaneProps) => {
  const timerId = useRef<ReturnType<typeof setTimeout>>();
  const store = useStoreApi();
  const isZoomingOrPanning = useRef(false);
  const zoomPane = useRef<HTMLDivElement>(null);
  const prevTransform = useRef<Viewport>({ x: 0, y: 0, zoom: 0 });
  const { d3Zoom, d3Selection, d3ZoomHandler } = useStore(selector, shallow);
  const zoomActivationKeyPressed = useKeyPress(zoomActivationKeyCode);

  useResizeHandler(zoomPane);

  useEffect(() => {
    if (zoomPane.current) {
      const d3ZoomInstance = zoom().scaleExtent([minZoom, maxZoom]).translateExtent(translateExtent);
      const selection = select(zoomPane.current as Element).call(d3ZoomInstance);

      const clampedX = clamp(defaultViewport.x, translateExtent[0][0], translateExtent[1][0]);
      const clampedY = clamp(defaultViewport.y, translateExtent[0][1], translateExtent[1][1]);
      const clampedZoom = clamp(defaultViewport.zoom, minZoom, maxZoom);
      const updatedTransform = zoomIdentity.translate(clampedX, clampedY).scale(clampedZoom);

      d3ZoomInstance.transform(selection, updatedTransform);

      store.setState({
        d3Zoom: d3ZoomInstance,
        d3Selection: selection,
        d3ZoomHandler: selection.on('wheel.zoom'),
        // we need to pass transform because zoom handler is not registered when we set the initial transform
        transform: [clampedX, clampedY, clampedZoom],
        domNode: zoomPane.current.closest('.react-flow') as HTMLDivElement,
      });
    }
  }, []);

  useEffect(() => {
    if (d3Selection && d3Zoom) {
      if (panOnScroll && !zoomActivationKeyPressed) {
        d3Selection.on('wheel.zoom', (event: any) => {
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
        });
      } else if (typeof d3ZoomHandler !== 'undefined') {
        d3Selection.on('wheel.zoom', function (event: any, d: any) {
          if (!preventScrolling || isWrappedWithClass(event, noWheelClassName)) {
            return null;
          }

          event.preventDefault();
          d3ZoomHandler.call(this, event, d);
        });
      }
    }
  }, [
    panOnScroll,
    panOnScrollMode,
    d3Selection,
    d3Zoom,
    d3ZoomHandler,
    zoomActivationKeyPressed,
    zoomOnPinch,
    preventScrolling,
    noWheelClassName,
  ]);

  useEffect(() => {
    if (d3Zoom) {
      if (selectionKeyPressed && !isZoomingOrPanning.current) {
        d3Zoom.on('zoom', null);
      } else if (!selectionKeyPressed) {
        d3Zoom.on('zoom', (event: D3ZoomEvent<HTMLDivElement, any>) => {
          const { onViewportChange } = store.getState();

          store.setState({ transform: [event.transform.x, event.transform.y, event.transform.k] });

          if (onMove || onViewportChange) {
            const flowTransform = eventToFlowTransform(event.transform);

            onViewportChange?.(flowTransform);
            onMove?.(event.sourceEvent as MouseEvent | TouchEvent, flowTransform);
          }
        });
      }
    }
  }, [selectionKeyPressed, d3Zoom, onMove]);

  useEffect(() => {
    if (d3Zoom) {
      d3Zoom.on('start', (event: D3ZoomEvent<HTMLDivElement, any>) => {
        if (!event.sourceEvent) {
          return null;
        }

        const { onViewportChangeStart } = store.getState();
        isZoomingOrPanning.current = true;
        if (event.sourceEvent?.type === 'mousedown') {
          store.setState({ paneDragging: true });
        }

        if (onMoveStart || onViewportChangeStart) {
          const flowTransform = eventToFlowTransform(event.transform);
          prevTransform.current = flowTransform;

          onViewportChangeStart?.(flowTransform);
          onMoveStart?.(event.sourceEvent as MouseEvent | TouchEvent, flowTransform);
        }
      });
    }
  }, [d3Zoom, onMoveStart]);

  useEffect(() => {
    if (d3Zoom) {
      d3Zoom.on('end', (event: D3ZoomEvent<HTMLDivElement, any>) => {
        if (!event.sourceEvent) {
          return null;
        }
        const { onViewportChangeEnd } = store.getState();

        isZoomingOrPanning.current = false;
        store.setState({ paneDragging: false });

        if ((onMoveEnd || onViewportChangeEnd) && viewChanged(prevTransform.current, event.transform)) {
          const flowTransform = eventToFlowTransform(event.transform);
          prevTransform.current = flowTransform;

          clearTimeout(timerId.current);
          timerId.current = setTimeout(
            () => {
              onViewportChangeEnd?.(flowTransform);
              onMoveEnd?.(event.sourceEvent as MouseEvent | TouchEvent, flowTransform);
            },
            panOnScroll ? 150 : 0
          );
        }
      });
    }
  }, [d3Zoom, onMoveEnd, panOnScroll]);

  useEffect(() => {
    if (d3Zoom) {
      d3Zoom.filter((event: any) => {
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
        if (selectionKeyPressed) {
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

        // default filter for d3-zoom
        return (!event.ctrlKey || event.type === 'wheel') && (!event.button || event.button <= 1);
      });
    }
  }, [
    d3Zoom,
    zoomOnScroll,
    zoomOnPinch,
    panOnScroll,
    zoomOnDoubleClick,
    panOnDrag,
    selectionKeyPressed,
    elementsSelectable,
    zoomActivationKeyPressed,
  ]);

  return (
    <div className="react-flow__renderer" ref={zoomPane} style={containerStyle}>
      {children}
    </div>
  );
};

export default ZoomPane;
