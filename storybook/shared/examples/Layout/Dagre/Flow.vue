<script setup lang="ts">
import { nextTick } from 'vue';
import { VueFlow, Background, Controls, Panel, setupVueFlow, type Node } from '@xyflow/vue';
import initialFlow from './config';
import { layoutNodes } from './layout';
import { useFlowFixture } from '../../../vue/useFlowFixture';
import InteractionPanel from '../../../InteractionPanel/InteractionPanel.vue';
const { nodes, edges, onConnect } = useFlowFixture({
  nodes: layoutNodes(initialFlow.nodes, initialFlow.edges, 'TB'),
  edges: initialFlow.edges,
});
const { fitView } = setupVueFlow();
async function layout(direction: 'TB' | 'LR') {
  nodes.value = layoutNodes(
    nodes.value,
    edges.value.map((edge) => ({ ...edge })),
    direction
  ) as Node[];
  await nextTick();
  await fitView();
}
</script>
<template>
  <VueFlow v-model:nodes="nodes" v-model:edges="edges" fit-view @connect="onConnect">
    <Background /><Controls /><InteractionPanel />
    <Panel position="top-left"
      ><button @click="layout('TB')">vertical layout</button
      ><button @click="layout('LR')">horizontal layout</button></Panel
    >
  </VueFlow>
</template>
