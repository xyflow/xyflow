import { Transform, internalsSymbol } from '../..';
import {
  Position,
  type HandleElement,
  type MarkerType,
  type Rect,
  type XYPosition,
  BaseEdge,
  BaseNode,
} from '../../types';
import { isNumeric, rectToBox } from '../utils';

// this is used for straight edges and simple smoothstep edges (LTR, RTL, BTT, TTB)
export function getEdgeCenter({
  sourceX,
  sourceY,
  targetX,
  targetY,
}: {
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
}): [number, number, number, number] {
  const xOffset = Math.abs(targetX - sourceX) / 2;
  const centerX = targetX < sourceX ? targetX + xOffset : targetX - xOffset;

  const yOffset = Math.abs(targetY - sourceY) / 2;
  const centerY = targetY < sourceY ? targetY + yOffset : targetY - yOffset;

  return [centerX, centerY, xOffset, yOffset];
}

export const getMarkerEnd = (markerType?: MarkerType, markerEndId?: string): string => {
  if (typeof markerEndId !== 'undefined' && markerEndId) {
    return `url(#${markerEndId})`;
  }

  return typeof markerType !== 'undefined' ? `url(#react-flow__${markerType})` : 'none';
};

export function getHandlePosition(position: Position, nodeRect: Rect, handle: HandleElement | null = null): XYPosition {
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

export function getHandle(bounds: HandleElement[], handleId?: string | null): HandleElement | null {
  if (!bounds) {
    return null;
  }

  if (bounds.length === 1 || !handleId) {
    return bounds[0];
  } else if (handleId) {
    return bounds.find((d) => d.id === handleId) || null;
  }

  return null;
}

const defaultEdgeTree = [{ level: 0, isMaxLevel: true, edges: [] }];

export type GroupedEdges<EdgeType extends BaseEdge> = {
  edges: EdgeType[];
  level: number;
  isMaxLevel: boolean;
};

export function groupEdgesByZLevel<EdgeType extends BaseEdge>(
  edges: EdgeType[],
  nodes: Map<string, BaseNode> | BaseNode[],
  elevateEdgesOnSelect = false
): GroupedEdges<EdgeType>[] {
  let maxLevel = -1;

  const isNodeInternals = 'get' in nodes;

  const levelLookup = edges.reduce<Record<string, EdgeType[]>>((tree, edge) => {
    const hasZIndex = isNumeric(edge.zIndex);
    let z = hasZIndex ? edge.zIndex! : 0;

    if (elevateEdgesOnSelect) {
      z = hasZIndex
        ? edge.zIndex!
        : Math.max(
            (isNodeInternals ? nodes.get(edge.source) : nodes.find((n) => n.id === edge.source))?.[internalsSymbol]
              ?.z || 0,
            (isNodeInternals ? nodes.get(edge.target) : nodes.find((n) => n.id === edge.target))?.[internalsSymbol]
              ?.z || 0
          );
    }

    if (tree[z]) {
      tree[z].push(edge);
    } else {
      tree[z] = [edge];
    }

    maxLevel = z > maxLevel ? z : maxLevel;

    return tree;
  }, {});

  const edgeTree = Object.entries(levelLookup).map(([key, edges]) => {
    const level = +key;

    return {
      edges,
      level,
      isMaxLevel: level === maxLevel,
    };
  });

  if (edgeTree.length === 0) {
    return defaultEdgeTree;
  }

  return edgeTree;
}

type IsEdgeVisibleParams = {
  sourcePos: XYPosition;
  targetPos: XYPosition;
  sourceWidth: number;
  sourceHeight: number;
  targetWidth: number;
  targetHeight: number;
  width: number;
  height: number;
  transform: Transform;
};

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
