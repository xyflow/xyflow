import { RefObject, useEffect } from 'react';
import { D3DragEvent, drag, SubjectPosition } from 'd3-drag';
import { select } from 'd3-selection';

import { useStoreApi } from '../store';
import { pointToRendererPoint } from '../utils/graph';
import { XYPosition } from '../types';

export type UseDragEvent = D3DragEvent<HTMLDivElement, null, SubjectPosition>;
export type UseDragData = { dx: number; dy: number };

type UseDragParams = {
  onStart: (event: UseDragEvent) => void;
  onDrag: (event: UseDragEvent, data: UseDragData) => void;
  onStop: (event: UseDragEvent) => void;
  nodeRef: RefObject<Element>;
  disabled?: boolean;
  noDragClassName?: string;
  // @TODO: implement handleSelector functionality
  handleSelector?: string;
};

function getOffset(event: UseDragEvent, nodeRef: RefObject<Element>) {
  const bounds = nodeRef.current?.getBoundingClientRect() || { x: 0, y: 0 };
  const parent = (nodeRef.current as HTMLDivElement)?.offsetParent;
  const parentBounds = parent?.getBoundingClientRect() || { x: 0, y: 0 };

  return {
    x: event.x - (bounds?.x - parentBounds?.x - (parent?.scrollLeft || 0)),
    y: event.y - (bounds?.y - parentBounds?.y - (parent?.scrollTop || 0)),
  };
}

function useDrag({ onStart, onDrag, onStop, nodeRef, disabled = false, noDragClassName }: UseDragParams) {
  const store = useStoreApi();

  useEffect(() => {
    if (nodeRef?.current) {
      const selection = select(nodeRef.current);
      const startPos: XYPosition = { x: 0, y: 0 };
      const lastPos: { x: number | null; y: number | null } = { x: null, y: null };

      if (disabled) {
        selection.on('.drag', null);
      } else {
        const dragHandler = drag()
          .on('start', (event: UseDragEvent) => {
            const [tx, ty] = store.getState().transform;
            const offset = getOffset(event, nodeRef);

            startPos.x = offset.x - tx;
            startPos.y = offset.y - ty;

            onStart(event);
          })
          .on('drag', (event: UseDragEvent) => {
            const { transform, snapGrid, snapToGrid } = store.getState();
            const pos = pointToRendererPoint(
              {
                x: event.x - startPos.x,
                y: event.y - startPos.y,
              },
              transform,
              snapToGrid,
              snapGrid
            );

            // skip events without movement
            if (lastPos.x !== pos.x || lastPos.y !== pos.y) {
              lastPos.x = pos.x;
              lastPos.y = pos.y;
              onDrag(event, {
                dx: pos.x,
                dy: pos.y,
              });
            }
          })
          .on('end', onStop)
          .filter((event: any) => !event.ctrlKey && !event.button && !event.target.className.includes(noDragClassName));

        selection.call(dragHandler);

        return () => {
          selection.on('.drag', null);
        };
      }
    }
  }, [disabled, noDragClassName]);

  return null;
}

export default useDrag;
