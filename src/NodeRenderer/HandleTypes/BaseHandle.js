import React, { memo } from 'react';
import cx from 'classnames';

import { Consumer } from '../NodeIdContext'

function onDragStart(evt, nodeId) {
  evt.dataTransfer.setData("text/plain", nodeId);
}

export default memo(({ source, target, ...rest }) => {
  const handleClasses = cx(
    'react-graph__handle',
    { source, target }
  );

  if (target) {
    return (
      <div
        className={handleClasses}
        {...rest}
      />
    )
  }

  return (
    <Consumer>
      {nodeId => (
        <div
          className={handleClasses}
          {...rest}
          draggable
          onDragStart={evt => onDragStart(evt, nodeId)}
        />
      )}
    </Consumer>
  );
});
