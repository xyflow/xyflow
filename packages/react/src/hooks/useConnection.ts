import { shallow } from 'zustand/shallow';

import { useStore } from './useStore';
import type { ReactFlowStore } from '../types/store';
import { ConnectionState, pointToRendererPoint } from '@xyflow/system';

const selector = (s: ReactFlowStore): ConnectionState => {
  return s.connection.inProgress
    ? { ...s.connection, to: pointToRendererPoint(s.connection.to, s.transform) }
    : { ...s.connection };
};
/**
 * Hook for accessing the connection state.
 *
 * @public
 * @returns ConnectionState
 */
export function useConnection(): ConnectionState {
  return useStore(selector, shallow);
}
