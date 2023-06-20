import { useRef } from 'react';
import type { FC, PropsWithChildren } from 'react';
import { StoreApi } from 'zustand';

import { Provider } from '../../contexts/RFStoreContext';
import { createRFStore } from '../../store';
import type { ReactFlowState } from '../../types';
import { createNodeInternals } from '../../store/utils';

const ReactFlowProvider: FC<PropsWithChildren<unknown>> = ({ children, initialNodes, initialEdges }) => {
  const storeRef = useRef<StoreApi<ReactFlowState> | null>(null);
  console.log('herherherhehre * 2');
  if (!storeRef.current) {
    const hasDefaultNodes = typeof initialNodes !== 'undefined';
    const hasDefaultEdges = typeof initialEdges !== 'undefined';

    const nodeInternals = hasDefaultNodes ? createNodeInternals(initialNodes, new Map(), [0, 0], true) : new Map();
    console.log('nodeInternals:', nodeInternals);
    const nextEdges = hasDefaultEdges ? initialEdges : [];

    console.log('createRFStore:', createRFStore);
    storeRef.current = createRFStore({ nodeInternals, edges: nextEdges, hasDefaultNodes, hasDefaultEdges });
  }

  return <Provider value={storeRef.current}>{children}</Provider>;
};

ReactFlowProvider.displayName = 'ReactFlowProvider';

export default ReactFlowProvider;
