import React, { useEffect, useRef, ReactNode } from 'react';

import { zoom, zoomIdentity } from 'd3-zoom';
import { select } from 'd3-selection';
import { clamp } from '../../utils';

import useResizeHandler from '../../hooks/useResizeHandler';
import { useStoreState, useStoreActions, useStore } from '../../store/hooks';
import { FlowTransform, TranslateExtent } from '../../types';

interface ZoomPaneProps {
  selectionKeyPressed: boolean;
  elementsSelectable?: boolean;
  zoomOnScroll?: boolean;
  panOnScroll?: boolean;
  panOnScrollSpeed?: number;
  zoomOnDoubleClick?: boolean;
  paneMoveable?: boolean;
  defaultPosition?: [number, number];
  defaultZoom?: number;
  translateExtent?: TranslateExtent;
  onMove?: (flowTransform?: FlowTransform) => void;
  onMoveStart?: (flowTransform?: FlowTransform) => void;
  onMoveEnd?: (flowTransform?: FlowTransform) => void;
  children: ReactNode;
}

const viewChanged = (prevTransform: FlowTransform, eventTransform: any): boolean =>
  prevTransform.x !== eventTransform.x ||
  prevTransform.y !== eventTransform.y ||
  prevTransform.zoom !== eventTransform.k;

const eventToFlowTransform = (eventTransform: any): FlowTransform => ({
  x: eventTransform.x,
  y: eventTransform.y,
  zoom: eventTransform.k,
});

const ZoomPane = ({
  onMove,
  onMoveStart,
  onMoveEnd,
  zoomOnScroll = true,
  panOnScroll = false,
  panOnScrollSpeed = 0.5,
  zoomOnDoubleClick = true,
  selectionKeyPressed,
  elementsSelectable,
  paneMoveable = true,
  defaultPosition = [0, 0],
  defaultZoom = 1,
  translateExtent,
  children,
}: ZoomPaneProps) => {
  const zoomPane = useRef<HTMLDivElement>(null);
  const prevTransform = useRef<FlowTransform>({ x: 0, y: 0, zoom: 0 });

  const d3Zoom = useStoreState((s) => s.d3Zoom);
  const d3Selection = useStoreState((s) => s.d3Selection);
  const d3ZoomHandler = useStoreState((s) => s.d3ZoomHandler);

  const initD3Zoom = useStoreActions((actions) => actions.initD3Zoom);
  const updateTransform = useStoreActions((actions) => actions.updateTransform);
  const store = useStore();

  useResizeHandler(zoomPane);

  useEffect(() => {
    if (zoomPane.current) {
      // initD3: action((state, { zoomPane, defaultPosition, defaultZoom, translateExtent }) => {
      const state = store.getState();
      const currentTranslateExtent = typeof translateExtent !== 'undefined' ? translateExtent : state.translateExtent;
      const d3ZoomInstance = zoom().scaleExtent([state.minZoom, state.maxZoom]).translateExtent(currentTranslateExtent);
      const selection = select(zoomPane.current as Element).call(d3ZoomInstance);

      const clampedX = clamp(defaultPosition[0], currentTranslateExtent[0][0], currentTranslateExtent[1][0]);
      const clampedY = clamp(defaultPosition[1], currentTranslateExtent[0][1], currentTranslateExtent[1][1]);
      const clampedZoom = clamp(defaultZoom, state.minZoom, state.maxZoom);

      const updatedTransform = zoomIdentity.translate(clampedX, clampedY).scale(clampedZoom);
      // selection.property('__zoom', updatedTransform);

      const zoomHandler = selection.on('wheel.zoom');

      d3ZoomInstance.transform(selection, updatedTransform);

      initD3Zoom({
        d3Zoom: d3ZoomInstance,
        d3Selection: selection,
        d3ZoomHandler: zoomHandler,
      });
    }
  }, []);

  useEffect(() => {
    if (d3Selection && d3Zoom) {
      if (panOnScroll) {
        d3Selection
          .on('wheel', (event: any) => {
            event.preventDefault();
            event.stopImmediatePropagation();

            const currentZoom = d3Selection.property('__zoom').k || 1;
            // increase scroll speed in firefox
            // firefox: deltaMode === 1; chrome: deltaMode === 0
            const deltaNormalize = event.deltaMode === 1 ? 20 : 1;
            const deltaX = event.deltaX * deltaNormalize;
            const deltaY = event.deltaY * deltaNormalize;

            d3Zoom.translateBy(
              d3Selection,
              (deltaX / currentZoom) * panOnScrollSpeed,
              (deltaY / currentZoom) * panOnScrollSpeed
            );
          })
          .on('wheel.zoom', null);
      } else if (typeof d3ZoomHandler !== 'undefined') {
        d3Selection.on('wheel', null).on('wheel.zoom', d3ZoomHandler);
      }
    }
  }, [panOnScroll, d3Selection, d3Zoom, d3ZoomHandler]);

  useEffect(() => {
    if (d3Zoom) {
      if (selectionKeyPressed) {
        d3Zoom.on('zoom', null);
      } else {
        d3Zoom.on('zoom', (event: any) => {
          updateTransform(event.transform);

          if (onMove) {
            const flowTransform = eventToFlowTransform(event.transform);
            onMove(flowTransform);
          }
        });
      }
    }
  }, [selectionKeyPressed, d3Zoom, updateTransform, onMove]);

  useEffect(() => {
    if (d3Zoom) {
      if (onMoveStart) {
        d3Zoom.on('start', (event: any) => {
          if (viewChanged(prevTransform.current, event.transform)) {
            const flowTransform = eventToFlowTransform(event.transform);
            prevTransform.current = flowTransform;

            onMoveStart(flowTransform);
          }
        });
      } else {
        d3Zoom.on('start', null);
      }
    }
  }, [d3Zoom, onMoveStart]);

  useEffect(() => {
    if (d3Zoom) {
      if (onMoveEnd) {
        d3Zoom.on('end', (event: any) => {
          if (viewChanged(prevTransform.current, event.transform)) {
            const flowTransform = eventToFlowTransform(event.transform);
            prevTransform.current = flowTransform;

            onMoveEnd(flowTransform);
          }
        });
      } else {
        d3Zoom.on('end', null);
      }
    }
  }, [d3Zoom, onMoveEnd]);

  useEffect(() => {
    if (d3Zoom) {
      d3Zoom.filter((event: any) => {
        // if all interactions are disabled, we prevent all zoom events
        if (!paneMoveable && !zoomOnScroll && !panOnScroll && !zoomOnDoubleClick) {
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

        // when the target element is a node, we still allow zooming
        if (event.target.closest('.react-flow__node') && event.type !== 'wheel') {
          return false;
        }

        // when the target element is a node selection, we still allow zooming
        if (event.target.closest('.react-flow__nodesselection') && event.type !== 'wheel') {
          return false;
        }

        // when there is no scroll handling enabled, we prevent all wheel events
        if (!zoomOnScroll && !panOnScroll && event.type === 'wheel') {
          return false;
        }

        // if the pane is not movable, we prevent dragging it with the mouse
        if (!paneMoveable && event.type === 'mousedown') {
          return false;
        }

        // default filter for d3-zoom, prevents zooming on buttons and when ctrl is pressed
        return !event.ctrlKey && !event.button;
      });
    }
  }, [d3Zoom, zoomOnScroll, panOnScroll, zoomOnDoubleClick, paneMoveable, selectionKeyPressed, elementsSelectable]);

  return (
    <div className="react-flow__renderer react-flow__zoompane" ref={zoomPane}>
      {children}
    </div>
  );
};

export default ZoomPane;
