import type { EdgeChangeset, NodeChangeset } from '@xyflow/system';
import type { InjectionKey, ShallowRef } from 'vue';
import type { Edge, Node, VueFlowInstance, VueFlowSlots, VueFlowState } from '../types';
import { getCurrentInstance, inject } from 'vue';

/** the curated instance (`useVueFlow()`) */
export const VueFlow: InjectionKey<VueFlowInstance> = Symbol('vueFlow');
/** the reactive state (`useVueFlowStore()`) */
export const VueFlowStateKey: InjectionKey<VueFlowState> = Symbol('vueFlowState');
/**
 * Key for the store's change-application handlers, hung off the state object. `<VueFlow>` registers them
 * as the default `onNodesChange`/`onEdgesChange` listeners when its binding is managed, so auto-apply
 * follows the consuming `<VueFlow>` even when it reuses a provider's store.
 *
 * @internal
 */
export const AUTO_APPLY = Symbol('autoApply');
/**
 * Applies a changeset to the store. Registered by `<VueFlow>` as the default change listeners when the
 * binding is managed; not exposed on the public instance.
 * Apply a changeset yourself with changes.applyTo(elements)`.
 *
 * @internal
 */
export interface AutoApplyHandlers<NodeType extends Node = Node, EdgeType extends Edge = Edge> {
  nodes: (changes: NodeChangeset<NodeType>) => void;
  edges: (changes: EdgeChangeset<EdgeType>) => void;
}

/** @internal */
export interface WithAutoApply<NodeType extends Node = Node, EdgeType extends Edge = Edge> {
  [AUTO_APPLY]?: AutoApplyHandlers<NodeType, EdgeType>;
}
export const NodeId: InjectionKey<string> = Symbol('nodeId');
export const NodeRef: InjectionKey<ShallowRef<HTMLDivElement | null>> = Symbol('nodeRef');
export const EdgeId: InjectionKey<string> = Symbol('edgeId');
export const EdgeRef: InjectionKey<ShallowRef<SVGElement | null>> = Symbol('edgeRef');
export const Slots: InjectionKey<Readonly<VueFlowSlots>> = Symbol('slots');

/**
 * Resolve a provided flow-context value: the nearest ancestor's `provide` (via Vue's `inject`), falling
 * back to the CURRENT component's own provides. `inject` only reads *ancestor* provides, so a component
 * that both creates the store (`setupVueFlow()`) and consumes it (`useVueFlow()`/`useVueFlowStore()`) in the
 * same `setup` wouldn't otherwise see its own store — reading `getCurrentInstance().provides` closes that
 * gap so `setupVueFlow()` resolves on its own level (as if a `<VueFlowProvider>` sat a level up).
 */
export function injectFlowContext<T>(key: InjectionKey<T>): T | null {
  const fromAncestor = inject(key, null);

  if (fromAncestor != null) {
    return fromAncestor;
  }

  const self = getCurrentInstance();
  const ownProvides = (self as unknown as { provides: Record<symbol, T | undefined> } | null)?.provides;

  return ownProvides?.[key] ?? null;
}
