import { useEffect, useContext } from 'react';

import { useKeyPress } from '../hooks';
import { setNodesSelection } from '../state/actions';
import { GraphContext } from '../GraphContext';
import { isEdge, getConnectedEdges } from '../graph-utils';

export default (props) => {
  const { state, dispatch } = useContext(GraphContext);
  const removePressed = useKeyPress('Backspace');

  useEffect(() => {
    if (removePressed && state.selectedElements.length) {
      let elementsToRemove = state.selectedElements;

      // we also want to remove the edges if only one node is selected
      if (state.selectedElements.length === 1 && !isEdge(state.selectedElements[0])) {
        const connectedEdges = getConnectedEdges(state.selectedElements, state.edges);
        elementsToRemove = [...state.selectedElements, ...connectedEdges];
      }

      props.onElementsRemove(elementsToRemove);
      dispatch(setNodesSelection({ isActive: false }));
    }
  }, [removePressed])

  return null;
};
