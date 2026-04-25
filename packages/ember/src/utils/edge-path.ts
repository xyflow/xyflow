import {
  Position,
  getBezierPath,
  getSmoothStepPath,
  getStraightPath,
  type EdgePosition,
} from '@xyflow/system';

import type { Edge, Node } from '../types.js';

interface EdgePathOptions<NodeType extends Node = Node> {
  getNodePosition?: (node: NodeType) => { x: number; y: number };
  getNodeWidth?: (node: NodeType) => number;
  getNodeHeight?: (node: NodeType) => number;
}

export function getEdgePathData<NodeType extends Node = Node, EdgeType extends Edge = Edge>(
  edge: EdgeType,
  source: NodeType,
  target: NodeType,
  options: EdgePathOptions<NodeType> = {},
) {
  let edgePosition = getEdgePosition(source, target, options);
  let pathOptions = edge.pathOptions ?? {};

  switch (edge.type) {
    case 'straight':
      return getStraightPath(edgePosition);
    case 'step':
      return getSmoothStepPath({
        ...edgePosition,
        borderRadius: 0,
        offset: pathOptions.offset,
      });
    case 'smoothstep':
      return getSmoothStepPath({
        ...edgePosition,
        borderRadius: pathOptions.borderRadius,
        offset: pathOptions.offset,
        stepPosition: pathOptions.stepPosition,
      });
    default:
      return getBezierPath({
        ...edgePosition,
        curvature: pathOptions.curvature,
      });
  }
}

export function getEdgePosition<NodeType extends Node = Node>(
  source: NodeType,
  target: NodeType,
  options: EdgePathOptions<NodeType> = {},
): EdgePosition {
  let sourcePosition = source.sourcePosition ?? Position.Bottom;
  let targetPosition = target.targetPosition ?? Position.Top;
  let sourceHandle = getHandlePosition(source, sourcePosition, options);
  let targetHandle = getHandlePosition(target, targetPosition, options);

  return {
    sourceX: sourceHandle.x,
    sourceY: sourceHandle.y,
    sourcePosition,
    targetX: targetHandle.x,
    targetY: targetHandle.y,
    targetPosition,
  };
}

export function getHandlePosition<NodeType extends Node = Node>(
  node: NodeType,
  position: Position,
  options: EdgePathOptions<NodeType> = {},
) {
  let width = options.getNodeWidth?.(node) ?? node.width ?? node.initialWidth ?? node.measured?.width ?? 150;
  let height = options.getNodeHeight?.(node) ?? node.height ?? node.initialHeight ?? node.measured?.height ?? 40;
  let { x, y } = options.getNodePosition?.(node) ?? node.position;

  switch (position) {
    case Position.Top:
      return { x: x + width / 2, y };
    case Position.Right:
      return { x: x + width, y: y + height / 2 };
    case Position.Bottom:
      return { x: x + width / 2, y: y + height };
    case Position.Left:
      return { x, y: y + height / 2 };
  }
}
