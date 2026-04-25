import {
  Position,
  getBezierPath,
  getBezierEdgeCenter,
  getSmoothStepPath,
  getStraightPath,
  type EdgePosition,
} from '@xyflow/system';

import type { Edge, Node } from '../types.js';

export interface GetSimpleBezierPathParams {
  sourceX: number;
  sourceY: number;
  sourcePosition?: Position;
  targetX: number;
  targetY: number;
  targetPosition?: Position;
}

interface GetControlParams {
  pos: Position;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

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
    case 'simplebezier':
      return getSimpleBezierPath(edgePosition);
    default:
      return getBezierPath({
        ...edgePosition,
        curvature: pathOptions.curvature,
      });
  }
}

function getControl({ pos, x1, y1, x2, y2 }: GetControlParams): [number, number] {
  if (pos === Position.Left || pos === Position.Right) {
    return [0.5 * (x1 + x2), y1];
  }

  return [x1, 0.5 * (y1 + y2)];
}

export function getSimpleBezierPath({
  sourceX,
  sourceY,
  sourcePosition = Position.Bottom,
  targetX,
  targetY,
  targetPosition = Position.Top,
}: GetSimpleBezierPathParams): [path: string, labelX: number, labelY: number, offsetX: number, offsetY: number] {
  let [sourceControlX, sourceControlY] = getControl({
    pos: sourcePosition,
    x1: sourceX,
    y1: sourceY,
    x2: targetX,
    y2: targetY,
  });
  let [targetControlX, targetControlY] = getControl({
    pos: targetPosition,
    x1: targetX,
    y1: targetY,
    x2: sourceX,
    y2: sourceY,
  });
  let [labelX, labelY, offsetX, offsetY] = getBezierEdgeCenter({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourceControlX,
    sourceControlY,
    targetControlX,
    targetControlY,
  });

  return [
    `M${sourceX},${sourceY} C${sourceControlX},${sourceControlY} ${targetControlX},${targetControlY} ${targetX},${targetY}`,
    labelX,
    labelY,
    offsetX,
    offsetY,
  ];
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
