import { useCallback } from 'react';

import { useStore, useStoreApi } from '../store';
import { UpdateNodeInternals, ReactFlowState } from '../types';

const selector = (state: ReactFlowState) => state.updateNodeDimensions;

function useUpdateNodeInternals(): UpdateNodeInternals {
  const store = useStoreApi();
  const updateNodeDimensions = useStore(selector);

  return useCallback<UpdateNodeInternals>((id: string) => {
    const { domNode } = store.getState();
    if (!domNode) {
      return;
    }

    const nodeElement = domNode.querySelector(`.react-flow__node[data-id="${id}"]`) as HTMLDivElement;

    if (nodeElement) {
      updateNodeDimensions([{ id, nodeElement, forceUpdate: true }]);
    }
  }, []);
}

export default useUpdateNodeInternals;
