<script setup lang="ts">
import { computed } from 'vue';
import { VueFlow, Background, MiniMap, Controls, type AriaLabelConfig } from '@xyflow/vue';
import { defaultA11yArgs, initialNodes, initialEdges, type SharedA11yArgs } from './config';
import { useFlowFixture } from '../../../vue/useFlowFixture';
const props = defineProps<SharedA11yArgs>();
const { nodes, edges, onConnect } = useFlowFixture({ nodes: initialNodes, edges: initialEdges });
const args = computed(() => ({ ...defaultA11yArgs, ...props }));
const ariaLabelConfig = computed<Partial<AriaLabelConfig>>(() => ({
  'node.a11yDescription.default': args.value.ariaNodeDefault,
  'node.a11yDescription.keyboardDisabled': args.value.ariaNodeKeyboardDisabled,
  'node.a11yDescription.ariaLiveMessage': ({ direction, x, y }) =>
    args.value.ariaNodeLiveMessagePrefix + ' ' + direction + '. New position, x: ' + x + ', y: ' + y,
  'edge.a11yDescription.default': args.value.ariaEdgeDefault,
  'controls.ariaLabel': args.value.ariaControlsLabel,
  'controls.zoomIn.ariaLabel': args.value.ariaControlsZoomIn,
  'controls.zoomOut.ariaLabel': args.value.ariaControlsZoomOut,
  'controls.fitView.ariaLabel': args.value.ariaControlsFitView,
  'controls.interactive.ariaLabel': args.value.ariaControlsInteractive,
  'minimap.ariaLabel': args.value.ariaMinimap,
}));
</script>
<template>
  <VueFlow
    v-model:nodes="nodes"
    v-model:edges="edges"
    v-bind="{ ariaLabelConfig }"
    :auto-pan-on-node-focus="args.autoPanOnNodeFocus"
    :select-nodes-on-drag="false"
    elevate-edges-on-select
    :elevate-nodes-on-select="false"
    :node-drag-threshold="0"
    @connect="onConnect"
  >
    <Background /><MiniMap /><Controls />
  </VueFlow>
</template>
