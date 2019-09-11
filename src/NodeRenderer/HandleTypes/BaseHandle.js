import React, { memo } from 'react';
import cx from 'classnames';

function onMouseDown(evt, { nodeId, setSourceId, setPosition, onConnect, isTarget }) {
  const containerBounds = document.querySelector('.react-graph').getBoundingClientRect();

  setPosition({
    x: evt.clientX - containerBounds.x,
    y: evt.clientY - containerBounds.y,
  });
  setSourceId(nodeId);

  function onMouseMove(evt) {
    setPosition({
      x: evt.clientX - containerBounds.x,
      y: evt.clientY - containerBounds.y,
    });
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

    setSourceId(null);
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  }

  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup', onMouseUp)
}

const BaseHandle = memo(({
  type, nodeId, onConnect, position,
  setSourceId, setPosition, className,
  id = false, ...rest
}) => {
  const isTarget = type === 'target';
  const handleClasses = cx(
    'react-graph__handle',
    className,
    position,
    { source: !isTarget, target: isTarget }
  );

  const nodeIdWithHandleId = id ? `${nodeId}__${id}` : nodeId;

  return (
    <div
      data-nodeid={nodeIdWithHandleId}
      data-handlepos={position}
      className={handleClasses}
      onMouseDown={evt => onMouseDown(evt, { nodeId: nodeIdWithHandleId, setSourceId, setPosition, onConnect, isTarget })}
      {...rest}
    />
  );
});

BaseHandle.displayName = 'BaseHandle';
BaseHandle.whyDidYouRender = false;

export default BaseHandle;
