import React, {  memo } from 'react';
import cx from 'classnames';

import { isInputNode } from '../../utils';
import store from '../../store';

export default EdgeComponent => {
  const EdgeWrapper = memo((props) => {
    const {
      source, target, animated, type,
      selected, onClick
    } = props;
    const edgeClasses = cx('react-graph__edge', { selected, animated });
    const onEdgeClick = (evt) => {
      if (isInputNode(evt)) {
        return false;
      }

      store.dispatch.setSelectedElements({ source, target });
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
