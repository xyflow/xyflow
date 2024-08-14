import { getHandlePosition, getOverlappingArea, nodeToRect } from '../utils';
import type { HandleType, XYPosition, Handle, InternalNodeBase, NodeLookup } from '../types';

function getNodesWithinDistance(position: XYPosition, nodeLookup: NodeLookup, distance: number): InternalNodeBase[] {
  const nodes: InternalNodeBase[] = [];

  for (const node of nodeLookup.values()) {
    const rect = {
      x: position.x - distance,
      y: position.y - distance,
      width: distance * 2,
      height: distance * 2,
    };

    const overlappingArea = getOverlappingArea(rect, nodeToRect(node));

    if (overlappingArea > 0) {
      nodes.push(node);
    }
  }

  return nodes;
}

const ADDITIONAL_DISTANCE = 250;
export function getClosestHandle(
  position: XYPosition,
  connectionRadius: number,
  nodeLookup: NodeLookup,
  fromHandle: { nodeId: string; type: HandleType; id?: string | null }
): Handle | null {
  let closestHandles: Handle[] = [];
  let minDistance = Infinity;

  const closeNodes = getNodesWithinDistance(position, nodeLookup, connectionRadius + ADDITIONAL_DISTANCE);
  for (const node of closeNodes) {
    const allHandles = [...(node.internals.handleBounds?.source ?? []), ...(node.internals.handleBounds?.target ?? [])];

    for (const handle of allHandles) {
      // if the handle is the same as the fromHandle we skip it
      if (fromHandle.nodeId === handle.nodeId && fromHandle.type === handle.type && fromHandle.id === handle.id) {
        continue;
      }

      // determine absolute position of the handle
      const { x, y } = getHandlePosition(node, handle, handle.position, true);

      const distance = Math.sqrt(Math.pow(x - position.x, 2) + Math.pow(y - position.y, 2));
      if (distance > connectionRadius) {
        continue;
      }

      if (distance < minDistance) {
        closestHandles = [{ ...handle, x, y }];
        minDistance = distance;
      } else if (distance === minDistance) {
        // when multiple handles are on the same distance we collect all of them
        closestHandles.push({ ...handle, x, y });
      }
    }
  }

  if (!closestHandles.length) {
    return null;
  }
  // when multiple handles overlay each other we prefer the opposite handle
  if (closestHandles.length > 1) {
    const oppositeHandleType = fromHandle.type === 'source' ? 'target' : 'source';
    return closestHandles.find((handle) => handle.type === oppositeHandleType) ?? closestHandles[0];
  }

  return closestHandles[0];
}

export function getHandle(
  nodeId: string,
  handleType: HandleType,
  handleId: string | null,
  nodeLookup: NodeLookup,
  withAbsolutePosition = false
): Handle | null {
  const node = nodeLookup.get(nodeId);
  if (!node) {
    return null;
  }

  const handles = node.internals.handleBounds?.[handleType];
  const handle = (handleId ? handles?.find((h) => h.id === handleId) : handles?.[0]) ?? null;

  return handle && withAbsolutePosition
    ? { ...handle, ...getHandlePosition(node, handle, handle.position, true) }
    : handle;
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
