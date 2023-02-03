import { useCallback } from 'react';

import { useStoreApi } from '../hooks/useStore';
import { calcNextPosition } from './useDrag/utils';

function useUpdateNodePositions() {
  const store = useStoreApi();

  const updatePositions = useCallback((params: { x: number; y: number; isShiftPressed: boolean }) => {
    const { nodeInternals, nodeExtent, updateNodePositions, getNodes, snapToGrid, snapGrid, onError, nodesDraggable } =
      store.getState();
    const selectedNodes = getNodes().filter(
      (n) => n.selected && (n.draggable || (nodesDraggable && typeof n.draggable === 'undefined'))
    );
    // by default a node moves 5px on each key press, or 20px if shift is pressed
    // if snap grid is enabled, we use that for the velocity.
    const xVelo = snapToGrid ? snapGrid[0] : 5;
    const yVelo = snapToGrid ? snapGrid[1] : 5;
    const factor = params.isShiftPressed ? 4 : 1;

    const positionDiffX = params.x * xVelo * factor;
    const positionDiffY = params.y * yVelo * factor;

    const nodeUpdates = selectedNodes.map((n) => {
      if (n.positionAbsolute) {
        const nextPosition = { x: n.positionAbsolute.x + positionDiffX, y: n.positionAbsolute.y + positionDiffY };

        if (snapToGrid) {
          nextPosition.x = snapGrid[0] * Math.round(nextPosition.x / snapGrid[0]);
          nextPosition.y = snapGrid[1] * Math.round(nextPosition.y / snapGrid[1]);
        }

        const { positionAbsolute, position } = calcNextPosition(
          n,
          nextPosition,
          nodeInternals,
          nodeExtent,
          undefined,
          onError
        );

        n.position = position;
        n.positionAbsolute = positionAbsolute;
      }

      return n;
    });

    updateNodePositions(nodeUpdates, true, false);
  }, []);

  return updatePositions;
}

export default useUpdateNodePositions;
