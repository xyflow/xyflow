import { useEffect, useRef } from 'react';

import { useReactFlow } from './useReactFlow';
import type { OnInit, Node, Edge } from '../types';

/**
 * Hook for calling onInit handler.
 *
 * @internal
 */
export function useOnInitHandler<NodeType extends Node = Node, EdgeType extends Edge = Edge>(
  onInit: OnInit<NodeType, EdgeType> | undefined
) {
  const rfInstance = useReactFlow<NodeType, EdgeType>();
  const isInitialized = useRef<boolean>(false);

  useEffect(() => {
    if (!isInitialized.current && rfInstance.viewportInitialized && onInit) {
      setTimeout(() => onInit(rfInstance), 1);
      isInitialized.current = true;
    }
  }, [onInit, rfInstance.viewportInitialized]);
}
