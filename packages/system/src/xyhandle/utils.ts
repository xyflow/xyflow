import {
  ConnectionStatus,
  type HandleType,
  type NodeHandleBounds,
  type XYPosition,
  type ConnectionHandle,
  InternalNodeBase,
  NodeLookup,
} from '../types';

import { getHandlePosition } from '../utils';

// this functions collects all handles and adds an absolute position
// so that we can later find the closest handle to the mouse position
export function getHandles(
  node: InternalNodeBase,
  handleBounds: NodeHandleBounds,
  type: HandleType,
  currentHandle: string
): ConnectionHandle[] {
  return (handleBounds[type] || []).reduce<ConnectionHandle[]>((res, h) => {
    if (`${node.id}-${h.id}-${type}` !== currentHandle) {
      const handlePosition = getHandlePosition(h.position, node, h);
      res.push({
        id: h.id || null,
        type,
        nodeId: node.id,
        x: handlePosition[0],
        y: handlePosition[1],
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
  let closestHandles: ConnectionHandle[] = [];
  let minDistance = Infinity;

  for (const handle of handles) {
    const distance = Math.sqrt(Math.pow(handle.x - pos.x, 2) + Math.pow(handle.y - pos.y, 2));
    if (distance <= connectionRadius) {
      if (distance < minDistance) {
        closestHandles = [handle];
      } else if (distance === minDistance) {
        // when multiple handles are on the same distance we collect all of them
        closestHandles.push(handle);
      }
      minDistance = distance;
    }
  }

  if (!closestHandles.length) {
    return null;
  }

  return closestHandles.length === 1
    ? closestHandles[0]
    : // if multiple handles are layouted on top of each other we take the one with type = target because it's more likely that the user wants to connect to this one
      closestHandles.find((handle) => handle.type === 'target') || closestHandles[0];
}

type GetHandleLookupParams = {
  nodeLookup: NodeLookup;
  nodeId: string;
  handleId: string | null;
  handleType: string;
};

export function getHandleLookup({
  nodeLookup,
  nodeId,
  handleId,
  handleType,
}: GetHandleLookupParams): ConnectionHandle[] {
  const connectionHandles: ConnectionHandle[] = [];

  for (const [, node] of nodeLookup) {
    if (node.internals.handleBounds) {
      const id = `${nodeId}-${handleId}-${handleType}`;
      const sourceHandles = getHandles(node, node.internals.handleBounds, 'source', id);
      const targetHandles = getHandles(node, node.internals.handleBounds, 'target', id);
      connectionHandles.push(...sourceHandles, ...targetHandles);
    }
  }

  return connectionHandles;
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

export function getConnectionStatus(isInsideConnectionRadius: boolean, isHandleValid: boolean) {
  let connectionStatus = null;

  if (isHandleValid) {
    connectionStatus = 'valid';
  } else if (isInsideConnectionRadius && !isHandleValid) {
    connectionStatus = 'invalid';
  }

  return connectionStatus as ConnectionStatus;
}
