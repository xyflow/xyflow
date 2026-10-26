import { useCallback } from 'react';
import { shallow } from 'zustand/shallow';
import { isEdgeVisible } from '@xyflow/system';

import { useStore } from './useStore';
import { type ReactFlowState, type IsEdgeVisible } from '../types';

/**
 * Hook for getting the visible edge ids from the store.
 *
 * @internal
 * @param onlyRenderVisible
 * @returns array with visible edge ids
 */
export function useVisibleEdgeIds(
  onlyRenderVisible: boolean,
  isEdgeVisibleCallback?: IsEdgeVisible
): string[] {
  const edgeIds = useStore(
    useCallback(
      (s: ReactFlowState) => {
        if (!onlyRenderVisible) {
          return s.edges.map((edge) => edge.id);
        }

        const visibleEdgeIds = [];

        if (s.width && s.height) {
          for (const edge of s.edges) {
            const sourceNode = s.nodeLookup.get(edge.source);
            const targetNode = s.nodeLookup.get(edge.target);

            if (
              sourceNode &&
              targetNode &&
              (isEdgeVisibleCallback
                ? isEdgeVisibleCallback({
                    edge,
                    sourceNode,
                    targetNode,
                    width: s.width,
                    height: s.height,
                    transform: s.transform,
                  })
                : isEdgeVisible({
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
        }

        return visibleEdgeIds;
      },
      [onlyRenderVisible, isEdgeVisibleCallback]
    ),
    shallow
  );

  return edgeIds;
}
