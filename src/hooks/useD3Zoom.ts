import { useEffect, useRef, MutableRefObject } from 'react';

import { useStoreState, useStoreActions } from '../store/hooks';
import { FlowTransform } from '../types';

interface UseD3ZoomParams {
  zoomPane: MutableRefObject<Element | null>;
  selectionKeyPressed: boolean;
  zoomOnScroll: boolean;
  zoomOnDoubleClick: boolean;
  paneMoveable: boolean;
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
  zoomOnScroll,
  zoomOnDoubleClick,
  selectionKeyPressed,
  paneMoveable,
}: UseD3ZoomParams): void => {
  const prevTransform = useRef<FlowTransform>({ x: 0, y: 0, zoom: 0 });
  const d3Zoom = useStoreState((s) => s.d3Zoom);

  const initD3 = useStoreActions((actions) => actions.initD3);
  const updateTransform = useStoreActions((actions) => actions.updateTransform);

  useEffect(() => {
    if (zoomPane.current) {
      initD3(zoomPane.current);
    }
  }, []);

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
        if (!paneMoveable) {
          return false;
        }

        if (!zoomOnScroll && event.type === 'wheel') {
          return false;
        }

        if (!zoomOnDoubleClick && event.type === 'dblclick') {
          return false;
        }

        return !event.ctrlKey && !event.button;
      });
    }
  }, [d3Zoom, zoomOnScroll, zoomOnDoubleClick, paneMoveable]);
};
