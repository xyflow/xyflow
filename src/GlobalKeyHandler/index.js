import { useEffect, memo } from 'react';
import { useStoreState, useStoreActions } from 'easy-peasy';

import useKeyPress from '../hooks/useKeyPress';
import { isEdge, getConnectedEdges } from '../graph-utils';

export default memo(({ deleteKey, onElementsRemove }) => {
  const state = useStoreState(s => ({ selectedElements: s.selectedElements, edges: s.edges }))
  const setNodesSelection = useStoreActions(a => a.setNodesSelection);
  const removePressed = useKeyPress(deleteKey);

  useEffect(() => {
    if (removePressed && state.selectedElements.length) {
      let elementsToRemove = state.selectedElements;

      // we also want to remove the edges if only one node is selected
      if (state.selectedElements.length === 1 && !isEdge(state.selectedElements[0])) {
        const connectedEdges = getConnectedEdges(state.selectedElements, state.edges);
        elementsToRemove = [...state.selectedElements, ...connectedEdges];
      }

      onElementsRemove(elementsToRemove);
      setNodesSelection({ isActive: false });
    }
  }, [removePressed])

  return null;
});
