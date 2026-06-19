import type { Edge, Node } from '../types';
import { computed, inject, shallowRef } from 'vue';
import { EdgeId, EdgeRef } from '../context';
import { ErrorCode, VueFlowError } from '../utils';
import { useVueFlow } from './useVueFlow';

/**
 * Composable that provides access to an edge object and it's dom element
 *
 * If no edge id is provided, the edge id is injected from context
 *
 * If you do not provide an id, this composable has to be called in a child of your custom edge component, or it will throw
 *
 * @public
 * @param id - The id of the edge to access
 * @returns the edge id, the edge (a `ComputedRef`) and the edge dom element
 */
export function useEdge<EdgeType extends Edge = Edge>(id?: string) {
  const edgeId = id ?? inject(EdgeId, '');
  const edgeEl = inject(EdgeRef, shallowRef(null));

  const { getEdge, emits } = useVueFlow<Node, EdgeType>();

  // a `computed` (not a one-time read) so it re-resolves whenever the store replaces this edge's lookup
  // entry — required for the immutable model where a changed edge is a NEW object (mirrors `useNode`)
  const edge = computed(() => getEdge(edgeId));

  if (!edge.value) {
    emits.error(new VueFlowError(ErrorCode.EDGE_NOT_FOUND, edgeId));
  }

  return {
    id: edgeId,
    edge,
    edgeEl,
  };
}
