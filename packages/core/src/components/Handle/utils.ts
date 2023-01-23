import { MouseEvent as ReactMouseEvent } from 'react';

import { ConnectionMode } from '../../types';
import type { Connection, HandleType, XYPosition, Node, NodeHandleBounds } from '../../types';
import { internalsSymbol } from '../../utils';

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

// checks if  and returns connection in fom of an object { source: 123, target: 312 }
export function isValidHandle(
  handle: Pick<ConnectionHandle, 'nodeId' | 'id' | 'type'>,
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
  const result: Result = {
    handleDomNode,
    isValid: false,
    connection: { source: null, target: null, sourceHandle: null, targetHandle: null },
  };

  if (handleDomNode) {
    const handleIsTarget = handle.type === 'target';
    const handleIsSource = handle.type === 'source';
    const handleNodeId = handleDomNode.getAttribute('data-nodeid');
    const handleId = handleDomNode.getAttribute('data-handleid');

    const connection: Connection = {
      source: isTarget ? handle.nodeId : fromNodeId,
      sourceHandle: isTarget ? handle.id : fromHandleId,
      target: isTarget ? fromNodeId : handle.nodeId,
      targetHandle: isTarget ? fromHandleId : handle.id,
    };

    result.connection = connection;

    // in strict mode we don't allow target to target or source to source connections
    const isValid =
      connectionMode === ConnectionMode.Strict
        ? (isTarget && handleIsSource) || (!isTarget && handleIsTarget)
        : handleNodeId !== handle.nodeId || handleId !== handle.id;

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

export function getConnectionPosition(event: MouseEvent | ReactMouseEvent, bounds: DOMRect): XYPosition {
  return {
    x: event.clientX - bounds.left,
    y: event.clientY - bounds.top,
  };
}
