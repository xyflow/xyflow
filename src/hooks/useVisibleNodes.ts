import { useCallback } from 'react';

import { useStore } from '../store';
import { getNodesInside } from '../utils/graph';
import { ReactFlowState } from '../types';

function useVisibleNodes(onlyRenderVisible: boolean) {
  const nodes = useStore(
    useCallback(
      (s: ReactFlowState) => {
        // @TODO: work with nodeInternals instead of converting it to an array
        const nodes = Array.from(s.nodeInternals).map(([_, node]) => node);
        return onlyRenderVisible
          ? getNodesInside(nodes, { x: 0, y: 0, width: s.width, height: s.height }, s.transform, true)
          : nodes;
      },
      [onlyRenderVisible]
    )
  );

  return nodes;
}

export default useVisibleNodes;
