import { useCallback } from 'react';

import { useStoreApi } from '../store';
import { calcNextPosition } from './useDrag/utils';

import { XYPosition } from '../types';

function useUpdateNodePositions() {
  const store = useStoreApi();

  const updatePositions = useCallback((positionDiff: XYPosition) => {
    const { nodeInternals, nodeExtent, updateNodePositions } = store.getState();
    const selectedNodes = Array.from(nodeInternals.values()).filter((n) => n.selected);

    const nodeUpdates = selectedNodes.map((n) => {
      if (n.positionAbsolute) {
        const updatedPos = calcNextPosition(
          n,
          { x: n.positionAbsolute.x + positionDiff.x, y: n.positionAbsolute.y + positionDiff.y },
          nodeInternals,
          nodeExtent
        );

        n.position = updatedPos.position;
        n.positionAbsolute = updatedPos.positionAbsolute;
      }

      return n;
    });

    updateNodePositions(nodeUpdates, true, true);
  }, []);

  return updatePositions;
}

export default useUpdateNodePositions;
