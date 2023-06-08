import { derived } from 'svelte/store';
import { groupEdgesByZLevel, isEdgeVisible, getEdgePosition, type OnError } from '@xyflow/system';

import type { EdgeLayouted } from '$lib/types';
import type { SvelteFlowStoreState } from './types';

export function getEdgeTree(store: SvelteFlowStoreState, onError: OnError) {
  const visibleEdges = derived(
    [
      store.edges,
      store.nodes,
      store.onlyRenderVisibleElements,
      store.transform,
      store.width,
      store.height
    ],
    ([edges, nodes, onlyRenderVisibleElements, transform, width, height]) => {
      const visibleEdges = onlyRenderVisibleElements
        ? edges.filter((edge) => {
            const sourceNode = nodes.find((node) => node.id === edge.source);
            const targetNode = nodes.find((node) => node.id === edge.target);

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
                width,
                height,
                transform
              })
            );
          })
        : edges;

      return visibleEdges;
    }
  );

  return derived(
    [visibleEdges, store.nodes, store.connectionMode],
    ([visibleEdges, nodes, connectionMode]) => {
      const layoutedEdges = visibleEdges.reduce<EdgeLayouted[]>((res, edge) => {
        const sourceNode = nodes.find((node) => node.id === edge.source);
        const targetNode = nodes.find((node) => node.id === edge.target);

        if (!sourceNode || !targetNode) {
          return res;
        }

        const edgePosition = getEdgePosition({
          id: edge.id,
          sourceNode,
          targetNode,
          sourceHandle: edge.sourceHandle || null,
          targetHandle: edge.targetHandle || null,
          connectionMode,
          onError
        });

        if (edgePosition) {
          res.push({
            ...edge,
            sourceX: edgePosition.sourceX,
            sourceY: edgePosition.sourceY,
            targetX: edgePosition.targetX,
            targetY: edgePosition.targetY,
            sourcePosition: edgePosition.sourcePosition,
            targetPosition: edgePosition.targetPosition
          });
        }

        return res;
      }, []);

      const groupedEdges = groupEdgesByZLevel<EdgeLayouted>(layoutedEdges, nodes, false);

      return groupedEdges;
    }
  );
}
