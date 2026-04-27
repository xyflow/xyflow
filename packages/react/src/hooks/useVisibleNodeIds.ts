import { shallow } from 'zustand/shallow';
import { getNodesInside } from '@xyflow/system';

import { useStore } from './useStore';
import type { Node } from '../types';

/**
 * Hook for getting the visible node ids from the store.
 *
 * @internal
 * @param onlyRenderVisible
 * @returns array with visible node ids
 */
export function useVisibleNodeIds(onlyRenderVisible: boolean) {
  const nodeIds = useStore(
    onlyRenderVisible
      ? (s) =>
          getNodesInside<Node>(s.nodeLookup, { x: 0, y: 0, width: s.width, height: s.height }, s.transform, true).map(
            (node) => node.id
          )
      : (s) => Array.from(s.nodeLookup.keys()),
    shallow
  );

  return nodeIds;
}
