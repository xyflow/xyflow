import { useCallback } from 'react';
import { shallow } from 'zustand/shallow';
import { getNodesInside } from '@xyflow/system';

import { useStoreApi } from './useStore';
import { useExternalSnapshot } from './useExternalSnapshot';
import type { Node } from '../types';

/**
 * Hook for getting the visible node ids from the store.
 *
 * The id list only changes on a structural change (add/remove/reorder), or, when culling, on a
 * viewport/position change, so we recompute only on the node-list channel (plus the store when
 * culling) rather than on every emit.
 *
 * @internal
 * @param onlyRenderVisible
 * @returns array with visible node ids
 */
export function useVisibleNodeIds(onlyRenderVisible: boolean): string[] {
  const store = useStoreApi();

  const compute = useCallback((): string[] => {
    const s = store.getState();
    return onlyRenderVisible
      ? getNodesInside<Node>(s.nodeLookup, { x: 0, y: 0, width: s.width, height: s.height }, s.transform, true).map(
          (node) => node.id
        )
      : Array.from(s.nodeLookup.keys());
  }, [store, onlyRenderVisible]);

  const subscribe = useCallback(
    (onChange: () => void) => {
      const unsubList = store.getState().subscribeNodesList(onChange);
      if (!onlyRenderVisible) {
        return unsubList;
      }
      // culling additionally depends on the viewport and node positions, so also wake on any emit
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
