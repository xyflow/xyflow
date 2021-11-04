import { useCallback } from 'react';

import { useStore } from '../store';
import { isEdgeVisible } from '../container/EdgeRenderer/utils';
import { ReactFlowState, NodeInternals, Edge } from '../types';

function groupEdgesByTreeLevel(edges: Edge[], nodeInternals: NodeInternals) {
  let maxLevel = -1;

  const levelLookup = edges.reduce<Record<string, Edge[]>>((tree, edge) => {
    const treeLevel = Math.max(
      nodeInternals.get(edge.source)?.treeLevel || 0,
      nodeInternals.get(edge.target)?.treeLevel || 0
    );
    if (tree[treeLevel]) {
      tree[treeLevel].push(edge);
    } else {
      tree[treeLevel] = [edge];
    }

    maxLevel = treeLevel > maxLevel ? treeLevel : maxLevel;

    return tree;
  }, {});

  return Object.entries(levelLookup).map(([key, edges]) => {
    const level = +key;

    return {
      edges,
      level,
      isMaxLevel: level === maxLevel,
    };
  });
}

function useVisibleEdges(onlyRenderVisible: boolean, nodeInternals: NodeInternals) {
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
              sourcePos: sourceNode.position || { x: 0, y: 0 },
              targetPos: targetNode.position || { x: 0, y: 0 },
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

  return groupEdgesByTreeLevel(edges, nodeInternals);
}

export default useVisibleEdges;
