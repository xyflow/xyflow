import type { MaybeRefOrGetter } from 'vue';
import type { InternalNode, Node } from '../types';
import { computed, toValue } from 'vue';
import { useNodeId } from './useNodeId';
import { useVueFlow } from './useVueFlow';

/**
 * Access the enriched {@link InternalNode} (store-computed `internals.{positionAbsolute, z, handleBounds}` +
 * authoritative `measured`) for an id, as a `computed` that re-resolves whenever the store re-adopts the node.
 *
 * Mirrors xyflow/react's `useInternalNode`. If no id is given it is read from node context (call inside a
 * custom node). Use {@link useNode} for the user-facing node + dom element + connected edges.
 *
 * The id accepts a ref/getter so it can track a reactive source — e.g. a custom edge resolving its
 * endpoint with `useInternalNode(() => props.source)` stays correct after a reconnect changes the source.
 *
 * @public
 * @param id - The id of the node to access (a value, ref, or getter; defaults to the node context id)
 */
export function useInternalNode<NodeType extends Node = Node>(id?: MaybeRefOrGetter<string | undefined>) {
  const contextNodeId = useNodeId();

  const { getInternalNode } = useVueFlow();

  return computed(() => getInternalNode(toValue(id) ?? contextNodeId ?? '') as InternalNode<NodeType> | undefined);
}
