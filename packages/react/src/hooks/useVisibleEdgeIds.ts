import { useCallback } from 'react';
import { shallow } from 'zustand/shallow';
import { isEdgeVisible } from '@xyflow/system';

import { useStore } from './useStore';
import { type ReactFlowState } from '../types';

/**
 * Hook for getting the visible edge ids from the store.
 *
 * @internal
 * @param onlyRenderVisible
 * @returns array with visible edge ids
 */
export function useVisibleEdgeIds(onlyRenderVisible: boolean): string[] {
  const edgeIds = useStore(
    useCallback(
      (s: ReactFlowState) => {
        const visibleEdgeIds = [];

        for (const edge of s.edges) {
          const sourceNode = s.nodeLookup.get(edge.source);
          const targetNode = s.nodeLookup.get(edge.target);

          if (!sourceNode || !targetNode || sourceNode.hidden || targetNode.hidden) {
            continue;
          }

          if (
            !onlyRenderVisible ||
            (s.width &&
              s.height &&
              isEdgeVisible({
                sourceNode,
                targetNode,
                width: s.width,
                height: s.height,
                transform: s.transform,
              }))
          ) {
            visibleEdgeIds.push(edge.id);
          }
        }

        return visibleEdgeIds;
      },
      [onlyRenderVisible]
    ),
    shallow
  );

  return edgeIds;
}
