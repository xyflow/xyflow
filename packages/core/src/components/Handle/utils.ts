import { ConnectionMode, Node, NodeHandleBounds } from '../../types';
import type { Connection, HandleType, XYPosition } from '../../types';
import { internalsSymbol } from '../../utils';

export type ConnectionHandle = {
  id: string | null;
  type: HandleType;
  nodeId: string;
  absX: number;
  absY: number;
  width: number;
  height: number;
};

export type ValidConnectionFunc = (connection: Connection) => boolean;

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
        absX: (node.positionAbsolute?.x ?? 0) + h.x,
        absY: (node.positionAbsolute?.y ?? 0) + h.y,
        width: h.width,
        height: h.height,
      });
    }
    return res;
  }, []);
}

export function getClosestHandle(pos: XYPosition, connectionRadius: number, handles: ConnectionHandle[]) {
  let closestHandle: ConnectionHandle | undefined;
  let minDistance = Infinity;

  handles.forEach((handle) => {
    const distance = Math.sqrt(Math.pow(handle.absX - pos.x, 2) + Math.pow(handle.absY - pos.y, 2));
    if (distance <= connectionRadius && distance < minDistance) {
      minDistance = distance;
      closestHandle = handle;
    }
  });

  return closestHandle;
}

type Result = {
  elementBelow: Element | null;
  isValid: boolean;
  connection: Connection;
  isHoveringHandle: boolean;
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
  const result: Result = {
    elementBelow: null,
    isValid: false,
    connection: { source: null, target: null, sourceHandle: null, targetHandle: null },
    isHoveringHandle: false,
  };
  const isTarget = fromType === 'target';

  const elementBelow = doc.querySelector(
    `.react-flow__handle[data-id="${handle?.nodeId}-${handle?.id}-${handle?.type}"]`
  );

  if (elementBelow) {
    const elementBelowIsTarget = handle.type === 'target';
    const elementBelowIsSource = handle.type === 'source';
    result.isHoveringHandle = true;

    const elementBelowNodeId = elementBelow.getAttribute('data-nodeid');
    const elementBelowHandleId = elementBelow.getAttribute('data-handleid');
    const connection: Connection = isTarget
      ? {
          source: handle.nodeId,
          sourceHandle: handle.id,
          target: fromNodeId,
          targetHandle: fromHandleId,
        }
      : {
          source: fromNodeId,
          sourceHandle: fromHandleId,
          target: handle.nodeId,
          targetHandle: handle.id,
        };

    result.connection = connection;

    // in strict mode we don't allow target to target or source to source connections
    const isValid =
      connectionMode === ConnectionMode.Strict
        ? (isTarget && elementBelowIsSource) || (!isTarget && elementBelowIsTarget)
        : elementBelowNodeId !== handle.nodeId || elementBelowHandleId !== handle.id;

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
