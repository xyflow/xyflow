import { useEffect } from 'react';

import { useStore, useStoreActions, useStoreState } from '../store/hooks';
import useKeyPress from './useKeyPress';
import { isNode, isEdge, getConnectedEdges } from '../utils/graph';
import { KeyCode } from '../types';

interface HookParams {
  deleteKeyCode: KeyCode;
  multiSelectionKeyCode: KeyCode;
}

export default ({ deleteKeyCode, multiSelectionKeyCode }: HookParams): void => {
  const store = useStore();

  const unsetNodesSelection = useStoreActions((actions) => actions.unsetNodesSelection);
  const setMultiSelectionActive = useStoreActions((actions) => actions.setMultiSelectionActive);
  const resetSelectedElements = useStoreActions((actions) => actions.resetSelectedElements);
  const onNodesChange = useStoreState((state) => state.onNodesChange);
  const onEdgesChange = useStoreState((state) => state.onEdgesChange);

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
