import React, { memo, useContext } from 'react';
import cx from 'classnames';

import { Consumer } from '../NodeIdContext'
import { GraphContext } from '../../GraphContext';
import { setConnecting, setConnectionPos } from '../../state/actions';

function onDragStart(evt, nodeId, dispatch) {
  evt.dataTransfer.setData("text/plain", nodeId);

  // dispatch(setConnecting({ isConnecting: true, connectionSourceId: nodeId }));
}

function onDragStop(evt, dispatch) {
  // dispatch(setConnecting({ isConnecting: false }));
}

function onDrag(evt, dispatch) {
  // dispatch(setConnectionPos({ x: evt.clientX, y: evt.clientY }));
}

export default memo(({ source, target, ...rest }) => {
  const { dispatch } = useContext(GraphContext)
  const handleClasses = cx(
    'react-graph__handle',
    rest.className,
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
          onDragStart={evt => onDragStart(evt, nodeId, dispatch)}
          onDrag={evt => onDrag(evt, dispatch)}
          onDragEnd={evt => onDragStop(evt, dispatch)}
        />
      )}
    </Consumer>
  );
});
