import { createContext, useContext, type ReactNode } from 'react';
import { shallow } from 'zustand/shallow';
import { ConnectionMode, type ZIndexMode } from '@xyflow/system';

import { useStore } from '../hooks/useStore';
import type { DefaultEdgeOptions, ReactFlowState } from '../types';

/*
 * defaultEdgeOptions / connectionMode / elevateEdgesOnSelect / zIndexMode are the same for every
 * edge, so they are shared through context from a single store subscription instead of a per-edge
 * selector.
 */
export type EdgeConfig = {
  defaultEdgeOptions: DefaultEdgeOptions | undefined;
  connectionMode: ConnectionMode;
  elevateEdgesOnSelect: boolean;
  zIndexMode: ZIndexMode;
};

const EdgeConfigContext = createContext<EdgeConfig | null>(null);

const selector = (s: ReactFlowState): EdgeConfig => ({
  defaultEdgeOptions: s.defaultEdgeOptions,
  connectionMode: s.connectionMode,
  elevateEdgesOnSelect: s.elevateEdgesOnSelect,
  zIndexMode: s.zIndexMode,
});

export function EdgeConfigProvider({ children }: { children: ReactNode }) {
  const config = useStore(selector, shallow);
  return <EdgeConfigContext.Provider value={config}>{children}</EdgeConfigContext.Provider>;
}

export function useEdgeConfig(): EdgeConfig {
  const config = useContext(EdgeConfigContext);

  if (!config) {
    throw new Error('useEdgeConfig must be used within an EdgeConfigProvider');
  }

  return config;
}
