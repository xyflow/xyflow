import { useEffect, useRef } from 'react';
import type { OnInit } from '@reactflow/system';

import useReactFlow from './useReactFlow';

function useOnInitHandler(onInit: OnInit | undefined) {
  const rfInstance = useReactFlow();
  const isInitialized = useRef<boolean>(false);

  useEffect(() => {
    if (!isInitialized.current && rfInstance.viewportInitialized && onInit) {
      setTimeout(() => onInit(rfInstance), 1);
      isInitialized.current = true;
    }
  }, [onInit, rfInstance.viewportInitialized]);
}

export default useOnInitHandler;
