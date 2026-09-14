import { useCallback } from 'react';
import { isEdgeVisible } from '@xyflow/system';

import { useShallow, useEdgesStore, useNodesStore, useViewportStore } from './useReactFlowStore';
import { type EdgesStore } from '../types';

/**
 * Hook for getting the visible edge ids from the store.
 *
 * @internal
 * @param onlyRenderVisible
 * @returns array with visible edge ids
 */
export function useVisibleEdgeIds(onlyRenderVisible: boolean): string[] {
  const viewport = useViewportStore((s) => (onlyRenderVisible ? s : undefined));
  const nodes = useNodesStore((s) => (onlyRenderVisible ? s : undefined));
  const edgeIds = useEdgesStore(
    useShallow(
      useCallback(
        (s: EdgesStore) => {
          if (!onlyRenderVisible) {
            return s.edges.map((edge) => edge.id);
          }

          const visibleEdgeIds = [];

          if (viewport!.width && viewport!.height) {
            for (const edge of s.edges) {
              const sourceNode = nodes!.nodeLookup.get(edge.source);
              const targetNode = nodes!.nodeLookup.get(edge.target);

              if (
                sourceNode &&
                targetNode &&
                isEdgeVisible({
                  sourceNode,
                  targetNode,
                  width: viewport!.width,
                  height: viewport!.height,
                  transform: viewport!.transform,
                })
              ) {
                visibleEdgeIds.push(edge.id);
              }
            }
          }

          return visibleEdgeIds;
        },
        [onlyRenderVisible, viewport, nodes]
      )
    )
  );

  return edgeIds;
}
