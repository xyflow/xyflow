import type { MouseEvent as ReactMouseEvent } from 'react';
import { StoreApi } from 'zustand';

import { getHostForElement } from '../../utils';
import { ConnectionMode } from '../../types';
import type { OnConnect, Connection, HandleType, ReactFlowState } from '../../types';

type ValidConnectionFunc = (connection: Connection) => boolean;

type Result = {
  elementBelow: Element | null;
  isValid: boolean;
  connection: Connection;
  isHoveringHandle: boolean;
};

// checks if element below mouse is a handle and returns connection in form of an object { source: 123, target: 312 }
export function checkElementBelowIsValid(
  event: MouseEvent,
  connectionMode: ConnectionMode,
  isTarget: boolean,
  nodeId: string,
  handleId: string | null,
  isValidConnection: ValidConnectionFunc,
  doc: Document | ShadowRoot
) {
  const elementBelow = doc.elementFromPoint(event.clientX, event.clientY);
  const elementBelowIsTarget = elementBelow?.classList.contains('target') || false;
  const elementBelowIsSource = elementBelow?.classList.contains('source') || false;

  const result: Result = {
    elementBelow,
    isValid: false,
    connection: { source: null, target: null, sourceHandle: null, targetHandle: null },
    isHoveringHandle: false,
  };

  if (elementBelow && (elementBelowIsTarget || elementBelowIsSource)) {
    result.isHoveringHandle = true;

    const elementBelowNodeId = elementBelow.getAttribute('data-nodeid');
    const elementBelowHandleId = elementBelow.getAttribute('data-handleid');
    const connection: Connection = isTarget
      ? {
          source: elementBelowNodeId,
          sourceHandle: elementBelowHandleId,
          target: nodeId,
          targetHandle: handleId,
        }
      : {
          source: nodeId,
          sourceHandle: handleId,
          target: elementBelowNodeId,
          targetHandle: elementBelowHandleId,
        };

    result.connection = connection;

    // in strict mode we don't allow target to target or source to source connections
    const isValid =
      connectionMode === ConnectionMode.Strict
        ? (isTarget && elementBelowIsSource) || (!isTarget && elementBelowIsTarget)
        : elementBelowNodeId !== nodeId || elementBelowHandleId !== handleId;

    if (isValid) {
      result.isValid = isValidConnection(connection);
    }
  }

  return result;
}

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
  const reactFlowNode = (event.target as Element).closest('.react-flow');
  // when react-flow is used inside a shadow root we can't use document
  const doc = getHostForElement(event.target as HTMLElement);

  if (!doc) {
    return;
  }

  const elementBelow = doc.elementFromPoint(event.clientX, event.clientY);
  const elementBelowIsTarget = elementBelow?.classList.contains('target');
  const elementBelowIsSource = elementBelow?.classList.contains('source');

  if (!reactFlowNode || (!elementBelowIsTarget && !elementBelowIsSource && !elementEdgeUpdaterType)) {
    return;
  }

  const { onConnectStart, connectionMode } = getState();
  const handleType = elementEdgeUpdaterType ? elementEdgeUpdaterType : elementBelowIsTarget ? 'target' : 'source';
  const containerBounds = reactFlowNode.getBoundingClientRect();
  let recentHoveredHandle: Element;

  setState({
    connectionPosition: {
      x: event.clientX - containerBounds.left,
      y: event.clientY - containerBounds.top,
    },
    connectionNodeId: nodeId,
    connectionHandleId: handleId,
    connectionHandleType: handleType,
  });

  onConnectStart?.(event, { nodeId, handleId, handleType });

  function onMouseMove(event: MouseEvent) {
    setState({
      connectionPosition: {
        x: event.clientX - containerBounds.left,
        y: event.clientY - containerBounds.top,
      },
    });

    const { connection, elementBelow, isValid, isHoveringHandle } = checkElementBelowIsValid(
      event,
      connectionMode,
      isTarget,
      nodeId,
      handleId,
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

  function onMouseUp(event: MouseEvent) {
    const { connection, isValid } = checkElementBelowIsValid(
      event,
      connectionMode,
      isTarget,
      nodeId,
      handleId,
      isValidConnection,
      doc
    );

    if (isValid) {
      onConnect?.(connection);
    }

    getState().onConnectEnd?.(event);

    if (elementEdgeUpdaterType && onEdgeUpdateEnd) {
      onEdgeUpdateEnd(event);
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
