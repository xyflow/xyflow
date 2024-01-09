import { useEffect, useRef } from 'react';

import { useReactFlow } from './useReactFlow';
import type { OnInit } from '../types';

/**
 * Hook for calling onInit handler.
 *
 * @internal
 */
export function useOnInitHandler(onInit: OnInit | undefined) {
  const rfInstance = useReactFlow();
  const isInitialized = useRef<boolean>(false);

  useEffect(() => {
    if (!isInitialized.current && rfInstance.viewportInitialized && onInit) {
      setTimeout(() => onInit(rfInstance), 1);
      isInitialized.current = true;
    }
  }, [onInit, rfInstance.viewportInitialized]);
}
