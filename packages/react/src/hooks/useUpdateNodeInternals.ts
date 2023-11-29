import { useCallback } from 'react';
import type { UpdateNodeInternals, NodeDimensionUpdate } from '@xyflow/system';

import { useStoreApi } from '../hooks/useStore';

function useUpdateNodeInternals(): UpdateNodeInternals {
  const store = useStoreApi();

  return useCallback<UpdateNodeInternals>((id: string | string[]) => {
    const { domNode, updateNodeDimensions } = store.getState();
    const updateIds = Array.isArray(id) ? id : [id];
    const updates = new Map<string, NodeDimensionUpdate>();

    updateIds.forEach((updateId) => {
      const nodeElement = domNode?.querySelector(`.react-flow__node[data-id="${updateId}"]`) as HTMLDivElement;

      if (nodeElement) {
        updates.set(updateId, { id: updateId, nodeElement, forceUpdate: true });
      }
    });

    requestAnimationFrame(() => updateNodeDimensions(updates));
  }, []);
}

export default useUpdateNodeInternals;
