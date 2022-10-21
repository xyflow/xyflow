import { useCallback } from 'react';

import { useStore } from '../hooks/useStore';
import { getNodesInside } from '../utils/graph';
import type { ReactFlowState } from '../types';

function useVisibleNodes(onlyRenderVisible: boolean) {
  const nodes = useStore(
    useCallback(
      (s: ReactFlowState) =>
        onlyRenderVisible
          ? getNodesInside(s.nodeInternals, { x: 0, y: 0, width: s.width, height: s.height }, s.transform, true)
          : Array.from(s.nodeInternals.values()),
      [onlyRenderVisible]
    )
  );

  return nodes;
}

export default useVisibleNodes;
