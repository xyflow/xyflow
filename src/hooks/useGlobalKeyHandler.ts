import { useEffect } from 'react';

import { useStoreState, useStoreActions } from '../store/hooks';
import useKeyPress from './useKeyPress';
import { isNode, getConnectedEdges } from '../utils/graph';
import { Elements } from '../types';

interface HookParams {
  deleteKeyCode: number;
  onElementsRemove?: (elements: Elements) => void;
}

export default ({ deleteKeyCode, onElementsRemove }: HookParams): void => {
  const selectedElements = useStoreState((state) => state.selectedElements);
  const edges = useStoreState((state) => state.edges);

  const unsetNodesSelection = useStoreActions((actions) => actions.unsetNodesSelection);
  const deleteKeyPressed = useKeyPress(deleteKeyCode);

  useEffect(() => {
    if (onElementsRemove && deleteKeyPressed && selectedElements) {
      let elementsToRemove = selectedElements;

      // we also want to remove the edges if only one node is selected
      if (selectedElements.length === 1 && isNode(selectedElements[0])) {
        const node = selectedElements[0];
        const connectedEdges = getConnectedEdges([node], edges);
        elementsToRemove = [...selectedElements, ...connectedEdges];
      }

      onElementsRemove(elementsToRemove);
      unsetNodesSelection();
    }
  }, [deleteKeyPressed]);
};
