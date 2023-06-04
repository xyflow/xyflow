import { getHandlePosition } from '@reactflow/edge-utils';
import {
  type NodeHandleBounds,
  type Rect,
  type HandleElement,
  Position,
  internalsSymbol
} from '@reactflow/system';

import type { Node } from '$lib/types';

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
