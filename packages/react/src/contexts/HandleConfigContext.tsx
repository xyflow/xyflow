import { createContext, useContext, type ReactNode } from 'react';

import { useReactFlowStore } from '../hooks/useReactFlowStore';

type HandleConfig = {
  connectOnClick: boolean;
  noPanClassName: string;
  rfId: string;
};

const HandleConfigContext = createContext<HandleConfig | null>(null);

/*
 * `connectOnClick`, `noPanClassName` and `rfId` are the same for every handle, so they are
 * shared through context from one provider.
 */
export function HandleConfigProvider({ children }: { children: ReactNode }) {
  const { connectOnClick, noPanClassName, rfId } = useReactFlowStore();

  const config = { connectOnClick, noPanClassName, rfId };
  return <HandleConfigContext.Provider value={config}>{children}</HandleConfigContext.Provider>;
}

export function useHandleConfig() {
  const config = useContext(HandleConfigContext);

  if (!config) {
    throw new Error('useHandleConfig must be used within a HandleConfigProvider');
  }

  return config;
}
