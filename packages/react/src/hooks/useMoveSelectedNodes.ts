import { useCallback } from 'react';
import { calculateNodePosition, snapPosition, type XYPosition } from '@xyflow/system';

import { type InternalNode, type Node } from '../types';
import { useStoreApi } from './useStore';

const selectedAndDraggable = (nodesDraggable: boolean) => (n: Node) =>
  n.selected && (n.draggable || (nodesDraggable && typeof n.draggable === 'undefined'));

/**
 * Hook for updating node positions by passing a direction and factor
 *
 * @internal
 * @returns function for updating node positions
 */
export function useMoveSelectedNodes<NodeType extends Node = Node>() {
  const store = useStoreApi<NodeType>();

  const moveSelectedNodes = useCallback(
    (params: { direction: XYPosition; factor: number; event: KeyboardEvent; nodeId?: string }) => {
      const {
        nodeExtent,
        snapToGrid,
        snapGrid,
        nodesDraggable,
        onError,
        updateNodePositions,
        nodeLookup,
        nodeOrigin,
        onNodeMove,
      } = store.getState();
      const nodeUpdates = new Map<string, InternalNode<NodeType>>();
      const isSelected = selectedAndDraggable(nodesDraggable);
      let hasChange = false;

      /*
       * by default a node moves 5px on each key press
       * if snap grid is enabled, we use that for the velocity
       */
      const xVelo = snapToGrid ? snapGrid[0] : 5;
      const yVelo = snapToGrid ? snapGrid[1] : 5;

      const xDiff = params.direction.x * xVelo * params.factor;
      const yDiff = params.direction.y * yVelo * params.factor;

      for (const [, node] of nodeLookup) {
        if (!isSelected(node)) {
          continue;
        }

        let nextPosition = {
          x: node.internals.positionAbsolute.x + xDiff,
          y: node.internals.positionAbsolute.y + yDiff,
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

        hasChange = hasChange || node.position.x !== position.x || node.position.y !== position.y;
        node.position = position;
        node.internals.positionAbsolute = positionAbsolute;

        nodeUpdates.set(node.id, node);
      }

      const movedNodes =
        hasChange && onNodeMove
          ? Array.from(nodeUpdates.values(), (node) => ({
              ...node.internals.userNode,
              position: { ...node.position },
              dragging: false,
            }))
          : [];

      updateNodePositions(nodeUpdates);

      if (movedNodes.length && onNodeMove) {
        const currentNode = movedNodes.find((node) => node.id === params.nodeId) ?? movedNodes[0];
        onNodeMove(params.event, currentNode, movedNodes);
      }
    },
    []
  );

  return moveSelectedNodes;
}
