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
  unsetNodesSelection: s.unsetNodesSelection,
  setMultiSelectionActive: s.setMultiSelectionActive,
  resetSelectedElements: s.resetSelectedElements,
  onNodesChange: s.onNodesChange,
  onEdgesChange: s.onEdgesChange,
});

export default ({ deleteKeyCode, multiSelectionKeyCode }: HookParams): void => {
  const store = useStoreApi();
  const { unsetNodesSelection, setMultiSelectionActive, resetSelectedElements, onNodesChange, onEdgesChange } =
    useStore(selector, shallow);

  const deleteKeyPressed = useKeyPress(deleteKeyCode);
  const multiSelectionKeyPressed = useKeyPress(multiSelectionKeyCode);

  useEffect(() => {
    const { nodes, edges } = store.getState();
    const selectedNodes = nodes.filter((n) => n.isSelected);
    const selectedEdges = edges.filter((e) => e.isSelected);

    if (deleteKeyPressed && (selectedNodes || selectedEdges)) {
      const connectedEdges = getConnectedEdges(selectedNodes, edges);

      const nodeChanges: NodeChange[] = selectedNodes.map((n) => ({ id: n.id, type: 'remove' }));
      const edgeChanges: EdgeChange[] = [...selectedEdges, ...connectedEdges].map((e) => ({
        id: e.id,
        type: 'remove',
      }));

      onNodesChange?.(nodeChanges);
      onEdgesChange?.(edgeChanges);

      unsetNodesSelection();
      resetSelectedElements();
    }
  }, [deleteKeyPressed, onNodesChange, onEdgesChange]);

  useEffect(() => {
    setMultiSelectionActive(multiSelectionKeyPressed);
  }, [multiSelectionKeyPressed]);
};
