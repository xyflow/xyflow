import { createContext, useContext, type ReactNode } from 'react';

import { useReactFlowStore } from '../hooks/useReactFlowStore';
import { ConnectionMode } from '@xyflow/system';

type HandleConfig = {
  connectOnClick: boolean;
  noPanClassName: string;
  rfId: string;
  connectionMode: ConnectionMode;
};

const HandleConfigContext = createContext<HandleConfig | null>(null);

/*
 * `connectOnClick`, `noPanClassName` and `rfId` are the same for every handle, so they are
 * shared through context from one provider.
 */
export function HandleConfigProvider({ children }: { children: ReactNode }) {
  const { connectOnClick, noPanClassName, rfId, connectionMode } = useReactFlowStore();

  const config = { connectOnClick, noPanClassName, rfId, connectionMode };
  return <HandleConfigContext.Provider value={config}>{children}</HandleConfigContext.Provider>;
}

export function useHandleConfig() {
  const config = useContext(HandleConfigContext);

  if (!config) {
    throw new Error('useHandleConfig must be used within a HandleConfigProvider');
  }

  return config;
}
