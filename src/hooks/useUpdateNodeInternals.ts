import { useCallback } from 'react';

import { useStoreActions } from '../store/hooks';
import { ElementId, UpdateNodeInternals } from '../types';

function useUpdateNodeInternals(): UpdateNodeInternals {
  const updateNodeDimensions = useStoreActions((actions) => actions.updateNodeDimensions);

  return useCallback<UpdateNodeInternals>((id: ElementId) => {
    const nodeElement = document.querySelector(`.react-flow__node[data-id="${id}"]`);

    if (nodeElement) {
      updateNodeDimensions([{ id, nodeElement, forceUpdate: true }]);
    }
  }, []);
}

export default useUpdateNodeInternals;
