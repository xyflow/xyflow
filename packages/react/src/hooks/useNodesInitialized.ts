import { nodeHasDimensions } from '@xyflow/system';

import { useStore } from './useStore';
import type { ReactFlowState } from '../types';

export type UseNodesInitializedOptions = {
  /** @default false */
  includeHiddenNodes?: boolean;
};

const selector = (options: UseNodesInitializedOptions) => (s: ReactFlowState) => {
  if (!options.includeHiddenNodes) {
    return s.nodesInitialized;
  }

  if (s.nodeLookup.size === 0) {
    return false;
  }

  for (const [, { internals }] of s.nodeLookup) {
    if (internals.handleBounds === undefined || !nodeHasDimensions(internals.userNode)) {
      return false;
    }
  }

  return true;
};

/**
 * This hook tells you whether all the nodes in a flow have been measured and given
 *a width and height. When you add a node to the flow, this hook will return
 *`false` and then `true` again once the node has been measured.
 *
 * @public
 * @returns Whether or not the nodes have been initialized by the `<ReactFlow />` component and
 * given a width and height.
 *
 * @example
 * ```jsx
 *import { useReactFlow, useNodesInitialized } from '@xyflow/react';
 *import { useEffect, useState } from 'react';
 *
 *const options = {
 *  includeHiddenNodes: false,
 *};
 *
 *export default function useLayout() {
 *  const { getNodes } = useReactFlow();
 *  const nodesInitialized = useNodesInitialized(options);
 *  const [layoutedNodes, setLayoutedNodes] = useState(getNodes());
 *
 *  useEffect(() => {
 *    if (nodesInitialized) {
 *      setLayoutedNodes(yourLayoutingFunction(getNodes()));
 *    }
 *  }, [nodesInitialized]);
 *
 *  return layoutedNodes;
 *}
 *```
 */
export function useNodesInitialized(
  options: UseNodesInitializedOptions = {
    includeHiddenNodes: false,
  }
): boolean {
  const initialized = useStore(selector(options));

  return initialized;
}
