<script lang="ts" setup>
import type { Edge, Node } from '@xyflow/vue';
import { isEdge, isNode, VueFlow, VueFlowProvider } from '@xyflow/vue';
import Controls from './Controls.vue';

const initialElements: (Node | Edge)[] = [
  { id: '1', data: { label: 'Node 1' }, position: { x: 100, y: 100 } },
  { id: '2', data: { label: 'Node 2' }, position: { x: 100, y: 200 } },
  { id: 'e1-2', source: '1', target: '2' },
];

const nodes = ref<Node[]>(initialElements.filter(isNode));
const edges = ref<Edge[]>(initialElements.filter(isEdge));
</script>

<template>
  <!-- The sibling-rendered `<Controls>` (passed as slot content from this component) reads the store via
       `useVueFlow()`, so it needs a `<VueFlowProvider>` boundary in this component's tree to inject from. -->
  <VueFlowProvider>
    <VueFlow v-model:nodes="nodes" v-model:edges="edges">
      <Controls />
    </VueFlow>
  </VueFlowProvider>
</template>

<style>
@import 'save.css';
</style>
