import React, { memo, useContext } from 'react';
import cx from 'classnames';

import NodeIdContext from '../NodeIdContext'
import { GraphContext } from '../../GraphContext';
import { setConnecting, setConnectionPos } from '../../state/actions';

function onMouseDown(evt, { nodeId, dispatch, onConnect, isTarget }) {
  const containerBounds = document.querySelector('.react-graph').getBoundingClientRect();
  const connectionPosition = { x: evt.clientX - containerBounds.x, y: evt.clientY - containerBounds.y };
  dispatch(setConnecting({ connectionPosition, connectionSourceId: nodeId }))

  function onMouseMove(evt) {
    dispatch(setConnectionPos({ x: evt.clientX - containerBounds.x, y: evt.clientY - containerBounds.y }));
  }

  function onMouseUp(evt) {
    const elementBelow = document.elementFromPoint(evt.clientX, evt.clientY);

    if (elementBelow && (elementBelow.classList.contains('target') || elementBelow.classList.contains('source'))) {
      if (isTarget) {
        const sourceId = elementBelow.getAttribute('data-nodeid');
        onConnect({ source: sourceId, target: nodeId });
      } else {
        const targetId = elementBelow.getAttribute('data-nodeid');
        onConnect({ source: nodeId, target: targetId });
      }

    }

    dispatch(setConnecting({ connectionSourceId: false }));
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  }

  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup', onMouseUp)
}

export default memo(({ source, target, className = null, ...rest }) => {
  const nodeId = useContext(NodeIdContext);
  const { dispatch, onConnect } = useContext(GraphContext);
  const handleClasses = cx(
    'react-graph__handle',
    className,
    { source, target }
  );

  return (
    <div
      data-nodeid={nodeId}
      className={handleClasses}
      onMouseDown={evt => onMouseDown(evt, { nodeId, dispatch, onConnect, isTarget: target })}
      {...rest}
    />
  );
});
