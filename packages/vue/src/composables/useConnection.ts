import type { ConnectionState } from '@xyflow/system';
import type { ComputedRef } from 'vue';
import type { InternalNode, Node } from '../types';
import { pointToRendererPoint } from '@xyflow/system';
import { computed } from 'vue';
import { storeToRefs } from './storeToRefs';
import { useStore } from './useStore';

/**
 * Returns the current connection when there is an active connection interaction. When idle, every field is
 * null (`inProgress: false`). A typical use case is to colorize handles based on whether the connection is
 * valid. The store holds the raw {@link ConnectionState} from `@xyflow/system`; here the `to` endpoint is
 * converted into flow coordinates (viewport-dependent).
 *
 * @public
 * @returns a `ComputedRef<ConnectionState>` — `inProgress: false` (all-null fields) when idle
 */
export function useConnection<NodeType extends Node = Node>(): ComputedRef<ConnectionState<InternalNode<NodeType>>> {
  const { connection, transform } = storeToRefs(useStore<NodeType>());

  return computed<ConnectionState<InternalNode<NodeType>>>(() => {
    const current = connection.value;

    if (!current.inProgress) {
      return current;
    }

    return {
      ...current,
      to: pointToRendererPoint(current.to, [transform.value[0], transform.value[1], transform.value[2]]),
    };
  });
}
