import { useCallback } from 'react';

import { useStoreApi } from '../store';
import { internalsSymbol } from '../utils';

import { Node, NodeSelectionChange, XYPosition } from '../types';
import { calcNextPosition } from './useDrag/utils';

function useUpdateNodes() {
  const store = useStoreApi();

  const updateNode = useCallback((nodeIds: string[], update: Partial<Node>) => {
    const { nodeInternals, hasDefaultNodes } = store.getState();

    if (!hasDefaultNodes) {
      return;
    }

    nodeIds.forEach((nodeId) => {
      const nodeToUpdate = nodeInternals.get(nodeId);

      if (nodeToUpdate) {
        const updatedNode = {
          ...nodeToUpdate,
          [internalsSymbol]: nodeToUpdate[internalsSymbol],
          ...update,
        };

        nodeInternals.set(nodeId, updatedNode);
      }
    });

    store.setState({ nodeInternals: new Map(nodeInternals) });
  }, []);

  const updateSelected = useCallback(
    (nodeIds: string[], selected: boolean) => {
      const { onNodesChange } = store.getState();

      updateNode(nodeIds, { selected });

      if (onNodesChange) {
        const changes = nodeIds.map((nodeId) => ({ id: nodeId, type: 'select', selected } as NodeSelectionChange));
        onNodesChange(changes);
      }
    },
    [updateNode]
  );

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

  return { updateNode, updateSelected, updatePositions };
}

export default useUpdateNodes;
