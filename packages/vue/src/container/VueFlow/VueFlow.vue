<script lang="ts" setup generic="NodeType extends Node = Node, EdgeType extends Edge = Edge">
import type { Viewport } from '@xyflow/system';
import type { Edge, Node, VueFlowEmits, VueFlowInstance, VueFlowProps, VueFlowSlots, VueFlowState } from '../../types';
import { getCurrentInstance, inject, onUnmounted, provide } from 'vue';
import A11yDescriptions from '../../components/A11y/A11yDescriptions.vue';
import Attribution from '../../components/Attribution/Attribution.vue';
import { storeToRefs } from '../../composables/storeToRefs';
import { useControlledBindingWarning } from '../../composables/useControlledBindingWarning';
import { useCreateVueFlow } from '../../composables/useCreateVueFlow';
import { useDebug } from '../../composables/useDebug';
import { useOnInitHandler } from '../../composables/useOnInitHandler';
import { useSelectionChange } from '../../composables/useSelectionChange';
import { useStylesLoadedWarning } from '../../composables/useStylesLoadedWarning';
import { useViewportSync } from '../../composables/useViewportSync';
import { useWatchProps } from '../../composables/useWatchProps';
import { Slots, VueFlow as VueFlowInjectionKey, VueFlowStateKey } from '../../context';
import { useHooks } from '../../store/hooks';
import { hasVNodeListener } from '../../utils';
import ZoomPane from '../ZoomPane/ZoomPane.vue';

const props = withDefaults(defineProps<VueFlowProps<NodeType, EdgeType>>(), {
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
  forceColorMode: undefined,
  fitView: undefined,
  fitViewOptions: undefined,
  connectOnClick: undefined,
  connectionLineOptions: undefined,
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

const emit = defineEmits<VueFlowEmits<NodeType, EdgeType>>();

const slots = defineSlots<VueFlowSlots<NodeType, EdgeType>>();

const modelNodes = defineModel<NodeType[]>('nodes');
const modelEdges = defineModel<EdgeType[]>('edges');
const modelViewport = defineModel<Viewport>('viewport');

// `v-model:nodes` (or no binding at all → instance-driven) is UNCONTROLLED:
// A bare one-way `:nodes` is CONTROLLED: changes are handed to you via `@nodes-change`.
const inst = getCurrentInstance();
const boundProps = inst?.vnode.props ?? {};
const nodesManaged = !('nodes' in boundProps) || hasVNodeListener(inst, 'update:nodes');
const edgesManaged = !('edges' in boundProps) || hasVNodeListener(inst, 'update:edges');

const injectedInstance = inject(VueFlowInjectionKey, null) as VueFlowInstance<NodeType, EdgeType> | null;
const injectedState = inject(VueFlowStateKey, null) as VueFlowState<NodeType, EdgeType> | null;

const ownsStore = !injectedInstance;

const { instance, state }
  = injectedInstance && injectedState
    ? { instance: injectedInstance, state: injectedState }
    : useCreateVueFlow<NodeType, EdgeType>(props);

// when reusing a provider's store, apply this `<VueFlow>`'s props to it
if (!ownsStore) {
  instance.setState(props as Parameters<typeof instance.setState>[0]);
}

if (nodesManaged) {
  instance.onNodesChange(changes => instance.applyNodeChanges(changes));
}
if (edgesManaged) {
  instance.onEdgesChange(changes => instance.applyEdgeChanges(changes));
}

const disposeWatchers = useWatchProps(
  { nodes: modelNodes, edges: modelEdges },
  props,
  { instance, state },
  { nodes: nodesManaged, edges: edgesManaged },
);

useControlledBindingWarning({ nodes: nodesManaged, edges: edgesManaged }, instance);
useStylesLoadedWarning(instance);

useHooks(emit, state.hooks);
useOnInitHandler(instance);
useSelectionChange(instance);
useViewportSync(modelViewport, state);
useDebug(state);

const stateRefs = storeToRefs(state);

// provide slots instead of drilling them through every component (boilerplate + significant perf cost)
provide(Slots, slots as unknown as VueFlowSlots);

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

    <Attribution :pro-options="props.proOptions" :position="props.attributionPosition" />

    <A11yDescriptions />
  </div>
</template>
