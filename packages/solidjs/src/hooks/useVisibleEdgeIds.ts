import { isEdgeVisible } from '@xyflow/system';

import { useStore } from './useStore';
import { type SolidFlowState } from '../types';

/**
 * Hook for getting the visible edge ids from the store.
 *
 * @internal
 * @param onlyRenderVisible
 * @returns array with visible edge ids
 */
export function useVisibleEdgeIds(onlyRenderVisible: () => boolean): () => string[] {
  const edgeIds = useStore(
    (s: SolidFlowState) => () => {
      if (!onlyRenderVisible()) {
        return s.edges.get().map((edge) => edge.id);
      }

      const visibleEdgeIds = [];

      if (s.width && s.height) {
        for (const edge of s.edges.get()) {
          const sourceNode = s.nodeLookup.get(edge.source);
          const targetNode = s.nodeLookup.get(edge.target);

          if (
            sourceNode &&
            targetNode &&
            isEdgeVisible({
              sourceNode,
              targetNode,
              width: s.width.get(),
              height: s.height.get(),
              transform: s.transform.get(),
            })
          ) {
            visibleEdgeIds.push(edge.id);
          }
        }
      }

      return visibleEdgeIds;
    });

  return edgeIds;
}
