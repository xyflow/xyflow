import { useCallback } from 'react';

import { useStoreApi } from '../store';
import { internalsSymbol } from '../utils';

import { Node, XYPosition } from '../types';

function useUpdateNode() {
  const store = useStoreApi();

  const updateNode = useCallback((nodeId: string, update: Partial<Node>) => {
    const { nodeInternals, hasDefaultNodes } = store.getState();
    const nodeToUpdate = nodeInternals.get(nodeId);

    if (!nodeToUpdate || !hasDefaultNodes) {
      return;
    }

    const updatedNode = {
      ...nodeToUpdate,
      [internalsSymbol]: nodeToUpdate[internalsSymbol],
      ...update,
    };

    nodeInternals.set(nodeId, updatedNode);
    store.setState({ nodeInternals: new Map(nodeInternals) });
  }, []);

  const updateSelected = useCallback(
    (nodeId: string, selected: boolean) => {
      const { onNodesChange } = store.getState();

      updateNode(nodeId, { selected });

      if (onNodesChange) {
        onNodesChange([{ id: nodeId, type: 'select', selected }]);
      }
    },
    [updateNode]
  );

  const updatePosition = useCallback(
    (nodeId: string, diff: XYPosition) => {
      const { onNodesChange, nodeInternals } = store.getState();
      const node = nodeInternals.get(nodeId);

      if (!node || !node.positionAbsolute) {
        return;
      }

      const position = {
        x: node.position.x + diff.x,
        y: node.position.y + diff.y,
      };

      updateNode(nodeId, {
        position,
        positionAbsolute: {
          x: node.positionAbsolute.x + diff.x,
          y: node.positionAbsolute.y + diff.y,
        },
      });

      if (onNodesChange) {
        onNodesChange([{ id: nodeId, type: 'position', position }]);
      }
    },
    [updateNode]
  );

  return { updateSelected, updatePosition };
}

export default useUpdateNode;
