import { useCallback } from 'react';
import { getNodesInside } from '@xyflow/system';

import { useCustomDiff, useReactFlowStore } from './useReactFlowStore';
import type { Node, ReactFlowState } from '../types';

const selector = (onlyRenderVisible: boolean) => (s: ReactFlowState) => {
  return onlyRenderVisible
    ? getNodesInside<Node>(s.nodeLookup, { x: 0, y: 0, width: s.width, height: s.height }, s.transform, true).map(
        (node) => node.id
      )
    : Array.from(s.nodeLookup.keys());
};

/**
 * Hook for getting the visible node ids from the store.
 *
 * @internal
 * @param onlyRenderVisible
 * @returns array with visible node ids
 */
export function useVisibleNodeIds(onlyRenderVisible: boolean) {
  const nodeIds = useReactFlowStore(
    useCustomDiff(useCallback(selector(onlyRenderVisible), [onlyRenderVisible]), areEqual)
  );

  return nodeIds;
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
