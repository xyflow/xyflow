import { useEffect, useRef } from 'react';

import { useReactFlow } from './useReactFlow';
import type { OnInit, Node } from '../types';

/**
 * Hook for calling onInit handler.
 *
 * @internal
 */
export function useOnInitHandler<NodeType extends Node = Node>(onInit: OnInit<NodeType> | undefined) {
  const rfInstance = useReactFlow<NodeType>();
  const isInitialized = useRef<boolean>(false);

  useEffect(() => {
    if (!isInitialized.current && rfInstance.viewportInitialized && onInit) {
      setTimeout(() => onInit(rfInstance), 1);
      isInitialized.current = true;
    }
  }, [onInit, rfInstance.viewportInitialized]);
}
