import { useCallback } from 'react';
import { getNodesInside } from '@xyflow/system';

import { useStore } from '../hooks/useStore';
import type { Node, ReactFlowState } from '../types';

function useVisibleNodes(onlyRenderVisible: boolean) {
  const nodes = useStore(
    useCallback(
      (s: ReactFlowState) =>
        onlyRenderVisible
          ? getNodesInside<Node>(s.nodes, { x: 0, y: 0, width: s.width, height: s.height }, s.transform, true)
          : s.nodes,
      [onlyRenderVisible]
    )
  );

  return nodes;
}

export default useVisibleNodes;
