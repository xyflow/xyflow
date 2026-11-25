import type { MaybeRefOrGetter } from 'vue';
import type { Node } from '../types';
import { getConnectedEdges } from '@xyflow/system';
import { computed, inject, shallowRef, toValue } from 'vue';
import { NodeRef } from '../context';
import { ErrorCode, VueFlowError } from '../utils';
import { useNodeId } from './useNodeId';
import { useVueFlow } from './useVueFlow';
import { useVueFlowStore } from './useVueFlowStore';

/**
 * Composable that provides access to a node object, its parent node, connected edges and its dom element.
 *
 * Returns the user-facing {@link Node} — use {@link useInternalNode} for the enriched `InternalNode`.
 *
 * If no id is given it is read from node context (call inside a custom node, or it will throw). The id
 * accepts a ref/getter so it can track a reactive source.
 *
 * @public
 * @param id - The id of the node to access (a value, ref, or getter; defaults to the node context id)
 * @returns the node id, the node (a `ComputedRef`), its dom element, its parent and connected edges
 */
export function useNode<NodeType extends Node = Node>(id?: MaybeRefOrGetter<string | undefined>) {
  const contextNodeId = useNodeId();
  const nodeEl = inject(NodeRef, shallowRef(null));

  const { getNode, emits } = useVueFlow<NodeType>();
  const store = useVueFlowStore<NodeType>();

  const nodeId = toValue(id) ?? contextNodeId ?? '';

  const node = computed(() => getNode(toValue(id) ?? contextNodeId ?? ''));

  if (!node.value) {
    emits.error(new VueFlowError(ErrorCode.NODE_NOT_FOUND, nodeId));
  }

  return {
    id: nodeId,
    nodeEl,
    node,
    parentNode: computed(() => (node.value ? getNode(node.value.parentId) : undefined)),
    connectedEdges: computed(() => (node.value ? getConnectedEdges([node.value], store.edges) : [])),
  };
}
