import React, { memo, useContext } from 'react';
import cx from 'classnames';

import NodeIdContext from '../NodeIdContext'
import { GraphContext } from '../../GraphContext';
import { setConnecting, setConnectionPos } from '../../state/actions';

function onDragStart(evt, nodeId, dispatch) {
  evt.dataTransfer.setData('text/plain', nodeId);

  // dispatch(setConnecting({ isConnecting: true, connectionSourceId: nodeId }));
}

function onDragStop(evt, dispatch) {
  // dispatch(setConnecting({ isConnecting: false }));
}

function onDrag(evt, dispatch) {
  // dispatch(setConnectionPos({ x: evt.clientX, y: evt.clientY }));
}

export default memo(({ source, target, className = null, ...rest }) => {
  const nodeId = useContext(NodeIdContext);
  const { dispatch } = useContext(GraphContext);
  const handleClasses = cx(
    'react-graph__handle',
    className,
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
    <div
      draggable
      onDragStart={evt => onDragStart(evt, nodeId, dispatch)}
      onDragEnd={evt => onDragStop(evt, dispatch)}
      className={handleClasses}
      {...rest}
    />
  );
});
