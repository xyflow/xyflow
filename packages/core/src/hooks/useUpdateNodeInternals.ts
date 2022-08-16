import { useCallback } from 'react';

import { useStoreApi } from '../hooks/useStore';
import { UpdateNodeInternals } from '../types';

function useUpdateNodeInternals(): UpdateNodeInternals {
  const store = useStoreApi();

  return useCallback<UpdateNodeInternals>((id: string) => {
    const { domNode, updateNodeDimensions } = store.getState();
    const nodeElement = domNode?.querySelector(`.react-flow__node[data-id="${id}"]`) as HTMLDivElement;

    if (nodeElement) {
      requestAnimationFrame(() => updateNodeDimensions([{ id, nodeElement, forceUpdate: true }]));
    }
  }, []);
}

export default useUpdateNodeInternals;
