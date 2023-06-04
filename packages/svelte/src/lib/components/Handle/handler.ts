import { get, type Writable } from 'svelte/store';
import {
  getHostForElement,
  calcAutoPan,
  getEventPosition,
  pointToRendererPoint,
  rendererPointToPoint
} from '@reactflow/utils';
import type {
  OnConnect,
  HandleType,
  Connection,
  ConnectionMode,
  XYPosition,
  Transform
} from '@reactflow/system';

import {
  getClosestHandle,
  getConnectionStatus,
  getHandleLookup,
  getHandleType,
  isValidHandle,
  resetRecentHandle,
  type ConnectionHandle
} from './utils';
import type { ConnectionData, IsValidConnection, Node } from '$lib/types';

export function handlePointerDown({
  event,
  handleId,
  nodeId,
  onConnect,
  domNode,
  nodes,
  connectionMode,
  connectionRadius,
  isTarget,
  transform: transformStore,
  panBy,
  updateConnection,
  cancelConnection,
  isValidConnection,
  edgeUpdaterType,
  onEdgeUpdateEnd,
  onConnectStart,
  onConnectEnd
}: {
  event: MouseEvent | TouchEvent;
  handleId: string | null;
  nodeId: string;
  onConnect: OnConnect;
  isTarget: boolean;
  connectionMode: ConnectionMode;
  domNode: HTMLDivElement | null;
  nodes: Writable<Node[]>;
  connectionRadius: number;
  isValidConnection: IsValidConnection;
  transform: Writable<Transform>;
  updateConnection: (connection: Partial<ConnectionData>) => void;
  cancelConnection: () => void;
  panBy: (delta: XYPosition) => void;
  edgeUpdaterType?: HandleType;
  onEdgeUpdateEnd?: (evt: MouseEvent | TouchEvent) => void;
  onConnectStart: () => void;
  onConnectEnd: () => void;
}): void {
  // when svelte-flow is used inside a shadow root we can't use document
  const doc = getHostForElement(event.target as HTMLElement);
  let autoPanId = 0;
  let prevClosestHandle: ConnectionHandle | null;

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

  const autoPanOnConnect = true;

  const handleLookup = getHandleLookup({
    nodes: get(nodes),
    nodeId,
    handleId,
    handleType
  });

  // when the user is moving the mouse close to the edge of the canvas while connecting we move the canvas
  const autoPan = (): void => {
    // @todd add prop
    if (!autoPanOnConnect) {
      return;
    }
    const [xMovement, yMovement] = calcAutoPan(connectionPosition, containerBounds);

    panBy({ x: xMovement, y: yMovement });
    autoPanId = requestAnimationFrame(autoPan);
  };

  updateConnection({
    position: connectionPosition,
    nodeId,
    handleId,
    handleType,
    status: null
  });

  // onConnectStart?.(event, { nodeId, handleId, handleType });
  onConnectStart();

  function onPointerMove(event: MouseEvent | TouchEvent) {
    const transform = get(transformStore);
    connectionPosition = getEventPosition(event, containerBounds);

    prevClosestHandle = getClosestHandle(
      pointToRendererPoint(connectionPosition, transform, false, [1, 1]),
      connectionRadius,
      handleLookup
    );

    if (!autoPanStarted) {
      autoPan();
      autoPanStarted = true;
    }

    const result = isValidHandle(
      event,
      prevClosestHandle,
      connectionMode,
      nodeId,
      handleId,
      isTarget ? 'target' : 'source',
      isValidConnection,
      doc,
      get(nodes)
    );

    handleDomNode = result.handleDomNode;
    connection = result.connection;
    isValid = result.isValid;

    updateConnection({
      position:
        prevClosestHandle && isValid
          ? rendererPointToPoint(
              {
                x: prevClosestHandle.x,
                y: prevClosestHandle.y
              },
              transform
            )
          : connectionPosition,
      status: getConnectionStatus(!!prevClosestHandle, isValid)
    });

    if (!prevClosestHandle && !isValid && !handleDomNode) {
      return resetRecentHandle(prevActiveHandle);
    }

    if (connection.source !== connection.target && handleDomNode) {
      resetRecentHandle(prevActiveHandle);
      prevActiveHandle = handleDomNode;
      // @todo: remove the old class names "svelte-flow__handle-" in the next major version
      handleDomNode.classList.add('connecting');
      handleDomNode.classList.toggle('valid', isValid);
    }
  }

  function onPointerUp(event: MouseEvent | TouchEvent) {
    if ((prevClosestHandle || handleDomNode) && connection && isValid) {
      onConnect?.(connection);
    }

    // it's important to get a fresh reference from the store here
    // in order to get the latest state of onConnectEnd

    onConnectEnd();

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
