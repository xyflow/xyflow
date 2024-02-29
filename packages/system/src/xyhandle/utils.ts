import {
  ConnectionStatus,
  type HandleType,
  type NodeHandleBounds,
  type XYPosition,
  type NodeBase,
  type ConnectionHandle,
} from '../types';
import { internalsSymbol } from '../constants';

// this functions collects all handles and adds an absolute position
// so that we can later find the closest handle to the mouse position
export function getHandles(
  node: NodeBase,
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
        x: (node.computed?.positionAbsolute?.x ?? 0) + h.x + h.width / 2,
        y: (node.computed?.positionAbsolute?.y ?? 0) + h.y + h.height / 2,
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
  nodes: NodeBase[];
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

export function getConnectionStatus(isInsideConnectionRadius: boolean, isHandleValid: boolean) {
  let connectionStatus = null;

  if (isHandleValid) {
    connectionStatus = 'valid';
  } else if (isInsideConnectionRadius && !isHandleValid) {
    connectionStatus = 'invalid';
  }

  return connectionStatus as ConnectionStatus;
}
