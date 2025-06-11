import { getNodesInside } from '@xyflow/system';

import { useStore } from './useStore';
import type { Node, SolidFlowState } from '../types';

const selector = (onlyRenderVisible: () => boolean) => (s: SolidFlowState) => {
  return () =>
    onlyRenderVisible()
      ? getNodesInside<Node>(
          s.nodeLookup,
          { x: 0, y: 0, width: s.width.get(), height: s.height.get() },
          s.transform.get(),
          true
        ).map((node) => node.id)
      : (Array.from(s.nodeLookup.keys()) as string[]);
};

/**
 * Hook for getting the visible node ids from the store.
 *
 * @internal
 * @param onlyRenderVisible
 * @returns array with visible node ids
 */
export function useVisibleNodeIds(onlyRenderVisible: () => boolean): () => string[] {
  const nodeIds = useStore(selector(onlyRenderVisible));

  return nodeIds;
}
