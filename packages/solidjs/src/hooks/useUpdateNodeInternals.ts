import type { UpdateNodeInternals, InternalNodeUpdate } from '@xyflow/system';

import { useStoreApi } from './useStore';

/**
 * Hook for updating node internals.
 *
 * @public
 * @returns function for updating node internals
 */
export function useUpdateNodeInternals(): UpdateNodeInternals {
  const store = useStoreApi();

  return (id: string | string[]) => {
    const {  updateNodeInternals } = store
    const domNode = store.domNode.get();
    const updateIds = Array.isArray(id) ? id : [id];
    const updates = new Map<string, InternalNodeUpdate>();

    updateIds.forEach((updateId) => {
      const nodeElement = domNode?.querySelector(`.react-flow__node[data-id="${updateId}"]`) as HTMLDivElement;

      if (nodeElement) {
        updates.set(updateId, { id: updateId, nodeElement, force: true });
      }
    });

    requestAnimationFrame(() => updateNodeInternals(updates));
  };
}
