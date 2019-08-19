import React, {  memo } from 'react';
import cx from 'classnames';

import { setSelectedElements } from '../../state/actions';
import { isInputNode } from '../../utils';

export default EdgeComponent => {
  const WrappedEdge = memo((props) => {
    const {
      source, target, animated, type,
      dispatch, selected, onClick
    } = props;
    const edgeClasses = cx('react-graph__edge', { selected, animated: animated });

    return (
      <g
        className={edgeClasses}
        onClick={(e) => {
          if (isInputNode(e)) {
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
