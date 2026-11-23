import type { ConnectionState, HandleType } from '@xyflow/system';
import type { ComputedRef } from 'vue';
import type { Edge, Node, State } from '../types';
import { computed, toRaw } from 'vue';

type HandleRef = ConnectionState['fromHandle'];

export interface ConnectionSignals {
  /** the handle the drag started from; `XYHandle` keeps one object for the whole gesture */
  from: ComputedRef<HandleRef>;
  /** the hovered end handle as an identity key, so re-reading the same handle does not look like a change */
  toKey: ComputedRef<string | null>;
  clickFrom: ComputedRef<HandleRef>;
  isValid: ComputedRef<boolean>;
}

export function handleKey(nodeId: string, handleId: string | null | undefined, type: HandleType) {
  return `${nodeId}|${handleId ?? ''}|${type}`;
}

const cache = new WeakMap<object, ConnectionSignals>();

/**
 * Narrow `state.connection` into the four values a {@link Handle} actually reads.
 *
 * @internal
 */
export function useConnectionSignals<NodeType extends Node = Node, EdgeType extends Edge = Edge>(
  state: State<NodeType, EdgeType>,
): ConnectionSignals {
  const key = toRaw(state) as object;
  const cached = cache.get(key);

  if (cached) {
    return cached;
  }

  const signals: ConnectionSignals = {
    from: computed(() => toRaw(state.connection).fromHandle),
    toKey: computed(() => {
      const to = toRaw(state.connection).toHandle;
      return to ? handleKey(to.nodeId, to.id, to.type) : null;
    }),
    clickFrom: computed(() => state.connectionClickStartHandle),
    isValid: computed(() => toRaw(state.connection).isValid === true),
  };

  cache.set(key, signals);

  return signals;
}
