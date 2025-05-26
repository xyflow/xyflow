import type { InjectionKey, ShallowRef } from 'vue';
import type { FlowSlots, VueFlowInstance, VueFlowState } from '../types';

/** the curated instance (`useVueFlow()`) */
export const VueFlow: InjectionKey<VueFlowInstance> = Symbol('vueFlow');
/** the reactive state (`useStore()`) */
export const VueFlowStateKey: InjectionKey<VueFlowState> = Symbol('vueFlowState');
export const NodeId: InjectionKey<string> = Symbol('nodeId');
export const NodeRef: InjectionKey<ShallowRef<HTMLDivElement | null>> = Symbol('nodeRef');
export const EdgeId: InjectionKey<string> = Symbol('edgeId');
export const EdgeRef: InjectionKey<ShallowRef<SVGElement | null>> = Symbol('edgeRef');
export const Slots: InjectionKey<Readonly<FlowSlots>> = Symbol('slots');
