import { pointToRendererPoint, rendererPointToPoint, getHostForElement, calcAutoPan, getEventPosition } from '../utils';
import {
  ConnectionMode,
  type OnConnect,
  type OnConnectStart,
  type HandleType,
  type Connection,
  type PanBy,
  type NodeBase,
  type Transform,
  type ConnectingHandle,
  type OnConnectEnd,
  type UpdateConnection,
  type IsValidConnection,
  type ConnectionHandle,
} from '../types';

import { getClosestHandle, getConnectionStatus, getHandleLookup, getHandleType, resetRecentHandle } from './utils';

export type OnPointerDownParams = {
  autoPanOnConnect: boolean;
  connectionMode: ConnectionMode;
  connectionRadius: number;
  domNode: HTMLDivElement | null;
  handleId: string | null;
  nodeId: string;
  isTarget: boolean;
  nodes: NodeBase[];
  lib: string;
  edgeUpdaterType?: HandleType;
  updateConnection: UpdateConnection;
  panBy: PanBy;
  cancelConnection: () => void;
  onConnectStart?: OnConnectStart;
  onConnect?: OnConnect;
  onConnectEnd?: OnConnectEnd;
  isValidConnection?: IsValidConnection;
  onEdgeUpdateEnd?: (evt: MouseEvent | TouchEvent) => void;
  getTransform: () => Transform;
};

export type IsValidParams = {
  handle: Pick<ConnectionHandle, 'nodeId' | 'id' | 'type'> | null;
  connectionMode: ConnectionMode;
  fromNodeId: string;
  fromHandleId: string | null;
  fromType: HandleType;
  isValidConnection?: IsValidConnection;
  doc: Document | ShadowRoot;
  lib: string;
};

export type XYHandleInstance = {
  onPointerDown: (event: MouseEvent | TouchEvent, params: OnPointerDownParams) => void;
  isValid: (event: MouseEvent | TouchEvent, params: IsValidParams) => Result;
};

type Result = {
  handleDomNode: Element | null;
  isValid: boolean;
  connection: Connection;
  endHandle: ConnectingHandle | null;
};

const nullConnection: Connection = { source: null, target: null, sourceHandle: null, targetHandle: null };

const alwaysValid = () => true;

