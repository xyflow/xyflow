import { useEffect, useRef } from 'react';

import useReactFlow from './useReactFlow';
import { OnInit } from '../types';

function useOnInitHandler(onInit: OnInit<any> | undefined) {
  const ReactFlowInstance = useReactFlow();
  const isInitialized = useRef<boolean>(false);

  useEffect(() => {
    if (!isInitialized.current && ReactFlowInstance.viewportInitialized && onInit) {
      setTimeout(() => onInit(ReactFlowInstance), 1);
      isInitialized.current = true;
    }
  }, [onInit, ReactFlowInstance.viewportInitialized]);
}

export default useOnInitHandler;
