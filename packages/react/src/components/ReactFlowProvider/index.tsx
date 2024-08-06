import { useState, type ReactNode } from 'react';

import { Provider } from '../../contexts/StoreContext';
import { createStore } from '../../store';
import { BatchProvider } from '../BatchProvider';
import type { Node, Edge } from '../../types';
import { NodeOrigin } from '@xyflow/system';

export type ReactFlowProviderProps = {
  initialNodes?: readonly Node[];
  initialEdges?: readonly Edge[];
  defaultNodes?: readonly Node[];
  defaultEdges?: readonly Edge[];
  initialWidth?: number;
  initialHeight?: number;
  fitView?: boolean;
  nodeOrigin?: NodeOrigin;
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
    })
  );

  return (
    <Provider value={store}>
      <BatchProvider>{children}</BatchProvider>
    </Provider>
  );
}
