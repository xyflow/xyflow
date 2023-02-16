import { useCallback } from 'react';
import { getNodesInside } from '@reactflow/utils';
import type { ReactFlowState } from '@reactflow/system';

import { useStore } from '../hooks/useStore';

function useVisibleNodes(onlyRenderVisible: boolean) {
  const nodes = useStore(
    useCallback(
      (s: ReactFlowState) =>
        onlyRenderVisible
          ? getNodesInside(s.nodeInternals, { x: 0, y: 0, width: s.width, height: s.height }, s.transform, true)
          : s.getNodes(),
      [onlyRenderVisible]
    )
  );

  return nodes;
}

export default useVisibleNodes;
