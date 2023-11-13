import { derived } from 'svelte/store';
import { groupEdgesByZLevel, isEdgeVisible, getEdgePosition } from '@xyflow/system';

import type { EdgeLayouted } from '$lib/types';
import type { SvelteFlowStoreState } from './types';

export function getEdgeTree(store: SvelteFlowStoreState) {
  const visibleEdges = derived(
    [
      store.edges,
      store.nodes,
      store.nodesLookup,
      store.onlyRenderVisibleElements,
      store.viewport,
      store.width,
      store.height
    ],
    ([edges, , nodesLookup, onlyRenderVisibleElements, viewport, width, height]) => {
      const visibleEdges =
        onlyRenderVisibleElements && width && height
          ? edges.filter((edge) => {
              const sourceNode = nodesLookup.get(edge.source);
              const targetNode = nodesLookup.get(edge.target);

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
    [visibleEdges, store.nodes, store.nodesLookup, store.connectionMode, store.onError],
    ([visibleEdges, , nodesLookup, connectionMode, onError]) => {
      const layoutedEdges = visibleEdges.reduce<EdgeLayouted[]>((res, edge) => {
        const sourceNode = nodesLookup.get(edge.source);
        const targetNode = nodesLookup.get(edge.target);

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

      const groupedEdges = groupEdgesByZLevel<EdgeLayouted>(layoutedEdges, nodesLookup, false);

      return groupedEdges;
    }
  );
}
