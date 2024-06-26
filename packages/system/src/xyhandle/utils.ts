import { getHandlePosition } from '../utils';
import {
  type HandleType,
  type NodeHandleBounds,
  type XYPosition,
  type Handle,
  InternalNodeBase,
  NodeLookup,
} from '../types';

// this functions collects all handles and adds an absolute position
// so that we can later find the closest handle to the mouse position
function getHandles(
  node: InternalNodeBase,
  handleBounds: NodeHandleBounds,
  type: HandleType,
  currentHandle: { nodeId: string; handleId: string | null; handleType: HandleType }
): [Handle[], Handle | null] {
  let excludedHandle = null;
  const handles = (handleBounds[type] || []).reduce<Handle[]>((res, handle) => {
    if (node.id === currentHandle.nodeId && type === currentHandle.handleType && handle.id === currentHandle.handleId) {
      excludedHandle = handle;
    } else {
      const handleXY = getHandlePosition(node, handle);
      res.push({ ...handle, ...handleXY });
    }
    return res;
  }, []);
  return [handles, excludedHandle];
}

export function getClosestHandle(pos: XYPosition, connectionRadius: number, handles: Handle[]): Handle | null {
  let closestHandles: Handle[] = [];
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
  handleType: HandleType;
};

export function getHandleLookup({
  nodeLookup,
  nodeId,
  handleId,
  handleType,
}: GetHandleLookupParams): [Handle[], Handle] {
  const connectionHandles: Handle[] = [];
  const currentHandle = { nodeId, handleId, handleType };
  let excludedHandle: Handle | null = null;

  for (const node of nodeLookup.values()) {
    if (node.internals.handleBounds) {
      const [sourceHandles, excludedSource] = getHandles(node, node.internals.handleBounds, 'source', currentHandle);
      const [targetHandles, excludedTarget] = getHandles(node, node.internals.handleBounds, 'target', currentHandle);
      excludedHandle = excludedHandle ? excludedHandle : excludedSource ?? excludedTarget;
      connectionHandles.push(...sourceHandles, ...targetHandles);
    }
  }

  return [connectionHandles, excludedHandle!];
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

export function isConnectionValid(isInsideConnectionRadius: boolean, isHandleValid: boolean) {
  let isValid: boolean | null = null;

  if (isHandleValid) {
    isValid = true;
  } else if (isInsideConnectionRadius && !isHandleValid) {
    isValid = false;
  }

  return isValid;
}
