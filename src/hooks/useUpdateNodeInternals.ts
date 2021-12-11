import { useCallback } from 'react';

import { useStore } from '../store';
import { UpdateNodeInternals, ReactFlowState } from '../types';

const selector = (state: ReactFlowState) => state.updateNodeDimensions;

function useUpdateNodeInternals(): UpdateNodeInternals {
  const updateNodeDimensions = useStore(selector);

  return useCallback<UpdateNodeInternals>((id: string) => {
    const nodeElement = document.querySelector(`.react-flow__node[data-id="${id}"]`) as HTMLDivElement;

    if (nodeElement) {
      updateNodeDimensions([{ id, nodeElement, forceUpdate: true }]);
    }
  }, []);
}

export default useUpdateNodeInternals;
