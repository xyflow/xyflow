import { useStore } from './useStore';
import type { SolidFlowState } from '../types/store';
import { ConnectionState, pointToRendererPoint } from '@xyflow/system';
import type { InternalNode, Node } from '../types';

function storeSelector(s: SolidFlowState) {
  return () => {
    const connection = s.connection.get();
    const result = connection.inProgress
      ? { ...connection, to: pointToRendererPoint(connection.to, s.transform.get()) }
      : { ...connection };

    return result;
  };
}

/**
 * The `useConnection` hook returns the current connection when there is an active
 * connection interaction. If no connection interaction is active, it returns null
 * for every property. A typical use case for this hook is to colorize handles
 * based on a certain condition (e.g. if the connection is valid or not).
 *
 * @public
 * @returns ConnectionState accessor function
 */
export function useConnection(): () => ConnectionState<InternalNode> {
  return useStore(storeSelector);
}
