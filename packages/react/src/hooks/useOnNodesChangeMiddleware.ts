import { useEffect, useState } from 'react';
import type { NodeChange } from '@xyflow/system';

import { useReactFlowStoreApi } from './useReactFlowStore';
import type { Edge, Node } from '../types';

/**
 * Registers a middleware function to transform node changes.
 *
 * @public
 * @param fn - Middleware function. Should be memoized with useCallback to avoid re-registration.
 */
export function experimental_useOnNodesChangeMiddleware<NodeType extends Node = Node>(
  fn: (changes: NodeChange<NodeType>[]) => NodeChange<NodeType>[]
) {
  const { optionsStore } = useReactFlowStoreApi<NodeType, Edge>();
  const [symbol] = useState(() => Symbol());

  useEffect(() => {
    const { onNodesChangeMiddlewareMap } = optionsStore.getState();
    onNodesChangeMiddlewareMap.set(symbol, fn);
  }, [fn]);

  useEffect(() => {
    const { onNodesChangeMiddlewareMap } = optionsStore.getState();
    return () => {
      onNodesChangeMiddlewareMap.delete(symbol);
    };
  }, []);
}
