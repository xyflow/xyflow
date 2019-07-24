import { useEffect, useContext } from 'react';

import { useKeyPress } from '../hooks';
import { setNodesSelection } from '../state/actions';
import { GraphContext } from '../GraphContext';

export default (props) => {
  const { state, dispatch } = useContext(GraphContext);
  const removePressed = useKeyPress('Backspace');

  useEffect(() => {
    if (removePressed && state.selectedElements.length) {
      props.onElementsRemove(state.selectedElements);
      dispatch(setNodesSelection({ isActive: false }));
    }
  }, [removePressed])

  return null;
}