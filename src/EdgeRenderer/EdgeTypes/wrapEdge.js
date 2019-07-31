import React, {  memo } from 'react';
import cx from 'classnames';

import { setSelectedElements } from '../../state/actions';
import { isEdge } from '../../graph-utils';

const isInput = e => ['INPUT', 'SELECT', 'TEXTAREA'].includes(e.target.nodeName);

export default EdgeComponent => {
  const WrappedEdge = memo((props) => {
    const {
      source, target, animated, type,
      dispatch, selectedElements, onClick
    } = props;
    const selected = selectedElements
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

  WrappedEdge.displayName = 'Wrapped Edge';
  WrappedEdge.whyDidYouRender = false;

  return WrappedEdge;
};
