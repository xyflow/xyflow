import { useState, type ReactNode } from 'react';

import { Provider } from '../../contexts/StoreContext';
import { createStore } from '../../store';
import { BatchProvider } from '../BatchProvider';
import type { Node, Edge } from '../../types';
import { CoordinateExtent, NodeOrigin } from '@xyflow/system';

export type ReactFlowProviderProps = {
  initialNodes?: Node[];
  initialEdges?: Edge[];
  defaultNodes?: Node[];
  defaultEdges?: Edge[];
  initialWidth?: number;
  initialHeight?: number;
  fitView?: boolean;
  nodeOrigin?: NodeOrigin;
  nodeExtent?: CoordinateExtent;
  children: ReactNode;
};

export function ReactFlowProvider({
  initialNodes: nodes,
  initialEdges: edges,
  defaultNodes,
  defaultEdges,
  initialWidth: width,
  initialHeight: height,
  fitView,
  nodeOrigin,
  nodeExtent,
  children,
}: ReactFlowProviderProps) {
  const [store] = useState(() =>
    createStore({
      nodes,
      edges,
      defaultNodes,
      defaultEdges,
      width,
      height,
      fitView,
      nodeOrigin,
      nodeExtent,
    })
  );

  return (
    <Provider value={store}>
      <BatchProvider>{children}</BatchProvider>
    </Provider>
  );
}
