import { shallow } from 'zustand/shallow';

import { useStore } from './useStore';
import type { ReactFlowStore } from '../types/store';

const selector = (s: ReactFlowStore) => ({
  startHandle: s.connectionStartHandle,
  endHandle: s.connectionEndHandle,
  status: s.connectionStatus,
  position: s.connectionStartHandle ? s.connectionPosition : null,
});

/**
 * Hook for accessing the ongoing connection.
 *
 * @returns ongoing connection: startHandle, endHandle, status, position
 */
export function useConnection(): {
  startHandle: ReactFlowStore['connectionStartHandle'];
  endHandle: ReactFlowStore['connectionEndHandle'];
  status: ReactFlowStore['connectionStatus'];
  position: ReactFlowStore['connectionPosition'] | null;
} {
  const ongoingConnection = useStore(selector, shallow);

  return ongoingConnection;
}
