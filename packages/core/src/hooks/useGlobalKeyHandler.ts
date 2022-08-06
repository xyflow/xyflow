import { useEffect } from 'react';

import { useStoreApi } from '../hooks/useStore';
import useKeyPress from './useKeyPress';
import { getConnectedEdges } from '../utils/graph';
import { KeyCode, NodeChange, Node } from '../types';

interface HookParams {
  deleteKeyCode: KeyCode | null;
  multiSelectionKeyCode: KeyCode | null;
}

export default ({ deleteKeyCode, multiSelectionKeyCode }: HookParams): void => {
  const store = useStoreApi();

  const deleteKeyPressed = useKeyPress(deleteKeyCode);
  const multiSelectionKeyPressed = useKeyPress(multiSelectionKeyCode);

  useEffect(() => {
    if (!deleteKeyPressed) {
      return;
    }

    const {
      nodeInternals,
      edges,
      hasDefaultNodes,
      hasDefaultEdges,
      onNodesDelete,
      onEdgesDelete,
      onNodesChange,
      onEdgesChange,
    } = store.getState();
    const nodes = Array.from(nodeInternals.values());
    const nodesToRemove = nodes.reduce<Node[]>((res, node) => {
      const parentSelected = !node.selected && node.parentNode && res.find((n) => n.id === node.parentNode);
      if (node.selected || parentSelected) {
        res.push(node);
      }

      return res;
    }, []);
    const selectedEdges = edges.filter((e) => e.selected);

    if (nodesToRemove || selectedEdges) {
      const connectedEdges = getConnectedEdges(nodesToRemove, edges);
      const edgesToRemove = [...selectedEdges, ...connectedEdges];
      const edgeIdsToRemove = edgesToRemove.reduce<string[]>((res, edge) => {
        if (!res.includes(edge.id)) {
          res.push(edge.id);
        }
        return res;
      }, []);

      if (hasDefaultEdges || hasDefaultNodes) {
        if (hasDefaultEdges) {
          store.setState({
            edges: edges.filter((e) => !edgeIdsToRemove.includes(e.id)),
          });
        }

        if (hasDefaultNodes) {
          nodesToRemove.forEach((node) => {
            nodeInternals.delete(node.id);
          });

          store.setState({
            nodeInternals: new Map(nodeInternals),
          });
        }
      }

      if (edgeIdsToRemove.length > 0) {
        onEdgesDelete?.(edgesToRemove);

        if (onEdgesChange) {
          onEdgesChange(
            edgeIdsToRemove.map((id) => ({
              id,
              type: 'remove',
            }))
          );
        }
      }

      if (nodesToRemove.length > 0) {
        onNodesDelete?.(nodesToRemove);

        if (onNodesChange) {
          const nodeChanges: NodeChange[] = nodesToRemove.map((n) => ({ id: n.id, type: 'remove' }));
          onNodesChange(nodeChanges);
        }
      }

      store.setState({ nodesSelectionActive: false });
    }
  }, [deleteKeyPressed]);

  useEffect(() => {
    store.setState({ multiSelectionActive: multiSelectionKeyPressed });
  }, [multiSelectionKeyPressed]);
};
