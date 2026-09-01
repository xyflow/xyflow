import { useCallback } from 'react';
import { isEdgeVisible } from '@xyflow/system';

import { useCustomDiff, useReactFlowStore } from './useReactFlowStore';
import { type ReactFlowState } from '../types';

/**
 * Hook for getting the visible edge ids from the store.
 *
 * @internal
 * @param onlyRenderVisible
 * @returns array with visible edge ids
 */
export function useVisibleEdgeIds(onlyRenderVisible: boolean): string[] {
  const edgeIds = useReactFlowStore(
    useCustomDiff(
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
                isEdgeVisible({
                  sourceNode,
                  targetNode,
                  width: s.width,
                  height: s.height,
                  transform: s.transform,
                })
              ) {
                visibleEdgeIds.push(edge.id);
              }
            }
          }

          return visibleEdgeIds;
        },
        [onlyRenderVisible]
      ),
      areEqual
    )
  );

  return edgeIds;
}

function areEqual(a: string[], b: string[]): boolean {
  if (a === b) {
    return true;
  }

  if (a.length !== b.length) {
    return false;
  }

  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) {
      return false;
    }
  }

  return true;
}
