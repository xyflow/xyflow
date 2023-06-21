import type { MouseEvent as ReactMouseEvent, TouchEvent as ReactTouchEvent } from 'react';
import { StoreApi } from 'zustand';

import { getHostForElement, calcAutoPan, getEventPosition } from '../../utils';
import type { OnConnect, HandleType, ReactFlowState, Connection } from '../../types';
import { pointToRendererPoint, rendererPointToPoint } from '../../utils/graph';
import {
  ConnectionHandle,
  getClosestHandle,
  getConnectionStatus,
  getHandleLookup,
  getHandleType,
  isValidHandle,
  resetRecentHandle,
  ValidConnectionFunc,
} from './utils';

export function handlePointerDown({
  event,
  handleId,
  nodeId,
  onConnect,
  isTarget,
  getState,
  setState,
  isValidConnection,
  edgeUpdaterType,
  onEdgeUpdateEnd,
}: {
  event: ReactMouseEvent | ReactTouchEvent;
  handleId: string | null;
  nodeId: string;
  onConnect: OnConnect;
  isTarget: boolean;
  getState: StoreApi<ReactFlowState>['getState'];
  setState: StoreApi<ReactFlowState>['setState'];
  isValidConnection: ValidConnectionFunc;
  edgeUpdaterType?: HandleType;
  onEdgeUpdateEnd?: (evt: MouseEvent | TouchEvent) => void;
}): void {
  // when react-flow is used inside a shadow root we can't use document
  const doc = getHostForElement(event.target as HTMLElement);
  const {
    connectionMode,
    domNode,
    autoPanOnConnect,
    connectionRadius,
    onConnectStart,
    panBy,
    getNodes,
    cancelConnection,
  } = getState();
  let autoPanId = 0;
  let closestHandle: ConnectionHandle | null;

  const { x, y } = getEventPosition(event);
  const clickedHandle = doc?.elementFromPoint(x, y);
  const handleType = getHandleType(edgeUpdaterType, clickedHandle);
  const containerBounds = domNode?.getBoundingClientRect();

  if (!containerBounds || !handleType) {
    return;
  }

  let prevActiveHandle: Element;
  let connectionPosition = getEventPosition(event, containerBounds);
  let autoPanStarted = false;
  let connection: Connection | null = null;
  let isValid = false;
  let handleDomNode: Element | null = null;

  const handleLookup = getHandleLookup({
    nodes: getNodes(),
    nodeId,
    handleId,
    handleType,
  });

  // when the user is moving the mouse close to the edge of the canvas while connecting we move the canvas
  const autoPan = (): void => {
    if (!autoPanOnConnect) {
      return;
    }
    const [xMovement, yMovement] = calcAutoPan(connectionPosition, containerBounds);

    panBy({ x: xMovement, y: yMovement });
    autoPanId = requestAnimationFrame(autoPan);
  };

  setState({
    connectionPosition,
    connectionStatus: null,
    // connectionNodeId etc will be removed in the next major in favor of connectionStartHandle
    connectionNodeId: nodeId,
    connectionHandleId: handleId,
    connectionHandleType: handleType,
    connectionStartHandle: {
      nodeId,
      handleId,
      type: handleType,
    },
    connectionEndHandle: null,
  });

  onConnectStart?.(event, { nodeId, handleId, handleType });

  function onPointerMove(event: MouseEvent | TouchEvent) {
    const { transform } = getState();

    connectionPosition = getEventPosition(event, containerBounds);

    const { handle, validHandleResult } = getClosestHandle(
      event,
      doc,
      pointToRendererPoint(connectionPosition, transform, false, [1, 1]),
      connectionRadius,
      handleLookup,
      (handle) =>
        isValidHandle(handle, connectionMode, nodeId, handleId, isTarget ? 'target' : 'source', isValidConnection, doc)
    );

    closestHandle = handle;

    if (!autoPanStarted) {
      autoPan();
      autoPanStarted = true;
    }

    handleDomNode = validHandleResult.handleDomNode;
    connection = validHandleResult.connection;
    isValid = validHandleResult.isValid;

    setState({
      connectionPosition:
        closestHandle && isValid
          ? rendererPointToPoint(
              {
                x: closestHandle.x,
                y: closestHandle.y,
              },
              transform
            )
          : connectionPosition,
      connectionStatus: getConnectionStatus(!!closestHandle, isValid),
      connectionEndHandle: validHandleResult.endHandle,
    });

    if (!closestHandle && !isValid && !handleDomNode) {
      return resetRecentHandle(prevActiveHandle);
    }

    if (connection.source !== connection.target && handleDomNode) {
      resetRecentHandle(prevActiveHandle);
      prevActiveHandle = handleDomNode;
      // @todo: remove the old class names "react-flow__handle-" in the next major version
      handleDomNode.classList.add('connecting', 'react-flow__handle-connecting');
      handleDomNode.classList.toggle('valid', isValid);
      handleDomNode.classList.toggle('react-flow__handle-valid', isValid);
    }
  }

  function onPointerUp(event: MouseEvent | TouchEvent) {
    if ((closestHandle || handleDomNode) && connection && isValid) {
      onConnect?.(connection);
    }

    // it's important to get a fresh reference from the store here
    // in order to get the latest state of onConnectEnd
    getState().onConnectEnd?.(event);

    if (edgeUpdaterType) {
      onEdgeUpdateEnd?.(event);
    }

    resetRecentHandle(prevActiveHandle);
    cancelConnection();
    cancelAnimationFrame(autoPanId);
    autoPanStarted = false;
    isValid = false;
    connection = null;
    handleDomNode = null;

    doc.removeEventListener('mousemove', onPointerMove as EventListener);
    doc.removeEventListener('mouseup', onPointerUp as EventListener);

    doc.removeEventListener('touchmove', onPointerMove as EventListener);
    doc.removeEventListener('touchend', onPointerUp as EventListener);
  }

  doc.addEventListener('mousemove', onPointerMove as EventListener);
  doc.addEventListener('mouseup', onPointerUp as EventListener);

  doc.addEventListener('touchmove', onPointerMove as EventListener);
  doc.addEventListener('touchend', onPointerUp as EventListener);
}
