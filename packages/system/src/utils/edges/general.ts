import { Transform, internalsSymbol } from '../..';
import { BaseEdge, BaseNode } from '../../types';
import { isNumeric, getOverlappingArea, boxToRect, nodeToBox, getBoundsOfBoxes } from '../utils';

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
  sourceNode: BaseNode;
  targetNode: BaseNode;
  width: number;
  height: number;
  transform: Transform;
};

export function isEdgeVisible({ sourceNode, targetNode, width, height, transform }: IsEdgeVisibleParams): boolean {
  const edgeBox = getBoundsOfBoxes(nodeToBox(sourceNode), nodeToBox(targetNode));

  if (edgeBox.x === edgeBox.x2) {
    edgeBox.x2 += 1;
  }

  if (edgeBox.y === edgeBox.y2) {
    edgeBox.y2 += 1;
  }

  const viewRect = {
    x: -transform[0] / transform[2],
    y: -transform[1] / transform[2],
    width: width / transform[2],
    height: height / transform[2],
  };

  return getOverlappingArea(viewRect, boxToRect(edgeBox)) > 0;
}
