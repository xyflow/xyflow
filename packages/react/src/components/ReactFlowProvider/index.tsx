import { useRef, type ReactNode } from 'react';
import { type StoreApi } from 'zustand';
import { UseBoundStoreWithEqualityFn } from 'zustand/traditional';

import { Provider } from '../../contexts/RFStoreContext';
import { createRFStore } from '../../store';
import type { ReactFlowState, Node, Edge } from '../../types';

function ReactFlowProvider({
  children,
  initialNodes,
  initialEdges,
  initialWidth,
  initialHeight,
}: {
  children: ReactNode;
  initialNodes?: Node[];
  initialEdges?: Edge[];
  initialWidth?: number;
  initialHeight?: number;
}) {
  const storeRef = useRef<UseBoundStoreWithEqualityFn<StoreApi<ReactFlowState>> | null>(null);

  if (!storeRef.current) {
    storeRef.current = createRFStore({
      nodes: initialNodes,
      edges: initialEdges,
      width: initialWidth,
      height: initialHeight,
    });
  }

  return <Provider value={storeRef.current}>{children}</Provider>;
}

ReactFlowProvider.displayName = 'ReactFlowProvider';

export default ReactFlowProvider;
