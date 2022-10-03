import { useCallback } from 'react';

import { useStoreApi } from '../hooks/useStore';
import { calcNextPosition } from './useDrag/utils';

import { XYPosition } from '../types';

function useUpdateNodePositions() {
  const store = useStoreApi();

  const updatePositions = useCallback((positionDiff: XYPosition) => {
    const { nodeInternals, nodeExtent, updateNodePositions, snapToGrid, snapGrid } = store.getState();
    const selectedNodes = Array.from(nodeInternals.values()).filter((n) => n.selected);

    const nodeUpdates = selectedNodes.map((n) => {
      if (n.positionAbsolute) {
        const nextPosition = { x: n.positionAbsolute.x + positionDiff.x, y: n.positionAbsolute.y + positionDiff.y };

        if (snapToGrid) {
          nextPosition.x = snapGrid[0] * Math.round(nextPosition.x / snapGrid[0]);
          nextPosition.y = snapGrid[1] * Math.round(nextPosition.y / snapGrid[1]);
        }

        const updatedPos = calcNextPosition(n, nextPosition, nodeInternals, nodeExtent);

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
