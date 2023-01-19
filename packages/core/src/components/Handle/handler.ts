import type { MouseEvent as ReactMouseEvent } from 'react';
import { StoreApi } from 'zustand';

import { getHostForElement, calcAutoPanVelocity } from '../../utils';
import type { OnConnect, HandleType, ReactFlowState } from '../../types';
import { pointToRendererPoint, rendererPointToPoint } from '../../utils/graph';
import { ConnectionHandle, getClosestHandle, getHandleLookup, isValidHandle, ValidConnectionFunc } from './utils';

function resetRecentHandle(hoveredHandle: Element): void {
  hoveredHandle?.classList.remove('react-flow__handle-valid');
  hoveredHandle?.classList.remove('react-flow__handle-connecting');
}

export function handleMouseDown({
  event,
  handleId,
  nodeId,
  onConnect,
  isTarget,
  getState,
  setState,
  isValidConnection,
  elementEdgeUpdaterType,
  onEdgeUpdateEnd,
}: {
  event: ReactMouseEvent;
  handleId: string | null;
  nodeId: string;
  onConnect: OnConnect;
  isTarget: boolean;
  getState: StoreApi<ReactFlowState>['getState'];
  setState: StoreApi<ReactFlowState>['setState'];
  isValidConnection: ValidConnectionFunc;
  elementEdgeUpdaterType?: HandleType;
  onEdgeUpdateEnd?: (evt: MouseEvent) => void;
}): void {
  // when react-flow is used inside a shadow root we can't use document
  const doc = getHostForElement(event.target as HTMLElement);
  const { connectionMode, domNode, autoPanOnConnect, connectionRadius, onConnectStart, onConnectEnd, panBy, getNodes } =
    getState();
  let autoPanId = 0;
  let prevClosestHandle: ConnectionHandle | undefined;

  const clickedElement = doc?.elementFromPoint(event.clientX, event.clientY);
  const elementIsTarget = clickedElement?.classList.contains('target');
  const elementIsSource = clickedElement?.classList.contains('source');

  if (!domNode || (!elementIsTarget && !elementIsSource && !elementEdgeUpdaterType)) {
    return;
  }

  const handleType = elementEdgeUpdaterType ? elementEdgeUpdaterType : elementIsTarget ? 'target' : 'source';
  const containerBounds = domNode.getBoundingClientRect();
  let recentHoveredHandle: Element;
  let connectionPosition = {
    x: event.clientX - containerBounds.left,
    y: event.clientY - containerBounds.top,
  };

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
    const xMovement = calcAutoPanVelocity(connectionPosition.x, 35, containerBounds.width - 35) * 20;
    const yMovement = calcAutoPanVelocity(connectionPosition.y, 35, containerBounds.height - 35) * 20;

    panBy({ x: xMovement, y: yMovement });
    autoPanId = requestAnimationFrame(autoPan);
  };

  autoPan();

  setState({
    connectionPosition,
    connectionNodeId: nodeId,
    connectionHandleId: handleId,
    connectionHandleType: handleType,
  });

  onConnectStart?.(event, { nodeId, handleId, handleType });

  function onMouseMove(event: MouseEvent) {
    const { transform } = getState();

    connectionPosition = {
      x: event.clientX - containerBounds.left,
      y: event.clientY - containerBounds.top,
    };

    prevClosestHandle = getClosestHandle(
      pointToRendererPoint(connectionPosition, transform, false, [1, 1]),
      connectionRadius,
      handleLookup
    );

    setState({
      connectionPosition: prevClosestHandle
        ? rendererPointToPoint(
            {
              x: prevClosestHandle.absX + prevClosestHandle.width / 2,
              y: prevClosestHandle.absY + prevClosestHandle.height / 2,
            },
            transform
          )
        : connectionPosition,
    });

    if (prevClosestHandle) {
      const { connection, elementBelow, isValid, isHoveringHandle } = isValidHandle(
        prevClosestHandle,
        connectionMode,
        nodeId,
        handleId,
        isTarget ? 'target' : 'source',
        isValidConnection,
        doc
      );

      if (!isHoveringHandle) {
        return resetRecentHandle(recentHoveredHandle);
      }

      if (connection.source !== connection.target && elementBelow) {
        resetRecentHandle(recentHoveredHandle);
        recentHoveredHandle = elementBelow;
        elementBelow.classList.add('react-flow__handle-connecting');
        elementBelow.classList.toggle('react-flow__handle-valid', isValid);
      }
    }
  }

  function onMouseUp(event: MouseEvent) {
    cancelAnimationFrame(autoPanId);

    if (prevClosestHandle) {
      const { connection, isValid } = isValidHandle(
        prevClosestHandle,
        connectionMode,
        nodeId,
        handleId,
        isTarget ? 'target' : 'source',
        isValidConnection,
        doc
      );

      if (isValid) {
        onConnect?.(connection);
      }
    }

    onConnectEnd?.(event);

    if (elementEdgeUpdaterType) {
      onEdgeUpdateEnd?.(event);
    }

    resetRecentHandle(recentHoveredHandle);
    setState({
      connectionNodeId: null,
      connectionHandleId: null,
      connectionHandleType: null,
    });

    doc.removeEventListener('mousemove', onMouseMove as EventListenerOrEventListenerObject);
    doc.removeEventListener('mouseup', onMouseUp as EventListenerOrEventListenerObject);
  }

  doc.addEventListener('mousemove', onMouseMove as EventListenerOrEventListenerObject);
  doc.addEventListener('mouseup', onMouseUp as EventListenerOrEventListenerObject);
}
