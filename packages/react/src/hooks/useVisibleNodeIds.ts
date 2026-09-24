import { getNodesInside } from '@xyflow/system';

import { useShallow, useNodesStore, useViewportStore } from './useReactFlowStore';
import type { Node, NodesStore, ViewportStore } from '../types';

const selector = (onlyRenderVisible: boolean, viewport: ViewportStore | undefined) => (s: NodesStore) => {
  return onlyRenderVisible
    ? getNodesInside<Node>(
        s.nodeLookup,
        { x: 0, y: 0, width: viewport!.width, height: viewport!.height },
        viewport!.transform,
        true
      ).map((node) => node.id)
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
  const viewport = useViewportStore((s) => (onlyRenderVisible ? s : undefined));
  const nodeIds = useNodesStore(useShallow(selector(onlyRenderVisible, viewport)));

  return nodeIds;
}
