import { shallow } from 'zustand/shallow';

import { useStore } from './useStore';
import type { ReactFlowStore } from '../types/store';

const selector = (s: ReactFlowStore) => ({
  startHandle: s.connectionStartHandle,
  endHandle: s.connectionEndHandle,
  status: s.connectionStatus,
  position: s.connectionStartHandle ? s.connectionPosition : null,
});

type UseConnectionResult = {
  /** The start handle where the user interaction started or null */
  startHandle: ReactFlowStore['connectionStartHandle'];
  /** The target handle that's inside the connection radius or null  */
  endHandle: ReactFlowStore['connectionEndHandle'];
  /** The current connection status 'valid', 'invalid' or null*/
  status: ReactFlowStore['connectionStatus'];
  /** The current connection position or null */
  position: ReactFlowStore['connectionPosition'] | null;
};

/**
 * Hook for accessing the ongoing connection.
 *
 * @public
 * @returns ongoing connection
 */
export function useConnection(): UseConnectionResult {
  const ongoingConnection = useStore(selector, shallow);

  return ongoingConnection;
}
