import { useRef, type ReactNode } from 'react';
import { UseBoundStoreWithEqualityFn } from 'zustand/traditional';

import { Provider } from '../../contexts/RFStoreContext';
import { createRFStore } from '../../store';
import type { Node, Edge, ReactFlowStoreApi } from '../../types';

function ReactFlowProvider({
  children,
  initialNodes,
  initialEdges,
  initialWidth,
  initialHeight,
  fitView,
}: {
  children: ReactNode;
  initialNodes?: Node[];
  initialEdges?: Edge[];
  initialWidth?: number;
  initialHeight?: number;
  fitView?: boolean;
}) {
  const storeRef = useRef<UseBoundStoreWithEqualityFn<ReactFlowStoreApi> | null>(null);

  if (!storeRef.current) {
    storeRef.current = createRFStore({
      nodes: initialNodes,
      edges: initialEdges,
      width: initialWidth,
      height: initialHeight,
      fitView,
    });
  }

  return <Provider value={storeRef.current}>{children}</Provider>;
}

ReactFlowProvider.displayName = 'ReactFlowProvider';

export default ReactFlowProvider;
