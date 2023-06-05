import { useRef, type FC, type PropsWithChildren } from 'react';
import { type StoreApi } from 'zustand';

import { Provider } from '../../contexts/RFStoreContext';
import { createRFStore } from '../../store';
import type { ReactFlowState } from '../../types';

const ReactFlowProvider: FC<PropsWithChildren<unknown>> = ({ children }) => {
  const storeRef = useRef<StoreApi<ReactFlowState> | null>(null);

  if (!storeRef.current) {
    storeRef.current = createRFStore();
  }

  return <Provider value={storeRef.current}>{children}</Provider>;
};

ReactFlowProvider.displayName = 'ReactFlowProvider';

export default ReactFlowProvider;
