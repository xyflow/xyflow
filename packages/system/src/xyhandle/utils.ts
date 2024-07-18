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
      const handleXY = getHandlePosition(node, handle, handle.position, true);
      res.push({ ...handle, ...handleXY });
    }
    return res;
  }, []);
  return [handles, excludedHandle];
}

export function getClosestHandle(
  pos: XYPosition,
  connectionRadius: number,
  handleLookup: Map<string, Handle>
): Handle | null {
  let closestHandles: Handle[] = [];
  let minDistance = Infinity;

  for (const handle of handleLookup.values()) {
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
}: GetHandleLookupParams): [Map<string, Handle>, Handle] {
  const connectionHandles: Map<string, Handle> = new Map();
  const currentHandle = { nodeId, handleId, handleType };
  let matchingHandle: Handle | null = null;

  for (const node of nodeLookup.values()) {
    if (node.internals.handleBounds) {
      const [sourceHandles, excludedSource] = getHandles(node, node.internals.handleBounds, 'source', currentHandle);
      const [targetHandles, excludedTarget] = getHandles(node, node.internals.handleBounds, 'target', currentHandle);

      matchingHandle = matchingHandle ? matchingHandle : excludedSource ?? excludedTarget;

      [...sourceHandles, ...targetHandles].forEach((handle) =>
        connectionHandles.set(`${handle.nodeId}-${handle.type}-${handle.id}`, handle)
      );
    }
  }

  // if the user only works with handles that are type="source" + connectionMode="loose"
  // it happens that we can't find a matching handle. The reason for this is, that the
  // edge don't know about the handles and always assumes that there is source and a target.
  // In this case we need to find the matching handle by switching the handleType
  if (!matchingHandle) {
    const node = nodeLookup.get(nodeId);
    if (node?.internals.handleBounds) {
      currentHandle.handleType = handleType === 'source' ? 'target' : 'source';
      const [, excluded] = getHandles(node, node.internals.handleBounds, currentHandle.handleType, currentHandle);
      matchingHandle = excluded;
    }
  }

  return [connectionHandles, matchingHandle!];
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
