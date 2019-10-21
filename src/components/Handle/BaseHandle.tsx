import React, { memo, MouseEvent as ReactMouseEvent } from 'react';
import cx from 'classnames';

import {
  HandleType,
  ElementId,
  Position,
  XYPosition,
  OnConnectFunc,
  Connection,
} from '../../types';

type ValidConnectionFunc = (connection: Connection) => boolean;
type SetSourceIdFunc = (nodeId: ElementId | null) => void;

interface BaseHandleProps {
  type: HandleType;
  nodeId: ElementId;
  onConnect: OnConnectFunc;
  position: Position;
  setSourceId: SetSourceIdFunc;
  setPosition: (pos: XYPosition) => void;
  isValidConnection: ValidConnectionFunc;
  id?: ElementId | boolean;
  className?: string;
}

type Result = {
  elementBelow: Element | null;
  isValid: boolean;
  connection: Connection;
  isHoveringHandle: boolean;
};

function onMouseDown(
  evt: ReactMouseEvent,
  nodeId: ElementId,
  setSourceId: SetSourceIdFunc,
  setPosition: (pos: XYPosition) => any,
  onConnect: OnConnectFunc,
  isTarget: boolean,
  isValidConnection: ValidConnectionFunc
): void {
  const reactFlowNode = document.querySelector('.react-flow');

  if (!reactFlowNode) {
    return;
  }

  const containerBounds = reactFlowNode.getBoundingClientRect();
  let recentHoveredHandle: Element;

  setPosition({
    x: evt.clientX - containerBounds.left,
    y: evt.clientY - containerBounds.top,
  });
  setSourceId(nodeId);

  function resetRecentHandle(): void {
    if (!recentHoveredHandle) {
      return;
    }

    recentHoveredHandle.classList.remove('valid');
    recentHoveredHandle.classList.remove('connecting');
  }

  // checks if element below mouse is a handle and returns connection in form of an object { source: 123, target: 312 }
  function checkElementBelowIsValid(evt: MouseEvent) {
    const elementBelow = document.elementFromPoint(evt.clientX, evt.clientY);

    const result: Result = {
      elementBelow,
      isValid: false,
      connection: { source: null, target: null },
      isHoveringHandle: false,
    };

    if (
      elementBelow &&
      (elementBelow.classList.contains('target') ||
        elementBelow.classList.contains('source'))
    ) {
      let connection: Connection = { source: null, target: null };

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

  function onMouseMove(evt: MouseEvent) {
    setPosition({
      x: evt.clientX - containerBounds.left,
      y: evt.clientY - containerBounds.top,
    });

    const {
      connection,
      elementBelow,
      isValid,
      isHoveringHandle,
    } = checkElementBelowIsValid(evt);

    if (!isHoveringHandle) {
      return resetRecentHandle();
    }

    const isOwnHandle = connection.source === connection.target;

    if (!isOwnHandle && elementBelow) {
      recentHoveredHandle = elementBelow;
      elementBelow.classList.add('connecting');
      elementBelow.classList.toggle('valid', isValid);
    }
  }

  function onMouseUp(evt: MouseEvent) {
    const { connection, isValid } = checkElementBelowIsValid(evt);

    if (isValid) {
      onConnect(connection);
    }

    resetRecentHandle();
    setSourceId(null);

    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  }

  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup', onMouseUp);
}

const BaseHandle = memo(
  ({
    type,
    nodeId,
    onConnect,
    position,
    setSourceId,
    setPosition,
    className,
    id = false,
    isValidConnection,
    ...rest
  }: BaseHandleProps) => {
    const isTarget = type === 'target';
    const handleClasses = cx('react-flow__handle', className, position, {
      source: !isTarget,
      target: isTarget,
    });

    const nodeIdWithHandleId = id ? `${nodeId}__${id}` : nodeId;

    return (
      <div
        data-nodeid={nodeIdWithHandleId}
        data-handlepos={position}
        className={handleClasses}
        onMouseDown={evt =>
          onMouseDown(
            evt,
            nodeIdWithHandleId,
            setSourceId,
            setPosition,
            onConnect,
            isTarget,
            isValidConnection
          )
        }
        {...rest}
      />
    );
  }
);

BaseHandle.displayName = 'BaseHandle';

export default BaseHandle;
