import { useEffect } from 'react';
import shallow from 'zustand/shallow';

import { useStore, useStoreApi } from '../store';
import useKeyPress from './useKeyPress';
import { getConnectedEdges } from '../utils/graph';
import { EdgeChange, KeyCode, NodeChange, Node, ReactFlowState } from '../types';

interface HookParams {
  deleteKeyCode: KeyCode | null;
  multiSelectionKeyCode: KeyCode | null;
}

const selector = (s: ReactFlowState) => ({
  resetSelectedElements: s.resetSelectedElements,
  onNodesChange: s.onNodesChange,
  onEdgesChange: s.onEdgesChange,
});

export default ({ deleteKeyCode, multiSelectionKeyCode }: HookParams): void => {
  const store = useStoreApi();
  const { resetSelectedElements, onNodesChange, onEdgesChange } = useStore(selector, shallow);

  const deleteKeyPressed = useKeyPress(deleteKeyCode);
  const multiSelectionKeyPressed = useKeyPress(multiSelectionKeyCode);

  useEffect(() => {
    const { nodeInternals, edges, hasDefaultNodes, hasDefaultEdges, onNodesDelete, onEdgesDelete } = store.getState();
    const nodes = Array.from(nodeInternals.values());
    const nodesToRemove = nodes.reduce<Node[]>((res, node) => {
      if (!node.selected && node.parentNode && res.find((n) => n.id === node.parentNode)) {
        res.push(node);
      } else if (node.selected) {
        res.push(node);
      }

      return res;
    }, []);
    const selectedEdges = edges.filter((e) => e.selected);

    if (deleteKeyPressed && (nodesToRemove || selectedEdges)) {
      const connectedEdges = getConnectedEdges(nodesToRemove, edges);
      const edgesToRemove = [...selectedEdges, ...connectedEdges];
      const edgeIdsToRemove = edgesToRemove.map((e) => e.id);

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
          const edgeChanges: EdgeChange[] = edgeIdsToRemove.map((id) => ({
            id,
            type: 'remove',
          }));
          onEdgesChange(edgeChanges);
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

      resetSelectedElements();
    }
  }, [deleteKeyPressed, onNodesChange, onEdgesChange]);

  useEffect(() => {
    store.setState({ multiSelectionActive: multiSelectionKeyPressed });
  }, [multiSelectionKeyPressed]);
};
