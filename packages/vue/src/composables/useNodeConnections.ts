import type { HandleType, NodeConnection } from '@xyflow/system';
import type { MaybeRefOrGetter } from 'vue';
import { areConnectionMapsEqual, handleConnectionChange } from '@xyflow/system';
import { computed, shallowRef, toValue, watch } from 'vue';
import { useNodeId } from './useNodeId';
import { useStore } from './useStore';

export type UseNodeConnectionsParams = {
  /** node id - if not provided, the node id from the `useNodeId` context injection is used */
  id?: MaybeRefOrGetter<string | null | undefined>;
  onConnect?: (connections: NodeConnection[]) => void;
  onDisconnect?: (connections: NodeConnection[]) => void;
} & (
  | {
    /** handle type `source` or `target` */
    handleType: MaybeRefOrGetter<HandleType | null | undefined>;
    /** the handle id (only needed if the node has multiple handles of the same type). Requires `handleType` to be set. */
    handleId?: MaybeRefOrGetter<string | null | undefined>;
  }
  // without `handleType` a `handleId` is meaningless at runtime, so the type forbids it (mirrors xyflow/react & xyflow/svelte)
  | { handleType?: MaybeRefOrGetter<HandleType | null | undefined>; handleId?: never }
);

/**
 * Hook to retrieve all edges connected to a node. Can be filtered by handle type and id.
 *
 * @public
 * @param params
 * @param params.handleType - handle type `source` or `target`
 * @param params.id - node id - if not provided, the node id from the `useNodeId` (meaning, the context-based injection) is used
 * @param params.handleId - the handle id (only needed if the node has multiple handles of the same type; requires `handleType` to be set)
 * @param params.onConnect - gets called when a connection is created
 * @param params.onDisconnect - gets called when a connection is removed
 *
 * @returns An array of connections
 */
export function useNodeConnections(params: UseNodeConnectionsParams = {}) {
  const { handleType, handleId, id, onConnect, onDisconnect } = params;

  const store = useStore();

  const nodeId = useNodeId();

  const prevConnections = shallowRef<Map<string, NodeConnection> | null>(null);

  const connections = shallowRef<Map<string, NodeConnection>>();

  const lookupKey = computed(() => {
    const currNodeId = toValue(id) ?? nodeId;
    const currentHandleType = toValue(handleType);
    const currHandleId = toValue(handleId);

    let handleSuffix = '';
    if (currentHandleType) {
      handleSuffix = currHandleId ? `-${currentHandleType}-${currHandleId}` : `-${currentHandleType}`;
    }

    return `${currNodeId}${handleSuffix}`;
  });

  watch(
    () => store.connectionLookup.get(lookupKey.value),
    (nextConnections) => {
      if (areConnectionMapsEqual(connections.value, nextConnections)) {
        return;
      }

      connections.value = nextConnections;
    },
    { immediate: true },
  );

  watch(
    [connections, () => typeof onConnect !== 'undefined', () => typeof onDisconnect !== 'undefined'],
    ([currentConnections = new Map<string, NodeConnection>()]) => {
      if (prevConnections.value && prevConnections.value !== currentConnections) {
        handleConnectionChange(prevConnections.value, currentConnections, onDisconnect);
        handleConnectionChange(currentConnections, prevConnections.value, onConnect);
      }

      prevConnections.value = currentConnections;
    },
    { immediate: true },
  );

  return computed(() => {
    if (!connections.value) {
      return [];
    }

    return Array.from(connections.value.values());
  });
}
