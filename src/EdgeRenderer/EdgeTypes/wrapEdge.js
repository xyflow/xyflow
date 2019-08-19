import React, {  memo } from 'react';
import cx from 'classnames';

import { setSelectedElements } from '../../state/actions';
import { isInputNode } from '../../utils';

export default EdgeComponent => {
  const EdgeWrapper = memo((props) => {
    const {
      source, target, animated, type,
      dispatch, selected, onClick
    } = props;
    const edgeClasses = cx('react-graph__edge', { selected, animated });
    const onEdgeClick = (evt) => {
      if (isInputNode(evt)) {
        return false;
      }

      dispatch(setSelectedElements({ source, target }));
      onClick({ source, target, type });
    };

    return (
      <g
        className={edgeClasses}
        onClick={onEdgeClick}
      >
        <EdgeComponent {...props} />
      </g>
    );
  });

  EdgeWrapper.displayName = 'EdgeWrapper';
  EdgeWrapper.whyDidYouRender = false;

  return EdgeWrapper;
};
