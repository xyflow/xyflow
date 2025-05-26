import type { ComputedRef } from 'vue';
import type { ConnectionState, InternalNode, Node } from '../types';
import { computed } from 'vue';
import { storeToRefs } from './storeToRefs';
import { useStore } from './useStore';
import { useVueFlow } from './useVueFlow';

const NO_CONNECTION = Object.freeze({
  inProgress: false,
  isValid: null,
  from: null,
  fromHandle: null,
  fromPosition: null,
  fromNode: null,
  to: null,
  toHandle: null,
  toPosition: null,
  toNode: null,
  pointer: null,
} as const);

/**
 * Access the currently ongoing connection, composed from the store's split connection fields into a
 * single {@link ConnectionState}.
 *
 * @public
 * @returns a `ComputedRef<ConnectionState>` — `inProgress: false` (all-null fields) when idle
 */
export function useConnection<NodeType extends Node = Node>(): ComputedRef<ConnectionState<NodeType>> {
  const { getInternalNode } = useVueFlow();
  const { connectionStartHandle, connectionEndHandle, connectionPosition, connectionStatus } = storeToRefs(useStore<NodeType>());

  return computed<ConnectionState<NodeType>>(() => {
    const fromHandle = connectionStartHandle.value;
    const fromNode = fromHandle ? getInternalNode(fromHandle.nodeId) : undefined;

    // no connection (or its source node vanished) → the resting state
    if (!fromHandle || !fromNode) {
      return NO_CONNECTION;
    }

    const toHandle = connectionEndHandle.value;
    const pointer = connectionPosition.value;

    return {
      inProgress: true,
      isValid: connectionStatus.value === null ? null : connectionStatus.value === 'valid',
      from: { x: fromHandle.x, y: fromHandle.y },
      fromHandle,
      fromPosition: fromHandle.position,
      fromNode: fromNode as InternalNode<NodeType>,
      // `to` snaps to the hovered end handle; falls back to the raw pointer when over empty canvas
      to: toHandle ? { x: toHandle.x, y: toHandle.y } : pointer,
      toHandle: toHandle ?? null,
      toPosition: toHandle?.position ?? null,
      toNode: ((toHandle ? getInternalNode(toHandle.nodeId) : undefined) ?? null) as InternalNode<NodeType> | null,
      pointer,
    };
  });
}
