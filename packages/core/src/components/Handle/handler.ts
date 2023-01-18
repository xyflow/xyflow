import type { MouseEvent as ReactMouseEvent } from 'react';
import { StoreApi } from 'zustand';

import { getHostForElement, calcAutoPanVelocity, internalsSymbol } from '../../utils';
import { ConnectionMode, Node, NodeHandleBounds } from '../../types';
import type { OnConnect, Connection, HandleType, ReactFlowState, XYPosition } from '../../types';
import { pointToRendererPoint, rendererPointToPoint } from '../../utils/graph';

type ValidConnectionFunc = (connection: Connection) => boolean;

type Result = {
  elementBelow: Element | null;
  isValid: boolean;
  connection: Connection;
  isHoveringHandle: boolean;
};

// checks if element below mouse is a handle and returns connection in form of an object { source: 123, target: 312 }
export function isHandleValid(
  handle: Pick<ConnectionHandle, 'nodeId' | 'id' | 'type'> | undefined,
  connectionMode: ConnectionMode,
  fromNodeId: string,
  fromHandleId: string | null,
  fromType: string,
  isValidConnection: ValidConnectionFunc,
  doc: Document | ShadowRoot
) {
  const result: Result = {
    elementBelow: null,
    isValid: false,
    connection: { source: null, target: null, sourceHandle: null, targetHandle: null },
    isHoveringHandle: false,
  };
  const isTarget = fromType === 'target';

  if (handle) {
    const elementBelow = doc.querySelector(
      `.react-flow__handle[data-id="${handle?.nodeId}-${handle?.id}-${handle?.type}"]`
    );

    if (elementBelow) {
      const elementBelowIsTarget = handle.type === 'target';
      const elementBelowIsSource = handle.type === 'source';
      result.isHoveringHandle = true;

      const elementBelowNodeId = elementBelow.getAttribute('data-nodeid');
      const elementBelowHandleId = elementBelow.getAttribute('data-handleid');
      const connection: Connection = isTarget
        ? {
            source: handle.nodeId,
            sourceHandle: handle.id,
            target: fromNodeId,
            targetHandle: fromHandleId,
          }
        : {
            source: fromNodeId,
            sourceHandle: fromHandleId,
            target: handle.nodeId,
            targetHandle: handle.id,
          };

      result.connection = connection;

      // in strict mode we don't allow target to target or source to source connections
      const isValid =
        connectionMode === ConnectionMode.Strict
          ? (isTarget && elementBelowIsSource) || (!isTarget && elementBelowIsTarget)
          : elementBelowNodeId !== handle.nodeId || elementBelowHandleId !== handle.id;

      if (isValid) {
        result.isValid = isValidConnection(connection);
      }
    }
  }

  return result;
}

function resetRecentHandle(hoveredHandle: Element): void {
  hoveredHandle?.classList.remove('react-flow__handle-valid');
  hoveredHandle?.classList.remove('react-flow__handle-connecting');
}

type ConnectionHandle = {
  id: string | null;
  type: HandleType;
  nodeId: string;
  absX: number;
  absY: number;
  width: number;
  height: number;
};

function getHandles(
  node: Node,
  handleBounds: NodeHandleBounds,
  type: HandleType,
  currentHandle: string
): ConnectionHandle[] {
  return (handleBounds[type] || []).reduce<ConnectionHandle[]>((res, h) => {
    if (`${node.id}-${h.id}-${type}` !== currentHandle) {
      res.push({
        id: h.id || null,
        type,
        nodeId: node.id,
        absX: (node.positionAbsolute?.x ?? 0) + h.x,
        absY: (node.positionAbsolute?.y ?? 0) + h.y,
        width: h.width,
        height: h.height,
      });
    }
    return res;
  }, []);
}

function getClosestHandle(pos: XYPosition, connectionRadius: number, handles: ConnectionHandle[]) {
  let closestHandle: ConnectionHandle | undefined;
  let minDistance = Infinity;

  handles.forEach((handle) => {
    const distance = Math.sqrt(Math.pow(handle.absX - pos.x, 2) + Math.pow(handle.absY - pos.y, 2));
    if (distance <= connectionRadius && distance < minDistance) {
      minDistance = distance;
      closestHandle = handle;
    }
  });

  return closestHandle;
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
  const { onConnectStart, movePane, connectionMode, domNode, autoPanOnConnect, connectionRadius } = getState();
  let connectionPosition: XYPosition = { x: 0, y: 0 };
  let autoPanId = 0;
  let prevClosestHandle: ConnectionHandle | undefined;

  // when the user is moving the mouse close to the edge of the canvas while connecting we move the canvas
  const autoPan = (): void => {
    if (!containerBounds || !autoPanOnConnect) {
      return;
    }

    const xMovement = calcAutoPanVelocity(connectionPosition.x, 35, containerBounds.width - 35) * 20;
    const yMovement = calcAutoPanVelocity(connectionPosition.y, 35, containerBounds.height - 35) * 20;

    movePane({ x: xMovement, y: yMovement });
    autoPanId = requestAnimationFrame(autoPan);
  };

  if (!doc || !domNode) {
    return;
  }

  const elementBelow = doc.elementFromPoint(event.clientX, event.clientY);
  const elementBelowIsTarget = elementBelow?.classList.contains('target');
  const elementBelowIsSource = elementBelow?.classList.contains('source');

  if (!elementBelowIsTarget && !elementBelowIsSource && !elementEdgeUpdaterType) {
    return;
  }

  const handleType = elementEdgeUpdaterType ? elementEdgeUpdaterType : elementBelowIsTarget ? 'target' : 'source';
  const containerBounds = domNode.getBoundingClientRect();
  let recentHoveredHandle: Element;

  connectionPosition = {
    x: event.clientX - containerBounds.left,
    y: event.clientY - containerBounds.top,
  };

  autoPan();

  setState({
    connectionPosition,
    connectionNodeId: nodeId,
    connectionHandleId: handleId,
    connectionHandleType: handleType,
  });
  onConnectStart?.(event, { nodeId, handleId, handleType });

  const handles = getState()
    .getNodes()
    .reduce<ConnectionHandle[]>((res, node) => {
      if (node[internalsSymbol]) {
        const { handleBounds } = node[internalsSymbol];
        let sourceHandles: ConnectionHandle[] = [];
        let targetHandles: ConnectionHandle[] = [];

        if (handleBounds) {
          sourceHandles = getHandles(node, handleBounds, 'source', `${nodeId}-${handleId}-${handleType}`);
          targetHandles = getHandles(node, handleBounds, 'target', `${nodeId}-${handleId}-${handleType}`);
        }

        res.push(...sourceHandles, ...targetHandles);
      }
      return res;
    }, []);

  function onMouseMove(event: MouseEvent) {
    const { transform } = getState();
    connectionPosition = {
      x: event.clientX - containerBounds.left,
      y: event.clientY - containerBounds.top,
    };

    prevClosestHandle = getClosestHandle(
      pointToRendererPoint(connectionPosition, transform, false, [1, 1]),
      connectionRadius,
      handles
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

    const { connection, elementBelow, isValid, isHoveringHandle } = isHandleValid(
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

  function onMouseUp(event: MouseEvent) {
    cancelAnimationFrame(autoPanId);

    const { connection, isValid } = isHandleValid(
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
