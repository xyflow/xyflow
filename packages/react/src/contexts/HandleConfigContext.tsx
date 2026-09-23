import { createContext, useContext, type ReactNode } from 'react';

import { useReactFlowStore, useShallow } from '../hooks/useReactFlowStore';
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
  const config = useReactFlowStore(
    useShallow((s) => ({
      connectOnClick: s.connectOnClick,
      noPanClassName: s.noPanClassName,
      rfId: s.rfId,
      connectionMode: s.connectionMode,
    }))
  );

  return <HandleConfigContext.Provider value={config}>{children}</HandleConfigContext.Provider>;
}

export function useHandleConfig() {
  const config = useContext(HandleConfigContext);

  if (!config) {
    throw new Error('useHandleConfig must be used within a HandleConfigProvider');
  }

  return config;
}
