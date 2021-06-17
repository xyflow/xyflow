import { useEffect } from 'react';

import { useStore, useStoreActions } from '../store/hooks';
import useKeyPress from './useKeyPress';
import { isNode, getConnectedEdges } from '../utils/graph';
import { Elements, KeyCode, ElementId, FlowElement } from '../types';

interface HookParams {
  deleteKeyCodes: KeyCode[];
  multiSelectionKeyCodes: KeyCode[];
  onElementsRemove?: (elements: Elements) => void;
}

export default ({ deleteKeyCodes, multiSelectionKeyCodes, onElementsRemove }: HookParams): void => {
  const store = useStore();

  const unsetNodesSelection = useStoreActions((actions) => actions.unsetNodesSelection);
  const setMultiSelectionActive = useStoreActions((actions) => actions.setMultiSelectionActive);
  const resetSelectedElements = useStoreActions((actions) => actions.resetSelectedElements);

  const deleteKeyPressed = useKeyPress(...deleteKeyCodes);
  const multiSelectionKeyPressed = useKeyPress(...multiSelectionKeyCodes);

  useEffect(() => {
    const { edges, selectedElements } = store.getState();

    if (onElementsRemove && deleteKeyPressed && selectedElements) {
      const selectedNodes = selectedElements.filter(isNode);
      const connectedEdges = getConnectedEdges(selectedNodes, edges);
      const elementsToRemove = [...selectedElements, ...connectedEdges].reduce(
        (res, item) => res.set(item.id, item),
        new Map<ElementId, FlowElement>()
      );

      onElementsRemove(Array.from(elementsToRemove.values()));
      unsetNodesSelection();
      resetSelectedElements();
    }
  }, [deleteKeyPressed]);

  useEffect(() => {
    setMultiSelectionActive(multiSelectionKeyPressed);
  }, [multiSelectionKeyPressed]);
};
