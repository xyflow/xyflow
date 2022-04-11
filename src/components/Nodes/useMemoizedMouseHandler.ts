import { MouseEvent, useCallback } from 'react';
import { GetState } from 'zustand';

import { ReactFlowState, Node } from '../../types';

function useMemoizedMouseHandler(
  id: string,
  dragging: boolean,
  getState: GetState<ReactFlowState>,
  handler?: (event: MouseEvent, node: Node) => void
) {
  const memoizedHandler = useCallback(
    (event: MouseEvent) => {
      if (typeof handler !== 'undefined' && !dragging) {
        const node = getState().nodeInternals.get(id)!;
        handler(event, { ...node });
      }
    },
    [handler, dragging, id]
  );

  return memoizedHandler;
}

export default useMemoizedMouseHandler;
