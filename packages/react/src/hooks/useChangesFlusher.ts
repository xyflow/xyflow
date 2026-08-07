import { useReactFlowStore, useReactFlowStoreApi } from './useReactFlowStore';
import { useIsomorphicLayoutEffect } from './useIsomorphicLayoutEffect';

export function useChangesFlusher() {
  const pendingNodeChangesVersion = useReactFlowStore((s) => s.pendingNodeChanges?.version);
  const pendingEdgeChangesVersion = useReactFlowStore((s) => s.pendingEdgeChanges?.version);
  const store = useReactFlowStoreApi();

  useIsomorphicLayoutEffect(() => {
    store.getState().flushNodeChanges();
  }, [pendingNodeChangesVersion]);

  useIsomorphicLayoutEffect(() => {
    store.getState().flushEdgeChanges();
  }, [pendingEdgeChangesVersion]);

  return null;
}
