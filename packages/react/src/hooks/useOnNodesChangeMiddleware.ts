import { useEffect, useState } from 'react';
import type { NodeChange } from '@xyflow/system';

import { useStoreApi } from './useStore';
import type { Edge, Node } from '../types';

export function experimental_useOnNodesChangeMiddleware<NodeType extends Node = Node>(
  fn: (changes: NodeChange<NodeType>[]) => NodeChange<NodeType>[]
) {
  const store = useStoreApi<NodeType, Edge>();
  const [symbol] = useState(() => Symbol());

  useEffect(() => {
    const { onNodesChangeMiddlewareMap } = store.getState();
    onNodesChangeMiddlewareMap.set(symbol, fn);
  }, [fn]);

  useEffect(() => {
    const { onNodesChangeMiddlewareMap } = store.getState();
    return () => {
      onNodesChangeMiddlewareMap.delete(symbol);
    };
  }, []);
}
