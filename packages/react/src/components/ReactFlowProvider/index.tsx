import { useState, type ReactNode } from 'react';

import { Provider } from '../../contexts/StoreContext';
import { createStore } from '../../store';
import { BatchProvider } from '../BatchProvider';
import type { Node, Edge } from '../../types';

export type ReactFlowProviderProps = {
  initialNodes?: Node[];
  initialEdges?: Edge[];
  defaultNodes?: Node[];
  defaultEdges?: Edge[];
  initialWidth?: number;
  initialHeight?: number;
  fitView?: boolean;
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
    })
  );

  return (
    <Provider value={store}>
      <BatchProvider>{children}</BatchProvider>
    </Provider>
  );
}
