<script lang="ts" setup generic="NodeType extends Node = Node, EdgeType extends Edge = Edge">
import type { Viewport } from '@xyflow/system';
import type { Ref } from 'vue';
import type { Edge, FlowEmits, FlowProps, FlowSlots, Node, VueFlowInstance, VueFlowState } from '../../types';
import { inject, onUnmounted, provide } from 'vue';
import A11yDescriptions from '../../components/A11y/A11yDescriptions.vue';
import { storeToRefs } from '../../composables/storeToRefs';
import { useCreateVueFlow } from '../../composables/useCreateVueFlow';
import { useOnInitHandler } from '../../composables/useOnInitHandler';
import { useSelectionChange } from '../../composables/useSelectionChange';
import { useStylesLoadedWarning } from '../../composables/useStylesLoadedWarning';
import { useViewportSync } from '../../composables/useViewportSync';
import { useWatchProps } from '../../composables/useWatchProps';
import { Slots, VueFlow as VueFlowInjectionKey, VueFlowStateKey } from '../../context';
import { useHooks } from '../../store/hooks';
import ZoomPane from '../ZoomPane/ZoomPane.vue';

const props = withDefaults(defineProps<FlowProps<NodeType, EdgeType>>(), {
  snapToGrid: undefined,
  onlyRenderVisibleElements: undefined,
  edgesReconnectable: undefined,
  nodesConnectable: undefined,
  nodesDraggable: undefined,
  elementsSelectable: undefined,
  selectNodesOnDrag: undefined,
  preventScrolling: undefined,
  zoomOnScroll: undefined,
  zoomOnPinch: undefined,
  zoomOnDoubleClick: undefined,
  panOnScroll: undefined,
  panOnDrag: undefined,
  autoApplyChanges: undefined,
  forceColorMode: undefined,
  fitView: undefined,
  fitViewOptions: undefined,
  connectOnClick: undefined,
  connectionLineOptions: undefined,
  autoConnect: undefined,
  elevateEdgesOnSelect: undefined,
  elevateNodesOnSelect: undefined,
  disableKeyboardA11y: undefined,
  edgesFocusable: undefined,
  nodesFocusable: undefined,
  autoPanOnConnect: undefined,
  autoPanOnNodeDrag: undefined,
  autoPanOnNodeFocus: undefined,
  autoPanOnSelection: undefined,
  isValidConnection: undefined,
  onBeforeDelete: undefined,
  deleteKeyCode: undefined,
  selectionKeyCode: undefined,
  selectionOnDrag: undefined,
  multiSelectionKeyCode: undefined,
  panActivationKeyCode: undefined,
  zoomActivationKeyCode: undefined,
});

const emit = defineEmits<FlowEmits<NodeType, EdgeType>>();

const slots = defineSlots<FlowSlots<NodeType, EdgeType>>();

const modelNodes = defineModel<NodeType[]>('nodes');
const modelEdges = defineModel<EdgeType[]>('edges');
const modelViewport = defineModel<Viewport>('viewport');

// Reuse an ancestor `<VueFlowProvider>`'s store if present; otherwise this `<VueFlow>` owns it —
// create + provide our own (auto-wrap, like react's `<Wrapper>`). The store is only ever created by a
// provider boundary; `useVueFlow()`/`useStore()` are pure consumers. A reused store exposes its two
// views via the same pair of injection keys (instance + state).
const injectedInstance = inject(VueFlowInjectionKey, null) as VueFlowInstance<NodeType, EdgeType> | null;
const injectedState = inject(VueFlowStateKey, null) as VueFlowState<NodeType, EdgeType> | null;

// This `<VueFlow>` owns its store unless it reuses an ancestor provider's. When it owns the store, the
// v-model refs back it directly as signals — single source of truth (svelte's `$bindable` proxy), so the
// store mutating nodes/edges IS the v-model update, no out-sync. When it reuses a provider's store, the
// model refs can't back the already-created store, so `useWatchProps` syncs them instead (rebinding a
// reused store to the hosting `<VueFlow>`'s models is deferred to the multi-instance guard work).
const ownsStore = !injectedInstance;

const { instance, state } =
  injectedInstance && injectedState
    ? { instance: injectedInstance, state: injectedState }
    : useCreateVueFlow<NodeType, EdgeType>(props, {
        nodes: modelNodes as unknown as Ref<NodeType[]>,
        edges: modelEdges as unknown as Ref<EdgeType[]>,
      });

// when reusing a provider's store, apply this `<VueFlow>`'s props to it
if (!ownsStore) {
  instance.setState(props as Parameters<typeof instance.setState>[0]);
}

// watch props and update store state (nodes/edges are signal-backed when we own the store — see above)
const disposeWatchers = useWatchProps({ nodes: modelNodes, edges: modelEdges }, props, { instance, state }, ownsStore);

useHooks(emit, state.hooks);

useOnInitHandler(instance);

useSelectionChange(instance);

useStylesLoadedWarning(instance);

useViewportSync(modelViewport, state);

// the container element ref needs the writable ref (not the unwrapped value) so Vue can assign it;
// access it by member (`stateRefs.vueFlowRef`) so the template `:ref` binding doesn't auto-unwrap it
const stateRefs = storeToRefs(state);

// slots will be passed via provide
// this is to avoid having to pass them down through all the components
// as that would require a lot of boilerplate and causes significant performance drops
provide(Slots, slots as unknown as FlowSlots);

onUnmounted(disposeWatchers);

defineExpose<VueFlowInstance<NodeType, EdgeType>>(instance);
</script>

<script lang="ts">
export default {
  name: 'VueFlow',
  compatConfig: { MODE: 3 },
};
</script>

<template>
  <div :ref="stateRefs.vueFlowRef" class="vue-flow" :class="props.forceColorMode">
    <!-- the `zoom-pane` slot (affected by zooming & panning) renders inside the transformed Viewport via
    the provided `Slots` (see ZoomPaneSlot), not drilled through ZoomPane → Pane → Viewport -->
    <ZoomPane />

    <!-- This slot is _not_ affected by zooming & panning -->
    <slot />

    <A11yDescriptions />
  </div>
</template>
