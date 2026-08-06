import { useReactFlowStore, useReactFlowStoreApi } from './useReactFlowStore';
import { useIsomorphicLayoutEffect } from './useIsomorphicLayoutEffect';

export function useChangesFlusher() {
  const store = useReactFlowStoreApi();
  const pendingNodeChanges = useReactFlowStore((s) => s.pendingNodeChanges);
  const pendingEdgeChanges = useReactFlowStore((s) => s.pendingEdgeChanges);

  useIsomorphicLayoutEffect(() => {
    store.getState().flushNodeChanges();
  }, [pendingNodeChanges]);

  useIsomorphicLayoutEffect(() => {
    store.getState().flushEdgeChanges();
  }, [pendingEdgeChanges]);

  return null;
}
