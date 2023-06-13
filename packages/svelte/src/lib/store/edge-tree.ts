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
