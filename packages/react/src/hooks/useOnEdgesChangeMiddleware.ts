import { useEffect, useState } from 'react';
import type { EdgeChange } from '@xyflow/system';

import { useStoreApi } from './useStore';
import type { Edge, Node } from '../types';

/**
 * Registers a middleware function to transform edge changes.
 *
 * @public
 * @param fn - Middleware function. Should be memoized with useCallback to avoid re-registration.
 */
export function experimental_useOnEdgesChangeMiddleware<EdgeType extends Edge = Edge>(
  fn: (changes: EdgeChange<EdgeType>[]) => EdgeChange<EdgeType>[]
) {
  const store = useStoreApi<Node, EdgeType>();
  const [symbol] = useState(() => Symbol());

  useEffect(() => {
    const { onEdgesChangeMiddlewareMap } = store.getState();
    onEdgesChangeMiddlewareMap.set(symbol, fn);
  }, [fn]);

  useEffect(() => {
    const { onEdgesChangeMiddlewareMap } = store.getState();
    return () => {
      onEdgesChangeMiddlewareMap.delete(symbol);
    };
  }, []);
}
