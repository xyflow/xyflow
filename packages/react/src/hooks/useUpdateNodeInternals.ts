import { useCallback } from 'react';
import type { UpdateNodeInternals, InternalNodeUpdate } from '@xyflow/system';

import { useStoreApi } from '../hooks/useStore';
import { useIsomorphicLayoutEffect } from './useIsomorphicLayoutEffect';

/**
 * Hook for updating node internals.
 *
 * @public
 * @returns function for updating node internals
 */
export function useUpdateNodeInternals(): UpdateNodeInternals {
  const store = useStoreApi();

  return useCallback<UpdateNodeInternals>((id: string | string[]) => {
    const { domNode, updateNodeInternals } = store.getState();
    const updateIds = Array.isArray(id) ? id : [id];
    const updates = new Map<string, InternalNodeUpdate>();

    updateIds.forEach((updateId) => {
      const nodeElement = domNode?.querySelector(`.react-flow__node[data-id="${updateId}"]`) as HTMLDivElement;

      if (nodeElement) {
        updates.set(updateId, { id: updateId, nodeElement, force: true });
      }
    });

  useIsomorphicLayoutEffect(() => updateNodeInternals(updates, { triggerFitView: false }));
  }, []);
}
