import { useEffect, useRef } from 'react';

import useReactFlow from './useReactFlow';
import { OnPaneReady } from '../types';

function useOnPaneReadyHandler(onPaneReady: OnPaneReady<any> | undefined) {
  const ReactFlowInstance = useReactFlow();
  const isInitialized = useRef<boolean>(false);

  useEffect(() => {
    if (!isInitialized.current && ReactFlowInstance.viewportInitialized && onPaneReady) {
      onPaneReady(ReactFlowInstance);

      isInitialized.current = true;
    }
  }, [onPaneReady, ReactFlowInstance]);
}

export default useOnPaneReadyHandler;
