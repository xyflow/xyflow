import { useCallback } from 'react';
import { calculateNodePosition, snapPosition } from '@xyflow/system';

import { Node } from '../types';
import { useStoreApi } from '../hooks/useStore';

const selectedAndDraggable = (nodesDraggable: boolean) => (n: Node) =>
  n.selected && (n.draggable || (nodesDraggable && typeof n.draggable === 'undefined'));

/**
 * Hook for updating node positions.
 *
 * @internal
 * @returns function for updating node positions
 */
export function useUpdateNodePositions() {
  const store = useStoreApi();

  const updatePositions = useCallback((params: { x: number; y: number; isShiftPressed: boolean }) => {
    const {
      nodeExtent,
      nodes,
      snapToGrid,
      snapGrid,
      nodesDraggable,
      onError,
      updateNodePositions,
      nodeLookup,
      nodeOrigin,
    } = store.getState();
    const selectedNodes = nodes.filter(selectedAndDraggable(nodesDraggable));
    // by default a node moves 5px on each key press, or 20px if shift is pressed
    // if snap grid is enabled, we use that for the velocity.
    const xVelo = snapToGrid ? snapGrid[0] : 5;
    const yVelo = snapToGrid ? snapGrid[1] : 5;
    const factor = params.isShiftPressed ? 4 : 1;

    const xDiff = params.x * xVelo * factor;
    const yDiff = params.y * yVelo * factor;

    const nodeUpdates = selectedNodes.map((node) => {
      if (node.computed?.positionAbsolute) {
        let nextPosition = {
          x: node.computed.positionAbsolute.x + xDiff,
          y: node.computed.positionAbsolute.y + yDiff,
        };

        if (snapToGrid) {
          nextPosition = snapPosition(nextPosition, snapGrid);
        }

        const { position, positionAbsolute } = calculateNodePosition({
          nodeId: node.id,
          nextPosition,
          nodeLookup,
          nodeExtent,
          nodeOrigin,
          onError,
        });

        node.position = position;
        node.computed.positionAbsolute = positionAbsolute;
      }

      return node;
    });

    updateNodePositions(nodeUpdates, true, false);
  }, []);

  return updatePositions;
}
