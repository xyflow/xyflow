import { MouseEvent as ReactMouseEvent, TouchEvent as ReactTouchEvent } from 'react';
import {
  internalsSymbol,
  ConnectionMode,
  ConnectionStatus,
  type Connection,
  type HandleType,
  type XYPosition,
  type NodeHandleBounds,
} from '@reactflow/system';
import { getEventPosition } from '@reactflow/utils';

import type { Node } from '../../types';

export type ConnectionHandle = {
  id: string | null;
  type: HandleType;
  nodeId: string;
  x: number;
  y: number;
};

export type ValidConnectionFunc = (connection: Connection) => boolean;

// this functions collects all handles and adds an absolute position
// so that we can later find the closest handle to the mouse position
export function getHandles(
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
        x: (node.positionAbsolute?.x ?? 0) + h.x + h.width / 2,
        y: (node.positionAbsolute?.y ?? 0) + h.y + h.height / 2,
      });
    }
    return res;
  }, []);
}

export function getClosestHandle(
  pos: XYPosition,
  connectionRadius: number,
  handles: ConnectionHandle[]
): ConnectionHandle | null {
  let closestHandle: ConnectionHandle | null = null;
  let minDistance = Infinity;

  handles.forEach((handle) => {
    const distance = Math.sqrt(Math.pow(handle.x - pos.x, 2) + Math.pow(handle.y - pos.y, 2));
    if (distance <= connectionRadius && distance < minDistance) {
      minDistance = distance;
      closestHandle = handle;
    }
  });

  return closestHandle;
}

type Result = {
  handleDomNode: Element | null;
  isValid: boolean;
  connection: Connection;
};

const nullConnection: Connection = { source: null, target: null, sourceHandle: null, targetHandle: null };

// checks if  and returns connection in fom of an object { source: 123, target: 312 }
export function isValidHandle(
  event: MouseEvent | TouchEvent | ReactMouseEvent | ReactTouchEvent,
  handle: Pick<ConnectionHandle, 'nodeId' | 'id' | 'type'> | null,
  connectionMode: ConnectionMode,
  fromNodeId: string,
  fromHandleId: string | null,
  fromType: string,
  isValidConnection: ValidConnectionFunc,
  doc: Document | ShadowRoot
) {
  const isTarget = fromType === 'target';
  const handleDomNode = doc.querySelector(
    `.react-flow__handle[data-id="${handle?.nodeId}-${handle?.id}-${handle?.type}"]`
  );
  const { x, y } = getEventPosition(event);
  const handleBelow = doc.elementFromPoint(x, y);
  const handleToCheck = handleBelow?.classList.contains('react-flow__handle') ? handleBelow : handleDomNode;

  const result: Result = {
    handleDomNode: handleToCheck,
    isValid: false,
    connection: nullConnection,
  };

  if (handleToCheck) {
    const handleType = getHandleType(undefined, handleToCheck);
    const handleNodeId = handleToCheck.getAttribute('data-nodeid');
    const handleId = handleToCheck.getAttribute('data-handleid');

    const connection: Connection = {
      source: isTarget ? handleNodeId : fromNodeId,
      sourceHandle: isTarget ? handleId : fromHandleId,
      target: isTarget ? fromNodeId : handleNodeId,
      targetHandle: isTarget ? fromHandleId : handleId,
    };

    result.connection = connection;

    // in strict mode we don't allow target to target or source to source connections
    const isValid =
      connectionMode === ConnectionMode.Strict
        ? (isTarget && handleType === 'source') || (!isTarget && handleType === 'target')
        : handleNodeId !== fromNodeId || handleId !== fromHandleId;

    if (isValid) {
      result.isValid = isValidConnection(connection);
    }
  }

  return result;
}

type GetHandleLookupParams = {
  nodes: Node[];
  nodeId: string;
  handleId: string | null;
  handleType: string;
};

export function getHandleLookup({ nodes, nodeId, handleId, handleType }: GetHandleLookupParams) {
  return nodes.reduce<ConnectionHandle[]>((res, node) => {
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
}

export function getHandleType(
  edgeUpdaterType: HandleType | undefined,
  handleDomNode: Element | null
): HandleType | null {
  if (edgeUpdaterType) {
    return edgeUpdaterType;
  } else if (handleDomNode?.classList.contains('target')) {
    return 'target';
  } else if (handleDomNode?.classList.contains('source')) {
    return 'source';
  }

  return null;
}

export function resetRecentHandle(handleDomNode: Element): void {
  handleDomNode?.classList.remove('valid', 'connecting', 'react-flow__handle-valid', 'react-flow__handle-connecting');
}

export function getConnectionStatus(isInsideConnectionRadius: boolean, isHandleValid: boolean) {
  let connectionStatus = null;

  if (isHandleValid) {
    connectionStatus = 'valid';
  } else if (isInsideConnectionRadius && !isHandleValid) {
    connectionStatus = 'invalid';
  }

  return connectionStatus as ConnectionStatus;
}
