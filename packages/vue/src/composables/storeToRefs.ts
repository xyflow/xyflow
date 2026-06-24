import type { ToRefs } from 'vue';
import type { Edge, Node, VueFlowState } from '../types';
import { toRefs } from 'vue';

/**
 * Destructure the reactive state from {@link useStore} into refs without losing reactivity (Pinia's
 * `storeToRefs`). Destructuring the reactive state object directly hands back plain values for
 * scalar/array fields; this projects them to refs instead:
 *
 * ```ts
 * const { nodes, transform } = storeToRefs(useStore()) // Ref<Node[]>, Ref<Transform>
 * ```
 *
 * Reference-type fields (the `nodeLookup`/`parentLookup`/`edgeLookup`/`connectionLookup` Maps) stay
 * reactive when destructured straight off `useStore()` — you only need this for the value-type fields.
 *
 * @public
 */
export function storeToRefs<NodeType extends Node = Node, EdgeType extends Edge = Edge>(
  store: VueFlowState<NodeType, EdgeType>,
): ToRefs<VueFlowState<NodeType, EdgeType>> {
  return toRefs(store);
}
