import type { InjectionKey, ShallowRef } from 'vue';
import type { VueFlowInstance, VueFlowSlots, VueFlowState } from '../types';
import { getCurrentInstance, inject } from 'vue';

/** the curated instance (`useVueFlow()`) */
export const VueFlow: InjectionKey<VueFlowInstance> = Symbol('vueFlow');
/** the reactive state (`useStore()`) */
export const VueFlowStateKey: InjectionKey<VueFlowState> = Symbol('vueFlowState');
export const NodeId: InjectionKey<string> = Symbol('nodeId');
export const NodeRef: InjectionKey<ShallowRef<HTMLDivElement | null>> = Symbol('nodeRef');
export const EdgeId: InjectionKey<string> = Symbol('edgeId');
export const EdgeRef: InjectionKey<ShallowRef<SVGElement | null>> = Symbol('edgeRef');
export const Slots: InjectionKey<Readonly<VueFlowSlots>> = Symbol('slots');

/**
 * Resolve a provided flow-context value: the nearest ancestor's `provide` (via Vue's `inject`), falling
 * back to the CURRENT component's own provides. `inject` only reads *ancestor* provides, so a component
 * that both creates the store (`setupVueFlow()`) and consumes it (`useVueFlow()`/`useStore()`) in the
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
