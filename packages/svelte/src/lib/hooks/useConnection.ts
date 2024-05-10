import { useStore } from '$lib/store';
import type { ConnectionProps, NoConnectionProps } from '$lib/store/derived-connection';

/**
 * Hook for receiving the current connection.
 *
 * @public
 * @returns current connection as a readable store
 */
export function useConnection(): ConnectionProps | NoConnectionProps {
  const store = useStore();

  return {
    get sourceX() {
      return store.connection.sourceX;
    },
    get sourceY() {
      return store.connection.sourceY;
    },
    get sourcePosition() {
      return store.connection.sourcePosition;
    },
    get targetX() {
      return store.connection.targetX;
    },
    get targetY() {
      return store.connection.targetY;
    },
    get targetPosition() {
      return store.connection.targetPosition;
    },
    get pointerPosition() {
      return store.connection.pointerPosition;
    },
    get startHandle() {
      return store.connection.startHandle;
    },
    get endHandle() {
      return store.connection.endHandle;
    },
    get status() {
      return store.connection.status;
    }
  } as ConnectionProps | NoConnectionProps;
}
