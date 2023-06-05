import { useCallback } from 'react';
import type { UpdateNodeInternals, NodeDimensionUpdate } from '@xyflow/system';

import { useStoreApi } from '../hooks/useStore';

function useUpdateNodeInternals(): UpdateNodeInternals {
  const store = useStoreApi();

  return useCallback<UpdateNodeInternals>((id: string | string[]) => {
    const { domNode, updateNodeDimensions } = store.getState();

    const updateIds = Array.isArray(id) ? id : [id];
    const updates = updateIds.reduce<NodeDimensionUpdate[]>((res, updateId) => {
      const nodeElement = domNode?.querySelector(`.react-flow__node[data-id="${updateId}"]`) as HTMLDivElement;

      if (nodeElement) {
        res.push({ id: updateId, nodeElement, forceUpdate: true });
      }

      return res;
    }, []);

    requestAnimationFrame(() => updateNodeDimensions(updates));
  }, []);
}

export default useUpdateNodeInternals;
