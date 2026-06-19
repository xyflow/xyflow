import type { Edge, Node, VueFlowState } from '../types';
import { inject } from 'vue';
import { VueFlowStateKey } from '../context';
import { ErrorCode, VueFlowError } from '../utils/errors';

/**
 * Access the raw reactive state of the surrounding flow — every {@link VueFlowState} field plus the
 * lookups, read directly (`store.nodes`, `store.transform`, `store.nodeLookup`, …; no `.value`, like
 * `xyflow/svelte`'s store). Mirrors `useStore` in `xyflow/react`+`svelte`.
 *
 * Reading a field inside a `computed`/`watch`/template tracks it reactively; reading it in a plain
 * callback is just a current-value read. To destructure scalar/array fields as refs, wrap the result in
 * `storeToRefs`; reference-type lookups (`nodeLookup`, …) can be destructured directly.
 *
 * For actions, getters, and event hooks use {@link useVueFlow} instead. Throws if called outside a
 * provider (or outside a component `setup`).
 *
 * @public
 * @returns the reactive state for the current context
 */
export function useStore<NodeType extends Node = Node, EdgeType extends Edge = Edge>(): VueFlowState<NodeType, EdgeType> {
  const state = inject(VueFlowStateKey, null) as VueFlowState<NodeType, EdgeType> | null;

  if (!state) {
    throw new VueFlowError(ErrorCode.USE_VUE_FLOW_OUTSIDE_PROVIDER);
  }

  return state;
}
