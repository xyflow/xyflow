import { createContext, useContext, type ReactNode } from 'react';
import { shallow } from 'zustand/shallow';
import type { AriaLabelConfig } from '@xyflow/system';

import { useStore } from '../hooks/useStore';
import type { ReactFlowState } from '../types';

type HandleConfig = {
  connectOnClick: boolean;
  noPanClassName: string;
  rfId: string;
  handlesFocusable: boolean;
  disableKeyboardA11y: boolean;
  ariaLabelConfig: AriaLabelConfig;
};

const selector = (s: ReactFlowState): HandleConfig => ({
  connectOnClick: s.connectOnClick,
  noPanClassName: s.noPanClassName,
  rfId: s.rfId,
  handlesFocusable: s.handlesFocusable,
  disableKeyboardA11y: s.disableKeyboardA11y,
  ariaLabelConfig: s.ariaLabelConfig,
});

const HandleConfigContext = createContext<HandleConfig | null>(null);

/*
 * `connectOnClick`, `noPanClassName` and `rfId` are the same for every handle, so they are
 * shared through context from a single store subscription.
 */
export function HandleConfigProvider({ children }: { children: ReactNode }) {
  const config = useStore(selector, shallow);
  return <HandleConfigContext.Provider value={config}>{children}</HandleConfigContext.Provider>;
}

export function useHandleConfig() {
  const config = useContext(HandleConfigContext);

  if (!config) {
    throw new Error('useHandleConfig must be used within a HandleConfigProvider');
  }

  return config;
}