function onPointerDown(
  event: MouseEvent | TouchEvent,
  {
    connectionMode,
    connectionRadius,
    handleId,
    nodeId,
    edgeUpdaterType,
    isTarget,
    domNode,
    nodes,
    lib,
    autoPanOnConnect,
    panBy,
    cancelConnection,
    onConnectStart,
    onConnect,
    onConnectEnd,
    isValidConnection = alwaysValid,
    onEdgeUpdateEnd,
    updateConnection,
    getTransform,
  }: OnPointerDownParams
) {
  // when xyflow is used inside a shadow root we can't use document
  const doc = getHostForElement(event.target as HTMLElement);
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
    nodes,
    nodeId,
    handleId,
    handleType,
  });

  // when the user is moving the mouse close to the edge of the canvas while connecting we move the canvas
  function autoPan(): void {
    if (!autoPanOnConnect || !containerBounds) {
      return;
    }
    const [x, y] = calcAutoPan(connectionPosition, containerBounds);

    panBy({ x, y });
    autoPanId = requestAnimationFrame(autoPan);
  }

  updateConnection({
    connectionPosition,
    connectionStatus: null,
    // connectionNodeId etc will be removed in the next major in favor of connectionStartHandle
    connectionStartHandle: {
      nodeId,
      handleId,
      type: handleType,
    },
    connectionEndHandle: null,
  });

  onConnectStart?.(event, { nodeId, handleId, handleType });

  function onPointerMove(event: MouseEvent | TouchEvent) {
    const transform = getTransform();
    connectionPosition = getEventPosition(event, containerBounds);
    closestHandle = getClosestHandle(
      pointToRendererPoint(connectionPosition, transform, false, [1, 1]),
      connectionRadius,
      handleLookup
    );

    if (!autoPanStarted) {
      autoPan();
      autoPanStarted = true;
    }

    const result = isValidHandle(event, {
      handle: closestHandle,
      connectionMode,
      fromNodeId: nodeId,
      fromHandleId: handleId,
      fromType: isTarget ? 'target' : 'source',
      isValidConnection,
      doc,
      lib,
    });

    handleDomNode = result.handleDomNode;
    connection = result.connection;
    isValid = result.isValid;

    updateConnection({
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
      connectionEndHandle: result.endHandle,
    });

    if (!closestHandle && !isValid && !handleDomNode) {
      return resetRecentHandle(prevActiveHandle, lib);
    }

    if (connection.source !== connection.target && handleDomNode) {
      resetRecentHandle(prevActiveHandle, lib);
      prevActiveHandle = handleDomNode;
      handleDomNode.classList.add('connecting', `${lib}-flow__handle-connecting`);
      handleDomNode.classList.toggle('valid', isValid);
      handleDomNode.classList.toggle(`${lib}-flow__handle-valid`, isValid);
    }
  }

  function onPointerUp(event: MouseEvent | TouchEvent) {
    if ((closestHandle || handleDomNode) && connection && isValid) {
      onConnect?.(connection);
    }

    // it's important to get a fresh reference from the store here
    // in order to get the latest state of onConnectEnd
    onConnectEnd?.(event);

    if (edgeUpdaterType) {
      onEdgeUpdateEnd?.(event);
    }

    resetRecentHandle(prevActiveHandle, lib);
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

// checks if  and returns connection in fom of an object { source: 123, target: 312 }
function isValidHandle(
  event: MouseEvent | TouchEvent,
  {
    handle,
    connectionMode,
    fromNodeId,
    fromHandleId,
    fromType,
    doc,
    lib,
    isValidConnection = alwaysValid,
  }: IsValidParams
) {
  const isTarget = fromType === 'target';
  const handleDomNode = doc.querySelector(
    `.${lib}-flow__handle[data-id="${handle?.nodeId}-${handle?.id}-${handle?.type}"]`
  );
  const { x, y } = getEventPosition(event);
  const handleBelow = doc.elementFromPoint(x, y);
  // we always want to prioritize the handle below the mouse cursor over the closest distance handle,
  // because it could be that the center of another handle is closer to the mouse pointer than the handle below the cursor
  const handleToCheck = handleBelow?.classList.contains(`${lib}-flow__handle`) ? handleBelow : handleDomNode;

  const result: Result = {
    handleDomNode: handleToCheck,
    isValid: false,
    connection: nullConnection,
    endHandle: null,
  };

  if (handleToCheck) {
    const handleType = getHandleType(undefined, handleToCheck);
    const handleNodeId = handleToCheck.getAttribute('data-nodeid');
    const handleId = handleToCheck.getAttribute('data-handleid');
    const connectable = handleToCheck.classList.contains('connectable');
    const connectableEnd = handleToCheck.classList.contains('connectableend');

    const connection: Connection = {
      source: isTarget ? handleNodeId : fromNodeId,
      sourceHandle: isTarget ? handleId : fromHandleId,
      target: isTarget ? fromNodeId : handleNodeId,
      targetHandle: isTarget ? fromHandleId : handleId,
    };

    result.connection = connection;

    const isConnectable = connectable && connectableEnd;
    // in strict mode we don't allow target to target or source to source connections
    const isValid =
      isConnectable &&
      (connectionMode === ConnectionMode.Strict
        ? (isTarget && handleType === 'source') || (!isTarget && handleType === 'target')
        : handleNodeId !== fromNodeId || handleId !== fromHandleId);

    if (isValid) {
      result.endHandle = {
        nodeId: handleNodeId as string,
        handleId,
        type: handleType as HandleType,
      };

      result.isValid = isValidConnection(connection);
    }
  }

  return result;
}

export const XYHandle: XYHandleInstance = {
  onPointerDown,
  isValid: isValidHandle,
};
