import { useRef } from 'react';
import type { FC, PropsWithChildren } from 'react';
import { StoreApi } from 'zustand';
import type { ReactFlowState } from '@reactflow/system';

import { Provider } from '../../contexts/RFStoreContext';
import { createRFStore } from '../../store';

const ReactFlowProvider: FC<PropsWithChildren<unknown>> = ({ children }) => {
  const storeRef = useRef<StoreApi<ReactFlowState> | null>(null);

  if (!storeRef.current) {
    storeRef.current = createRFStore();
  }

  return <Provider value={storeRef.current}>{children}</Provider>;
};

ReactFlowProvider.displayName = 'ReactFlowProvider';

export default ReactFlowProvider;
