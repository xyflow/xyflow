import { useCallback } from 'react';
import { shallow } from 'zustand/shallow';
import { isEdgeVisible } from '@xyflow/system';

import { useStoreApi } from './useStore';
import { useExternalSnapshot } from './useExternalSnapshot';

/**
 * Hook for getting the visible edge ids from the store.
 *
 * The id list only changes on an edge membership/order change (add/remove/reorder), or, when
 * culling, on a viewport/endpoint-position change, so we recompute only on the edge-list channel
 * (plus the store when culling) rather than on every emit.
 *
 * @internal
 * @param onlyRenderVisible
 * @returns array with visible edge ids
 */
export function useVisibleEdgeIds(onlyRenderVisible: boolean): string[] {
  const store = useStoreApi();

  const compute = useCallback((): string[] => {
    const s = store.getState();

    if (!onlyRenderVisible) {
      return s.edges.map((edge) => edge.id);
    }

    const next: string[] = [];
    if (s.width && s.height) {
      for (const edge of s.edges) {
        const sourceNode = s.nodeLookup.get(edge.source);
        const targetNode = s.nodeLookup.get(edge.target);

        if (
          sourceNode &&
          targetNode &&
          isEdgeVisible({ sourceNode, targetNode, width: s.width, height: s.height, transform: s.transform })
        ) {
          next.push(edge.id);
        }
      }
    }
    return next;
  }, [store, onlyRenderVisible]);

  const subscribe = useCallback(
    (onChange: () => void) => {
      const unsubList = store.getState().subscribeEdgesList(onChange);
      if (!onlyRenderVisible) {
        return unsubList;
      }
      // culling additionally depends on the viewport and endpoint positions, so also wake on any emit
      const unsubStore = store.subscribe(onChange);
      return () => {
        unsubList();
        unsubStore();
      };
    },
    [store, onlyRenderVisible]
  );

  return useExternalSnapshot(subscribe, compute, shallow);
}
