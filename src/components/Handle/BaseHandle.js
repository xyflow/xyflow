import React, { memo } from 'react';
import cx from 'classnames';

function onMouseDown(evt, { nodeId, setSourceId, setPosition, onConnect, isTarget, isValidConnection }) {
  const containerBounds = document.querySelector('.react-flow').getBoundingClientRect();
  let recentHoveredHandle = null;

  setPosition({
    x: evt.clientX - containerBounds.x,
    y: evt.clientY - containerBounds.y,
  });
  setSourceId(nodeId);

  // checks if element below mouse is a handle and returns connection in form of an object { source: 123, target: 312 }
  function checkElementBelowIsValid(evt) {
    const elementBelow = document.elementFromPoint(evt.clientX, evt.clientY);
    const result = {
      elementBelow,
      isValid: false,
      connection: null,
      isHoveringHandle: false
    };

    if (elementBelow && (elementBelow.classList.contains('target') || elementBelow.classList.contains('source'))) {
      let connection = null;

      if (isTarget) {
        const sourceId = elementBelow.getAttribute('data-nodeid');
        connection = { source: sourceId, target: nodeId };
      } else {
        const targetId = elementBelow.getAttribute('data-nodeid');
        connection = { source: nodeId, target: targetId };
      }

      const isValid = isValidConnection(connection);

      result.connection = connection;
      result.isValid = isValid;
      result.isHoveringHandle = true;
    }

    return result;
  }

  function onMouseMove(evt) {
    setPosition({
      x: evt.clientX - containerBounds.x,
      y: evt.clientY - containerBounds.y,
    });

    const { connection, elementBelow, isValid, isHoveringHandle } = checkElementBelowIsValid(evt);

    if (!isHoveringHandle) {
      if (recentHoveredHandle) {
        recentHoveredHandle.classList.remove('valid');
        recentHoveredHandle.classList.remove('connecting');
      }
      return false;
    }

    const isOwnHandle = connection.source === connection.target;

    if (!isOwnHandle) {
      recentHoveredHandle = elementBelow;
      elementBelow.classList.add('connecting');
      elementBelow.classList.toggle('valid', isValid);
    }
  }

  function onMouseUp(evt) {
    const { connection, isValid } = checkElementBelowIsValid(evt);

    if (isValid) {
      onConnect(connection);
    }

    if (recentHoveredHandle) {
      recentHoveredHandle.classList.remove('valid');
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
  id = false, isValidConnection, ...rest
}) => {
  const isTarget = type === 'target';
  const handleClasses = cx(
    'react-flow__handle',
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
      onMouseDown={evt => onMouseDown(evt, {
        nodeId: nodeIdWithHandleId, setSourceId, setPosition,
        onConnect, isTarget, isValidConnection
      })}
      {...rest}
    />
  );
});

BaseHandle.displayName = 'BaseHandle';
BaseHandle.whyDidYouRender = false;

export default BaseHandle;
