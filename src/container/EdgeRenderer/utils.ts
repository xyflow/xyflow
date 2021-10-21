import { ComponentType } from 'react';

import { BezierEdge, StepEdge, SmoothStepEdge, StraightEdge } from '../../components/Edges';
import wrapEdge from '../../components/Edges/wrapEdge';
import { rectToBox } from '../../utils/graph';
import { nodeHelper } from '../../utils/nodes';

import {
  EdgeTypesType,
  EdgeProps,
  Position,
  Node,
  XYPosition,
  ElementId,
  HandleElement,
  Transform,
  Edge,
  Rect,
} from '../../types';

export function createEdgeTypes(edgeTypes: EdgeTypesType): EdgeTypesType {
  const standardTypes: EdgeTypesType = {
    default: wrapEdge((edgeTypes.default || BezierEdge) as ComponentType<EdgeProps>),
    straight: wrapEdge((edgeTypes.bezier || StraightEdge) as ComponentType<EdgeProps>),
    step: wrapEdge((edgeTypes.step || StepEdge) as ComponentType<EdgeProps>),
    smoothstep: wrapEdge((edgeTypes.step || SmoothStepEdge) as ComponentType<EdgeProps>),
  };

  const wrappedTypes = {} as EdgeTypesType;
  const specialTypes: EdgeTypesType = Object.keys(edgeTypes)
    .filter((k) => !['default', 'bezier'].includes(k))
    .reduce((res, key) => {
      res[key] = wrapEdge((edgeTypes[key] || BezierEdge) as ComponentType<EdgeProps>);

      return res;
    }, wrappedTypes);

  return {
    ...standardTypes,
    ...specialTypes,
  };
}

export function getHandlePosition(position: Position, nodeRect: Rect, handle: any | null = null): XYPosition {
  const x = (handle?.x || 0) + nodeRect.x;
  const y = (handle?.y || 0) + nodeRect.y;
  const width = handle?.width || nodeRect.width;
  const height = handle?.height || nodeRect.height;

  switch (position) {
    case Position.Top:
      return {
        x: x + width / 2,
        y,
      };
    case Position.Right:
      return {
        x: x + width,
        y: y + height / 2,
      };
    case Position.Bottom:
      return {
        x: x + width / 2,
        y: y + height,
      };
    case Position.Left:
      return {
        x,
        y: y + height / 2,
      };
  }
}

export function getHandle(bounds: HandleElement[], handleId: ElementId | null): HandleElement | null {
  if (!bounds) {
    return null;
  }

  // there is no handleId when there are no multiple handles/ handles with ids
  // so we just pick the first one
  let handle = null;
  if (bounds.length === 1 || !handleId) {
    handle = bounds[0];
  } else if (handleId) {
    handle = bounds.find((d) => d.id === handleId);
  }

  return typeof handle === 'undefined' ? null : handle;
}

interface EdgePositions {
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
}

export const getEdgePositions = (
  sourceNodeRect: Rect,
  sourceHandle: HandleElement | unknown,
  sourcePosition: Position,
  targetNodeRect: Rect,
  targetHandle: HandleElement | unknown,
  targetPosition: Position
): EdgePositions => {
  const sourceHandlePos = getHandlePosition(sourcePosition, sourceNodeRect, sourceHandle);
  const targetHandlePos = getHandlePosition(targetPosition, targetNodeRect, targetHandle);

  return {
    sourceX: sourceHandlePos.x,
    sourceY: sourceHandlePos.y,
    targetX: targetHandlePos.x,
    targetY: targetHandlePos.y,
  };
};

interface IsEdgeVisibleParams {
  sourcePos: XYPosition;
  targetPos: XYPosition;
  sourceWidth: number;
  sourceHeight: number;
  targetWidth: number;
  targetHeight: number;
  width: number;
  height: number;
  transform: Transform;
}

export function isEdgeVisible({
  sourcePos,
  targetPos,
  sourceWidth,
  sourceHeight,
  targetWidth,
  targetHeight,
  width,
  height,
  transform,
}: IsEdgeVisibleParams): boolean {
  const edgeBox = {
    x: Math.min(sourcePos.x, targetPos.x),
    y: Math.min(sourcePos.y, targetPos.y),
    x2: Math.max(sourcePos.x + sourceWidth, targetPos.x + targetWidth),
    y2: Math.max(sourcePos.y + sourceHeight, targetPos.y + targetHeight),
  };

  if (edgeBox.x === edgeBox.x2) {
    edgeBox.x2 += 1;
  }

  if (edgeBox.y === edgeBox.y2) {
    edgeBox.y2 += 1;
  }

  const viewBox = rectToBox({
    x: (0 - transform[0]) / transform[2],
    y: (0 - transform[1]) / transform[2],
    width: width / transform[2],
    height: height / transform[2],
  });

  const xOverlap = Math.max(0, Math.min(viewBox.x2, edgeBox.x2) - Math.max(viewBox.x, edgeBox.x));
  const yOverlap = Math.max(0, Math.min(viewBox.y2, edgeBox.y2) - Math.max(viewBox.y, edgeBox.y));
  const overlappingArea = Math.ceil(xOverlap * yOverlap);

  return overlappingArea > 0;
}

type SourceTargetNode = {
  sourceNode: Node | null;
  targetNode: Node | null;
};

export const getSourceTargetNodes = (edge: Edge, nodes: Node[]): SourceTargetNode => {
  const sourceNode = nodeHelper(nodes).find((n) => n.id === edge.source) || null;
  const targetNode = nodeHelper(nodes).find((n) => n.id === edge.target) || null;

  return {
    sourceNode,
    targetNode,
  };

  // return nodeHelper(nodes)
  //   .flatten()
  //   .reduce(
  //     (res, node) => {
  //       if (node.id === edge.source) {
  //         res.sourceNode = node;
  //       }
  //       if (node.id === edge.target) {
  //         res.targetNode = node;
  //       }
  //       return res;
  //     },
  //     { sourceNode: null, targetNode: null } as SourceTargetNode
  //   );
};
