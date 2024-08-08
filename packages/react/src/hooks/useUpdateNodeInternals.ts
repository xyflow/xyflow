import { useCallback } from 'react';
import type { UpdateNodeInternals, InternalNodeUpdate, Dimensions } from '@xyflow/system';

import { useStoreApi } from '../hooks/useStore';

/**
 * Hook for updating node internals.
 *
 * @public
 * @returns function for updating node internals
 */
export function useUpdateNodeInternals(): UpdateNodeInternals {
  const store = useStoreApi();

  return useCallback<UpdateNodeInternals>((id: string | string[]) => {
    const { domNode, updateNodeInternals, nodeLookup } = store.getState();
    const updateIds = Array.isArray(id) ? id : [id];
    const updates = new Map<string, InternalNodeUpdate>();

    updateIds.forEach((updateId) => {
      const nodeElement = domNode?.querySelector(`.react-flow__node[data-id="${updateId}"]`) as HTMLDivElement;
      const node = nodeLookup.get(updateId);

      if (nodeElement && node) {
        const dimensions = node.measured.width && node.measured.height ? (node.measured as Dimensions) : undefined;

        updates.set(updateId, { id: updateId, nodeElement, dimensions, force: true });
      }
    });

    requestAnimationFrame(() => updateNodeInternals(updates));
  }, []);
}
