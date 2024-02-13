import { useRef, type ReactNode } from 'react';
import { type StoreApi } from 'zustand';
import { UseBoundStoreWithEqualityFn } from 'zustand/traditional';

import { Provider } from '../../contexts/RFStoreContext';
import { createRFStore } from '../../store';
import type { ReactFlowState, Node, Edge } from '../../types';

export function ReactFlowProvider({
  children,
  initialNodes,
  initialEdges,
  defaultNodes,
  defaultEdges,
  initialWidth,
  initialHeight,
  fitView,
}: {
  children: ReactNode;
  initialNodes?: Node[];
  initialEdges?: Edge[];
  defaultNodes?: Node[];
  defaultEdges?: Edge[];
  initialWidth?: number;
  initialHeight?: number;
  fitView?: boolean;
}) {
  const storeRef = useRef<UseBoundStoreWithEqualityFn<StoreApi<ReactFlowState>> | null>(null);
  if (!storeRef.current) {
    storeRef.current = createRFStore({
      nodes: initialNodes,
      edges: initialEdges,
      defaultNodes,
      defaultEdges,
      width: initialWidth,
      height: initialHeight,
      fitView,
    });
  }

  return <Provider value={storeRef.current}>{children}</Provider>;
}
