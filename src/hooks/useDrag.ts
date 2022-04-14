import { RefObject, useEffect } from 'react';
import { D3DragEvent, drag, SubjectPosition } from 'd3-drag';
import { select } from 'd3-selection';

import { useStoreApi } from '../store';

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
  nodeId?: string;
};

function useDrag({ onStart, onDrag, onStop, nodeRef, disabled = false, noDragClassName, nodeId }: UseDragParams) {
  const store = useStoreApi();

  useEffect(() => {
    if (nodeRef?.current && nodeId) {
      const selection = select(nodeRef.current);
      const startPos = { x: 0, y: 0 };

      if (disabled) {
        selection.on('.drag', null);
      } else {
        const dragHandler = drag()
          .on('start', (event: UseDragEvent) => {
            const node = store.getState().nodeInternals.get(nodeId);
            const [tx, ty, scale] = store.getState().transform;

            startPos.x = event.x / scale - (node?.positionAbsolute?.x || 0) - tx;
            startPos.y = event.y / scale - (node?.positionAbsolute?.y || 0) - ty;

            // @TODO: we need to use snapGrid and snapToGrid from the store here
            // @TODO: don't use event.dx but work with event.x somehow in order to prevent lagging / slower node movement than mouse movement
            onStart(event);
          })
          .on('drag', (event: UseDragEvent) => {
            const [tx, ty, scale] = store.getState().transform;
            // @TODO: we need to use snapGrid and snapToGrid from the store here
            // @TODO: don't use event.dx but work with event.x somehow in order to prevent lagging / slower node movement than mouse movement

            onDrag(event, { dx: event.x / scale - startPos.x - tx, dy: event.y / scale - startPos.y - ty });
          })
          .on('end', onStop)
          .filter((event: any) => !event.ctrlKey && !event.button && !event.target.className.includes(noDragClassName));

        selection.call(dragHandler);

        return () => {
          selection.on('.drag', null);
        };
      }
    }
  }, [disabled, noDragClassName, nodeId]);

  return null;
}

export default useDrag;
