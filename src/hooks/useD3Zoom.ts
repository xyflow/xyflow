import { useEffect, useRef, MutableRefObject } from 'react';

import { useStoreState, useStoreActions } from '../store/hooks';
import { FlowTransform, TranslateExtent } from '../types';

interface UseD3ZoomParams {
  zoomPane: MutableRefObject<Element | null>;
  selectionKeyPressed: boolean;
  elementsSelectable?: boolean;
  zoomOnScroll?: boolean;
  panOnScroll?: boolean;
  zoomOnDoubleClick?: boolean;
  paneMoveable?: boolean;
  defaultPosition?: [number, number];
  defaultZoom?: number;
  translateExtent?: TranslateExtent;
  onMove?: (flowTransform?: FlowTransform) => void;
  onMoveStart?: (flowTransform?: FlowTransform) => void;
  onMoveEnd?: (flowTransform?: FlowTransform) => void;
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

export default ({
  zoomPane,
  onMove,
  onMoveStart,
  onMoveEnd,
  zoomOnScroll = true,
  panOnScroll = false,
  zoomOnDoubleClick = true,
  selectionKeyPressed,
  elementsSelectable,
  paneMoveable = true,
  defaultPosition = [0, 0],
  defaultZoom = 1,
  translateExtent,
}: UseD3ZoomParams): void => {
  const prevTransform = useRef<FlowTransform>({ x: 0, y: 0, zoom: 0 });
  const d3Zoom = useStoreState((s) => s.d3Zoom);

  const initD3 = useStoreActions((actions) => actions.initD3);
  const updateTransform = useStoreActions((actions) => actions.updateTransform);
  const updateTransformDelta = useStoreActions((actions) => actions.updateTransformDelta);

  useEffect(() => {
    if (zoomPane.current) {
      initD3({ zoomPane: zoomPane.current, defaultPosition, defaultZoom, translateExtent });
    }
  }, []);

  useEffect(() => {
    if (d3Zoom) {
      d3Zoom.on('zoom', (event: any) => {
        if (panOnScroll && event.sourceEvent.type === 'wheel') {
          const { deltaX, deltaY } = event.sourceEvent;
          updateTransformDelta({ x: deltaX, y: deltaY });
        } else {
          updateTransform(event.transform);

          // todo: should we move this into the store or into a wrapper component with useEffect?
          if (onMove) {
            const flowTransform = eventToFlowTransform(event.transform);
            onMove(flowTransform);
          }
        }
      });
    }
  }, [selectionKeyPressed, panOnScroll, d3Zoom, updateTransform, updateTransformDelta, onMove]);

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
        if (elementsSelectable && selectionKeyPressed) {
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
};
