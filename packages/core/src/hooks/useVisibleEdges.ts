import { useCallback } from 'react';

import { useStore } from '../hooks/useStore';
import { isEdgeVisible } from '../container/EdgeRenderer/utils';
import { internalsSymbol, isNumeric } from '../utils';
import type { ReactFlowState, NodeInternals, Edge } from '../types';

const defaultEdgeTree = [{ level: 0, isMaxLevel: true, edges: [] }];

function groupEdgesByZLevel(edges: Edge[], nodeInternals: NodeInternals, elevateEdgesOnSelect = false) {
  let maxLevel = -1;

  const levelLookup = edges.reduce<Record<string, Edge[]>>((tree, edge) => {
    const hasZIndex = isNumeric(edge.zIndex);
    let z = hasZIndex ? edge.zIndex! : 0;

    if (elevateEdgesOnSelect) {
      const targetNode = nodeInternals.get(edge.target);
      const sourceNode = nodeInternals.get(edge.source);
      const edgeOrConnectedNodeSelected = edge.selected || targetNode?.selected || sourceNode?.selected;
      const selectedZIndex = Math.max(
        sourceNode?.[internalsSymbol]?.z || 0,
        targetNode?.[internalsSymbol]?.z || 0,
        1000
      );
      z = (hasZIndex ? edge.zIndex! : 0) + (edgeOrConnectedNodeSelected ? selectedZIndex : 0);
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

function useVisibleEdges(onlyRenderVisible: boolean, nodeInternals: NodeInternals, elevateEdgesOnSelect: boolean) {
  const edges = useStore(
    useCallback(
      (s: ReactFlowState) => {
        if (!onlyRenderVisible) {
          return s.edges;
        }

        return s.edges.filter((e) => {
          const sourceNode = nodeInternals.get(e.source);
          const targetNode = nodeInternals.get(e.target);

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
        });
      },
      [onlyRenderVisible, nodeInternals]
    )
  );

  return groupEdgesByZLevel(edges, nodeInternals, elevateEdgesOnSelect);
}

export default useVisibleEdges;
