import { useEffect } from 'react';
import shallow from 'zustand/shallow';

import { useStore, useStoreApi } from '../store';
import useKeyPress from './useKeyPress';
import { getConnectedEdges } from '../utils/graph';
import { EdgeChange, KeyCode, NodeChange, ReactFlowState } from '../types';

interface HookParams {
  deleteKeyCode: KeyCode;
  multiSelectionKeyCode: KeyCode;
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
    const { nodeInternals, edges, hasDefaultNodes, hasDefaultEdges } = store.getState();
    // @TODO: work with nodeInternals instead of converting it to an array
    const nodes = Array.from(nodeInternals).map(([_, node]) => node);
    const selectedNodes = nodes.filter((n) => n.selected);
    const selectedEdges = edges.filter((e) => e.selected);

    if (deleteKeyPressed && (selectedNodes || selectedEdges)) {
      const connectedEdges = getConnectedEdges(selectedNodes, edges);
      const edgeIdsToRemove = [...selectedEdges, ...connectedEdges].map((e) => e.id);

      if (hasDefaultNodes) {
        selectedNodes.forEach((node) => {
          nodeInternals.delete(node.id);
        });
      }

      if (hasDefaultEdges) {
        store.setState({
          nodeInternals: new Map(nodeInternals),
          edges: edges.filter((e) => !edgeIdsToRemove.includes(e.id)),
        });
      }

      if (onNodesChange) {
        const nodeChanges: NodeChange[] = selectedNodes.map((n) => ({ id: n.id, type: 'remove' }));
        onNodesChange(nodeChanges);
      }

      if (onEdgesChange) {
        const edgeChanges: EdgeChange[] = edgeIdsToRemove.map((id) => ({
          id,
          type: 'remove',
        }));

        onEdgesChange(edgeChanges);
      }

      store.setState({ nodesSelectionActive: false });

      resetSelectedElements();
    }
  }, [deleteKeyPressed, onNodesChange, onEdgesChange]);

  useEffect(() => {
    store.setState({ multiSelectionActive: multiSelectionKeyPressed });
  }, [multiSelectionKeyPressed]);
};
