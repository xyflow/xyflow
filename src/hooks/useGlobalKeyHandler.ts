import { useEffect } from 'react';

import { useStoreState, useStoreActions } from '../store/hooks';
import useKeyPress from './useKeyPress';
import { isEdge, getConnectedEdges } from '../utils/graph';
import { Elements, Node } from '../types';

interface HookParams {
  deleteKeyCode: number;
  onElementsRemove?: (elements: Elements) => void;
}

export default ({ deleteKeyCode, onElementsRemove }: HookParams): void => {
  const state = useStoreState((s) => ({
    selectedElements: s.selectedElements,
    edges: s.edges,
  }));
  const setNodesSelection = useStoreActions((a) => a.setNodesSelection);
  const deleteKeyPressed = useKeyPress(deleteKeyCode);

  useEffect(() => {
    if (onElementsRemove && deleteKeyPressed && state.selectedElements) {
      let elementsToRemove = state.selectedElements;

      // we also want to remove the edges if only one node is selected
      if (state.selectedElements.length === 1 && !isEdge(state.selectedElements[0])) {
        const node = (state.selectedElements[0] as unknown) as Node;
        const connectedEdges = getConnectedEdges([node], state.edges);
        elementsToRemove = [...state.selectedElements, ...connectedEdges];
      }

      onElementsRemove(elementsToRemove);
      setNodesSelection({ isActive: false });
    }
  }, [deleteKeyPressed]);
};
