import { derived } from 'svelte/store';
import { groupEdgesByZLevel, isEdgeVisible, getEdgePosition } from '@xyflow/system';

import type { EdgeLayouted } from '$lib/types';
import type { SvelteFlowStoreState } from './types';

export function getEdgeTree(store: SvelteFlowStoreState) {
  const visibleEdges = derived(
    [
      store.edges,
      store.nodes,
      store.onlyRenderVisibleElements,
      store.viewport,
      store.width,
      store.height
    ],
    ([edges, nodes, onlyRenderVisibleElements, viewport, width, height]) => {
      const visibleEdges =
        onlyRenderVisibleElements && width && height
          ? edges.filter((edge) => {
              const sourceNode = nodes.find((node) => node.id === edge.source);
              const targetNode = nodes.find((node) => node.id === edge.target);

              return (
                sourceNode &&
                targetNode &&
                isEdgeVisible({
                  sourceNode,
                  targetNode,
                  width,
                  height,
                  transform: [viewport.x, viewport.y, viewport.zoom]
                })
              );
            })
          : edges;

      return visibleEdges;
    }
  );

  return derived(
    [visibleEdges, store.nodes, store.connectionMode, store.onError],
    ([visibleEdges, nodes, connectionMode, onError]) => {
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
            ...edgePosition
          });
        }

        return res;
      }, []);

      const groupedEdges = groupEdgesByZLevel<EdgeLayouted>(layoutedEdges, nodes, false);

      return groupedEdges;
    }
  );
}
