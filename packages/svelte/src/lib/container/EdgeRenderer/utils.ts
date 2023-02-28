import {
  type NodeHandleBounds,
  type Rect,
  type Node,
  type HandleElement,
  type XYPosition,
  Position,
  internalsSymbol
} from '@reactflow/system';

export function getNodeData(node?: Node): [Rect, NodeHandleBounds | null, boolean] {
  const handleBounds = node?.[internalsSymbol]?.handleBounds || null;

  const isValid =
    handleBounds &&
    node?.width &&
    node?.height &&
    typeof node?.positionAbsolute?.x !== 'undefined' &&
    typeof node?.positionAbsolute?.y !== 'undefined';

  return [
    {
      x: node?.positionAbsolute?.x || 0,
      y: node?.positionAbsolute?.y || 0,
      width: node?.width || 0,
      height: node?.height || 0
    },
    handleBounds,
    !!isValid
  ];
}

export function getHandlePosition(
  position: Position,
  nodeRect: Rect,
  handle: HandleElement | null = null
): XYPosition {
  const x = (handle?.x || 0) + nodeRect.x;
  const y = (handle?.y || 0) + nodeRect.y;
  const width = handle?.width || nodeRect.width;
  const height = handle?.height || nodeRect.height;

  switch (position) {
    case Position.Top:
      return {
        x: x + width / 2,
        y
      };
    case Position.Right:
      return {
        x: x + width,
        y: y + height / 2
      };
    case Position.Bottom:
      return {
        x: x + width / 2,
        y: y + height
      };
    case Position.Left:
      return {
        x,
        y: y + height / 2
      };
  }
}

export function getHandle(bounds: HandleElement[], handleId?: string | null): HandleElement | null {
  if (!bounds) {
    return null;
  }

  if (handleId) {
    return bounds.find((d) => d.id === handleId)!;
  } else if (bounds.length === 1) {
    return bounds[0];
  }

  return null;
}

export type EdgePosition = {
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
};

export function getEdgePositions(
  sourceNodeRect: Rect,
  sourceHandle: HandleElement,
  sourcePosition: Position,
  targetNodeRect: Rect,
  targetHandle: HandleElement,
  targetPosition: Position
): EdgePosition {
  const sourceHandlePos = getHandlePosition(sourcePosition, sourceNodeRect, sourceHandle);
  const targetHandlePos = getHandlePosition(targetPosition, targetNodeRect, targetHandle);

  return {
    sourceX: sourceHandlePos.x,
    sourceY: sourceHandlePos.y,
    targetX: targetHandlePos.x,
    targetY: targetHandlePos.y
  };
}
