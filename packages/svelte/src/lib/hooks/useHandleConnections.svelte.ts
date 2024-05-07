import { type HandleConnection, type HandleType } from '@xyflow/system';

import { useStore } from '$lib/store';
import { getContext } from 'svelte';

export type useHandleConnectionsParams = {
  type: HandleType;
  nodeId?: string;
  id?: string | null;
};

const initialConnections: HandleConnection[] = [];

/**
 *  Hook to check if a <Handle /> is connected to another <Handle /> and get the connections.
 *
 * @public
 * @param param.nodeId
 * @param param.type - handle type 'source' or 'target'
 * @param param.id - the handle id (this is only needed if the node has multiple handles of the same type)
 * @returns an array with connections
 */
export function useHandleConnections({ type, nodeId, id = null }: useHandleConnectionsParams) {
  const store = useStore();

  const currentNodeId = nodeId ?? getContext<string>('svelteflow__node_id');

  let connections = $derived.by(() => {
    const nextConnections = store.connectionLookup.get(`${currentNodeId}-${type}-${id}`);
    return Array.from(nextConnections?.values() ?? []);
  });

  return {
    //TODO: whats the standard here
    get value() {
      return connections;
    }
  };
}
