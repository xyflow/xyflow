import React, { useContext, memo } from 'react';
import cx from 'classnames';

import { GraphContext } from '../../GraphContext';
import { setSelectedElements } from '../../state/actions';
import { isEdge } from '../../graph-utils';

const isInput = e => ['INPUT', 'SELECT', 'TEXTAREA'].includes(e.target.nodeName);

export default EdgeComponent => memo((props) => {
  const { state, dispatch } = useContext(GraphContext);
  const { source, target, animated, type, onClick } = props;
  const selected = state.selectedElements
    .filter(e => isEdge(e))
    .find(e => e.source === source && e.target === target);
  const edgeClasses = cx('react-graph__edge', { selected, animated: animated });

  return (
    <g
      className={edgeClasses}
      onClick={(e) => {
        if (isInput(e)) {
          return false;
        }

        dispatch(setSelectedElements({ source, target }));
        onClick({ source, target, type });
      }}
    >
      <EdgeComponent {...props} />
    </g>
  );
});
