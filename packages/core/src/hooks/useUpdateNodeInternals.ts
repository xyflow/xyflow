import { useCallback } from 'react';

import { useStoreApi } from '../hooks/useStore';
import type { UpdateNodeInternals } from '../types';

function useUpdateNodeInternals(): UpdateNodeInternals {
  const store = useStoreApi();

  return useCallback<UpdateNodeInternals>((id: string | string[]) => {
    const { domNode, updateNodeDimensions } = store.getState();
    const nodeElement = domNode?.querySelector(`.react-flow__node[data-id="${id}"]`) as HTMLDivElement;

    if (nodeElement) {
      const updateIds = Array.isArray(id) ? id : [id];

      requestAnimationFrame(() => {
        updateIds.forEach((id) => {
          updateNodeDimensions([{ id, nodeElement, forceUpdate: true }]);
        });
      })
    }
  }, []);
}

export default useUpdateNodeInternals;
