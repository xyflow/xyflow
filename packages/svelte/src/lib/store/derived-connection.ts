import type { ConnectionData } from '$lib/types';
import {
  ConnectionMode,
  Position,
  type HandleElement,
  type NodeLookup,
  type Viewport
} from '@xyflow/system';

export type ConnectionProps = {
  sourceX: number | null;
  sourceY: number | null;
  sourcePosition: Position | undefined | null;
  targetX: number | null;
  targetY: number | null;
  targetPosition: Position | undefined | null;
  pointerPosition: ConnectionData['connectionPosition'] | null;
  startHandle: ConnectionData['connectionStartHandle'] | null;
  endHandle: ConnectionData['connectionEndHandle'] | null;
  status: ConnectionData['connectionStatus'] | null;
};

export const initConnectionProps = {
  sourceX: null,
  sourceY: null,
  sourcePosition: null,
  targetX: null,
  targetY: null,
  targetPosition: null,
  pointerPosition: null,
  startHandle: null,
  endHandle: null,
  status: null
};

export const initConnectionUpdateData = {
  connectionStartHandle: null,
  connectionEndHandle: null,
  connectionPosition: null,
  connectionStatus: null
};

const oppositePosition = {
  [Position.Left]: Position.Right,
  [Position.Right]: Position.Left,
  [Position.Top]: Position.Bottom,
  [Position.Bottom]: Position.Top
};

export function getDerivedConnection(
  connection: ConnectionData,
  connectionMode: ConnectionMode,
  nodeLookup: NodeLookup,
  viewport: Viewport
): ConnectionProps {
  if (!connection.connectionStartHandle?.nodeId) {
    return initConnectionProps;
  }

  const fromNode = nodeLookup.get(connection.connectionStartHandle?.nodeId);
  if (!fromNode) {
    return initConnectionProps;
  }

  const fromHandleBounds = fromNode.internals.handleBounds;
  const handleBoundsStrict =
    fromHandleBounds?.[connection.connectionStartHandle.type || 'source'] || [];
  const handleBoundsLoose: HandleElement[] | undefined | null = handleBoundsStrict
    ? handleBoundsStrict
    : fromHandleBounds?.[
        connection?.connectionStartHandle?.type === 'source' ? 'target' : 'source'
      ];
  const handleBounds =
    connectionMode === ConnectionMode.Strict ? handleBoundsStrict : handleBoundsLoose;
  const fromHandle = connection.connectionStartHandle?.handleId
    ? handleBounds?.find((d) => d.id === connection.connectionStartHandle?.handleId)
    : handleBounds?.[0];
  const fromHandleX = fromHandle
    ? fromHandle.x + fromHandle.width / 2
    : (fromNode.measured.width ?? 0) / 2;
  const fromHandleY = fromHandle
    ? fromHandle.y + fromHandle.height / 2
    : fromNode.measured.height ?? 0;
  const fromX = fromNode.internals.positionAbsolute.x + fromHandleX;
  const fromY = fromNode.internals.positionAbsolute.y + fromHandleY;
  const fromPosition = fromHandle?.position;
  const toPosition = fromPosition ? oppositePosition[fromPosition] : undefined;

  const pathParams = {
    sourceX: fromX,
    sourceY: fromY,
    sourcePosition: fromPosition,
    targetX: ((connection.connectionPosition?.x ?? 0) - viewport.x) / viewport.zoom,
    targetY: ((connection.connectionPosition?.y ?? 0) - viewport.y) / viewport.zoom,
    targetPosition: toPosition
  };

  return {
    ...pathParams,
    pointerPosition: connection.connectionPosition,
    startHandle: connection.connectionStartHandle,
    endHandle: connection.connectionEndHandle,
    status: connection.connectionStatus
  };
}
