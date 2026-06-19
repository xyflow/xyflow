import type { Connection, HandleType } from '@xyflow/system';
import type { Actions, Edge, HandleElement, IsValidParams, Node, NodeLookup, Result } from '../types';
import { ConnectionMode, getEventPosition, getHandlePosition } from '@xyflow/system';

const alwaysValid = () => true;

function getHandleType(handleDomNode: Element | null): HandleType | null {
  if (handleDomNode?.classList.contains('target')) {
    return 'target';
  }
  else if (handleDomNode?.classList.contains('source')) {
    return 'source';
  }

  return null;
}

export function getHandle(
  nodeId: string,
  handleType: HandleType,
  handleId: string | null,
  nodeLookup: NodeLookup,
  connectionMode: ConnectionMode,
  withAbsolutePosition = false,
): HandleElement | null {
  const node = nodeLookup.get(nodeId);
  if (!node) {
    return null;
  }

  const handles
    = connectionMode === ConnectionMode.Strict
      ? node.internals.handleBounds?.[handleType]
      : [...(node.internals.handleBounds?.source ?? []), ...(node.internals.handleBounds?.target ?? [])];
  const handle = (handleId ? handles?.find(h => h.id === handleId) : handles?.[0]) ?? null;

  return handle && withAbsolutePosition ? { ...handle, ...getHandlePosition(node, handle, handle.position, true) } : handle;
}

// checks if and returns connection in form of an object { source: 123, target: 312 }
export function isValidHandle(
  event: MouseEvent | TouchEvent,
  {
    handle,
    connectionMode,
    fromNodeId,
    fromHandleId,
    fromType,
    doc,
    lib,
    flowId,
    isValidConnection = alwaysValid,
  }: IsValidParams,
  edges: Edge[],
  nodes: Node[],
  getInternalNode: Actions['getInternalNode'],
  nodeLookup: NodeLookup,
) {
  const isTarget = fromType === 'target';
  const handleDomNode = handle
    ? doc.querySelector(`.${lib}-flow__handle[data-id="${flowId}-${handle?.nodeId}-${handle?.id}-${handle?.type}"]`)
    : null;

  const { x, y } = getEventPosition(event);
  const handleBelow = doc.elementFromPoint(x, y);
  // we always want to prioritize the handle below the mouse cursor over the closest distance handle,
  // because it could be that the center of another handle is closer to the mouse pointer than the handle below the cursor
  const handleToCheck = handleBelow?.classList.contains(`${lib}-flow__handle`) ? handleBelow : handleDomNode;

  const result: Result = {
    handleDomNode: handleToCheck,
    isValid: false,
    connection: null,
    toHandle: null,
  };

  if (handleToCheck) {
    const handleType = getHandleType(handleToCheck);
    const handleNodeId = handleToCheck.getAttribute('data-nodeid');
    const handleId = handleToCheck.getAttribute('data-handleid');
    const connectable = handleToCheck.classList.contains('connectable');
    const connectableEnd = handleToCheck.classList.contains('connectableend');

    if (!handleNodeId || !handleType) {
      return result;
    }

    const connection: Connection = {
      source: isTarget ? handleNodeId : fromNodeId,
      sourceHandle: isTarget ? handleId : fromHandleId,
      target: isTarget ? fromNodeId : handleNodeId,
      targetHandle: isTarget ? fromHandleId : handleId,
    };

    result.connection = connection;

    const isConnectable = connectable && connectableEnd;
    // in strict mode we don't allow target to target or source to source connections
    const isValid
      = isConnectable
        && (connectionMode === ConnectionMode.Strict
          ? (isTarget && handleType === 'source') || (!isTarget && handleType === 'target')
          : handleNodeId !== fromNodeId || handleId !== fromHandleId);

    result.isValid
      = isValid
        && isValidConnection(connection, {
          nodes,
          edges,
          sourceNode: getInternalNode(connection.source)!,
          targetNode: getInternalNode(connection.target)!,
        });

    result.toHandle = getHandle(handleNodeId, handleType, handleId, nodeLookup, connectionMode, true);
  }

  return result;
}
