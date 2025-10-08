import { useEffect, useRef } from 'react';
import type { EdgeChange, NodeChange } from '@xyflow/system';

import { useStoreApi } from './useStore';
import type { Edge, Node } from '../types';

/**
 * We identify each middleware with a symbol that is unique for each hook instance.
 */
function useSymbol() {
  const symbol = useRef<symbol>();
  if (!symbol.current) {
    symbol.current = Symbol();
  }
  return symbol;
}

export function experimental_useOnNodesChangeMiddleware<NodeType extends Node = Node>(
  fn: (changes: NodeChange<NodeType>[]) => NodeChange<NodeType>[]
) {
  const store = useStoreApi<NodeType, Edge>();
  const symbol = useSymbol();

  useEffect(() => {
    const { onNodesChangeMiddlewareMap } = store.getState();
    onNodesChangeMiddlewareMap.set(symbol.current!, fn);
  }, [fn]);

  useEffect(() => {
    const { onNodesChangeMiddlewareMap } = store.getState();
    return () => {
      onNodesChangeMiddlewareMap.delete(symbol.current!);
    };
  }, []);
}

export function experimental_useOnEdgesChangeMiddleware<EdgeType extends Edge = Edge>(
  fn: (changes: EdgeChange<EdgeType>[]) => EdgeChange<EdgeType>[]
) {
  const store = useStoreApi<Node, EdgeType>();
  const symbol = useSymbol();

  useEffect(() => {
    const { onEdgesChangeMiddlewareMap } = store.getState();
    onEdgesChangeMiddlewareMap.set(symbol.current!, fn);
  }, [fn]);

  useEffect(() => {
    const { onEdgesChangeMiddlewareMap } = store.getState();
    return () => {
      onEdgesChangeMiddlewareMap.delete(symbol.current!);
    };
  }, []);
}
