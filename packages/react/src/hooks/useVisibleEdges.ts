import { useCallback } from 'react';
import {
  BaseNode,
  internalsSymbol,
  isNumeric,
  errorMessages,
  ConnectionMode,
  Position,
  getHandle,
  OnError,
} from '@xyflow/system';

import { useStore } from '../hooks/useStore';
import { getEdgePositions, getNodeData, isEdgeVisible } from '../container/EdgeRenderer/utils';
import { type ReactFlowState, type NodeInternals, type Edge, EdgePosition } from '../types';
import { shallow } from 'zustand/shallow';

const defaultEdgeTree = [{ level: 0, isMaxLevel: true, edges: [] }];

type GroupedEdges = {
  edges: Edge[];
  level: number;
  isMaxLevel: boolean;
};

function groupEdgesByZLevel(edges: Edge[], nodeInternals: NodeInternals, elevateEdgesOnSelect = false): GroupedEdges[] {
  let maxLevel = -1;

  const levelLookup = edges.reduce<Record<string, Edge[]>>((tree, edge) => {
    const hasZIndex = isNumeric(edge.zIndex);
    let z = hasZIndex ? edge.zIndex! : 0;

    if (elevateEdgesOnSelect) {
      z = hasZIndex
        ? edge.zIndex!
        : Math.max(
            nodeInternals.get(edge.source)?.[internalsSymbol]?.z || 0,
            nodeInternals.get(edge.target)?.[internalsSymbol]?.z || 0
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

type LayoutEdgeParams = {
  sourceNode: BaseNode;
  sourceHandle: string | null;
  targetNode: BaseNode;
  targetHandle: string | null;
  connectionMode: ConnectionMode;
  onError?: OnError;
};

export function getEdgePosition(params: LayoutEdgeParams): EdgePosition | null {
  const [sourceNodeRect, sourceHandleBounds, sourceIsValid] = getNodeData(params.sourceNode);
  const [targetNodeRect, targetHandleBounds, targetIsValid] = getNodeData(params.targetNode);

  if (!sourceIsValid || !targetIsValid) {
    return null;
  }

  // when connection type is loose we can define all handles as sources and connect source -> source
  const targetNodeHandles =
    params.connectionMode === ConnectionMode.Strict
      ? targetHandleBounds!.target
      : (targetHandleBounds!.target ?? []).concat(targetHandleBounds!.source ?? []);
  const sourceHandle = getHandle(sourceHandleBounds!.source!, params.sourceHandle);
  const targetHandle = getHandle(targetNodeHandles!, params.targetHandle);
  const sourcePosition = sourceHandle?.position || Position.Bottom;
  const targetPosition = targetHandle?.position || Position.Top;

  if (!sourceHandle || !targetHandle) {
    params.onError?.('008', errorMessages['error008'](sourceHandle, {} as Edge));

    return null;
  }

  const { sourceX, sourceY, targetX, targetY } = getEdgePositions(
    sourceNodeRect,
    sourceHandle,
    sourcePosition,
    targetNodeRect,
    targetHandle,
    targetPosition
  );

  return {
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
  };
}

function useVisibleEdges(onlyRenderVisible: boolean, elevateEdgesOnSelect: boolean): GroupedEdges[] {
  const edges = useStore(
    useCallback(
      (s: ReactFlowState) => {
        const visibleEdges = onlyRenderVisible
          ? s.edges.filter((e) => {
              const sourceNode = s.nodeInternals.get(e.source);
              const targetNode = s.nodeInternals.get(e.target);

              return (
                sourceNode?.width &&
                sourceNode?.height &&
                targetNode?.width &&
                targetNode?.height &&
                isEdgeVisible({
                  sourcePos: sourceNode.positionAbsolute || { x: 0, y: 0 },
                  targetPos: targetNode.positionAbsolute || { x: 0, y: 0 },
                  sourceWidth: sourceNode.width,
                  sourceHeight: sourceNode.height,
                  targetWidth: targetNode.width,
                  targetHeight: targetNode.height,
                  width: s.width,
                  height: s.height,
                  transform: s.transform,
                })
              );
            })
          : s.edges;

        return groupEdgesByZLevel(visibleEdges, s.nodeInternals, elevateEdgesOnSelect);
      },
      [onlyRenderVisible, elevateEdgesOnSelect]
    ),
    (groupA, groupB) => {
      const unEqual = groupA.some(
        (item, index) =>
          item.isMaxLevel !== groupB[index].isMaxLevel ||
          item.level !== groupB[index].level ||
          !shallow(item.edges, groupB[index].edges)
      );

      return !unEqual;
    }
  );

  return edges;
}

export default useVisibleEdges;
