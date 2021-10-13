import { useEffect } from 'react';

import { useStore, useStoreApi } from '../store';
import useKeyPress from './useKeyPress';
import { isNode, isEdge, getConnectedEdges } from '../utils/graph';
import { KeyCode, ReactFlowState } from '../types';

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
    useStore(selector);

  const deleteKeyPressed = useKeyPress(deleteKeyCode);
  const multiSelectionKeyPressed = useKeyPress(multiSelectionKeyCode);

  useEffect(() => {
    const { edges, selectedElements } = store.getState();

    if (deleteKeyPressed && selectedElements) {
      const selectedNodes = selectedElements.filter(isNode);
      const selectedEdges = selectedElements.filter(isEdge);
      const connectedEdges = getConnectedEdges(selectedNodes, edges);

      const nodeChanges = selectedNodes.map((n) => ({ id: n.id, delete: true }));
      const edgeChanges = [...selectedEdges, ...connectedEdges].map((e) => ({ id: e.id, delete: true }));

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
