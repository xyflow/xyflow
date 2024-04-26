
import { useStore } from './useStore';
import type { SolidFlowStore } from '../types/store';

const selector = (s: SolidFlowStore) => ({
  startHandle: s.connectionStartHandle,
  endHandle: s.connectionEndHandle,
  status: s.connectionStatus,
  position: s.connectionStartHandle ? s.connectionPosition : null,
});

type UseConnectionResult = {
  /** The start handle where the user interaction started or null */
  startHandle: SolidFlowStore['connectionStartHandle'];
  /** The target handle that's inside the connection radius or null  */
  endHandle: SolidFlowStore['connectionEndHandle'];
  /** The current connection status 'valid', 'invalid' or null*/
  status: SolidFlowStore['connectionStatus'];
  /** The current connection position or null */
  position: SolidFlowStore['connectionPosition'] | null;
};

/**
 * Hook for accessing the ongoing connection.
 *
 * @public
 * @returns ongoing connection
 */
export function useConnection(): UseConnectionResult {
  const ongoingConnection = useStore(selector);

  return ongoingConnection;
}
