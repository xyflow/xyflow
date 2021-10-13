import { useCallback } from 'react';

import { useStore } from '../store';
import { ElementId, UpdateNodeInternals, ReactFlowState } from '../types';

const updateNodeDimsSelector = (state: ReactFlowState) => state.updateNodeDimensions;

function useUpdateNodeInternals(): UpdateNodeInternals {
  const updateNodeDimensions = useStore(updateNodeDimsSelector);

  return useCallback<UpdateNodeInternals>((id: ElementId) => {
    const nodeElement = document.querySelector(`.react-flow__node[data-id="${id}"]`) as HTMLDivElement;

    if (nodeElement) {
      updateNodeDimensions([{ id, nodeElement, forceUpdate: true }]);
    }
  }, []);
}

export default useUpdateNodeInternals;
