import { useCallback } from 'react';

import { useStore } from '../store';
import { getNodesInside } from '../utils/graph';
import { ReactFlowState } from '../types';

function useVisibleNodes(onlyRenderVisible: boolean) {
  const nodes = useStore(
    useCallback(
      (s: ReactFlowState) => {
        return onlyRenderVisible
          ? getNodesInside(s.nodes, { x: 0, y: 0, width: s.width, height: s.height }, s.transform, true)
          : s.nodes;
      },
      [onlyRenderVisible]
    )
  );

  return nodes;
}

export default useVisibleNodes;
