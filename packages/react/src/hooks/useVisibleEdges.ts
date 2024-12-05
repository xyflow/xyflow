import { useCallback } from 'react';
import { shallow } from 'zustand/shallow';
import { isEdgeVisible } from '@xyflow/system';

import { useStore } from './useStore';
import { Edge, type ReactFlowState } from '../types';

/**
 * Hook for getting the visible edge ids from the store.
 *
 * @internal
 * @param onlyRenderVisible
 * @returns array with visible edge ids
 */
export function useVisibleEdges<T extends Edge>(onlyRenderVisible: boolean): T[] {
  return useStore(
    useCallback(
      (s: ReactFlowState) => {
        if (!onlyRenderVisible) {
          return s.edges as T[];
        }

        const visibleEdges = [];

        if (s.width && s.height) {
          for (const edge of s.edges) {
            const sourceNode = s.nodeLookup.get(edge.source);
            const targetNode = s.nodeLookup.get(edge.target);

            if (
              sourceNode &&
              targetNode &&
              isEdgeVisible({
                sourceNode,
                targetNode,
                width: s.width,
                height: s.height,
                transform: s.transform,
              })
            ) {
              visibleEdges.push(edge as T);
            }
          }
        }

        return visibleEdges;
      },
      [onlyRenderVisible]
    ),
    shallow
  );
}
