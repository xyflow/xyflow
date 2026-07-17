import type { Edge, Node, VueFlowInstance } from '../types';
import { injectFlowContext, VueFlow } from '../context';
import { ErrorCode, VueFlowError } from '../utils/errors';

/**
 * Access the VueFlow instance for the surrounding flow — actions, computed getters, and event hooks.
 * For the raw reactive state (`nodes`, `transform`, lookups, …) use {@link useStore} (and `storeToRefs` to destructure it).
 *
 * Pure context consumer — resolves the instance provided by the nearest `<VueFlow>` /
 * `<VueFlowProvider>` / `setupVueFlow()` ancestor. It takes **no arguments**: there is no global registry, no
 * lookup-by-id, and no store creation here. To create/own a store, render a `<VueFlowProvider>` (or
 * `<VueFlow>`, which provides its own); to share one across components, wrap them in a common
 * `<VueFlowProvider>` / `setupVueFlow()` call.
 *
 * Throws if called outside a provider (or outside a component `setup`, where `inject` is unavailable).
 *
 * @public
 * @returns the VueFlow instance for the current context
 */
export function useVueFlow<NodeType extends Node = Node, EdgeType extends Edge = Edge>(): VueFlowInstance<NodeType, EdgeType> {
  const instance = injectFlowContext<VueFlowInstance<NodeType, EdgeType>>(VueFlow);

  if (!instance) {
    throw new VueFlowError(ErrorCode.USE_VUE_FLOW_OUTSIDE_PROVIDER);
  }

  return instance;
}
