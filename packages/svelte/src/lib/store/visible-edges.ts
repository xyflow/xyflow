import { derived } from 'svelte/store';
import { isEdgeVisible, getEdgePosition, getElevatedEdgeZIndex } from '@xyflow/system';

import type { EdgeLayouted } from '$lib/types';
import type { SvelteFlowStoreState } from './types';

export function getVisibleEdges(store: SvelteFlowStoreState) {
  const visibleEdges = derived(
    [
      store.edges,
      store.nodes,
      store.nodeLookup,
      store.onlyRenderVisibleElements,
      store.viewport,
      store.width,
      store.height
    ],
    ([edges, , nodeLookup, onlyRenderVisibleElements, viewport, width, height]) => {
      const visibleEdges =
        onlyRenderVisibleElements && width && height
          ? edges.filter((edge) => {
              const sourceNode = nodeLookup.get(edge.source);
              const targetNode = nodeLookup.get(edge.target);

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
    [visibleEdges, store.nodes, store.nodeLookup, store.connectionMode, store.onerror],
    ([visibleEdges, , nodeLookup, connectionMode, onerror]) => {
      const layoutedEdges = visibleEdges.reduce<EdgeLayouted[]>((res, edge) => {
        const sourceNode = nodeLookup.get(edge.source);
        const targetNode = nodeLookup.get(edge.target);

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
          onError: onerror
        });

        if (edgePosition) {
          res.push({
            ...edge,
            zIndex: getElevatedEdgeZIndex({
              selected: edge.selected,
              zIndex: edge.zIndex,
              sourceNode,
              targetNode,
              elevateOnSelect: false
            }),
            ...edgePosition
          });
        }

        return res;
      }, []);

      return layoutedEdges;
    }
  );
}
