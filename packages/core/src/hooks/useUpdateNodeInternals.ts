import { useCallback } from 'react';

import { useStoreApi } from '../hooks/useStore';
import type { UpdateNodeInternals } from '../types';

function useUpdateNodeInternals(): UpdateNodeInternals {
  const store = useStoreApi();

  return useCallback<UpdateNodeInternals>((id: string | string[]) => {
    const { domNode, updateNodeDimensions } = store.getState();

    const updateIds = Array.isArray(id) ? id : [id];

    requestAnimationFrame(() => {
      updateIds.forEach((updateId) => {
        const nodeElement = domNode?.querySelector(`.react-flow__node[data-id="${updateId}"]`) as HTMLDivElement;

        if (nodeElement) {
          updateNodeDimensions([{ id: updateId, nodeElement, forceUpdate: true }]);
        }
      });
    });
  }, []);
}

export default useUpdateNodeInternals;
