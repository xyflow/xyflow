<script setup lang="ts">
import { VueFlow, Background, Controls, MiniMap } from '@xyflow/vue';
import { initialNodes, initialEdges } from './config';
import { useFlowFixture } from '../../vue/useFlowFixture';
import CustomEdge from './CustomEdge.vue';
const { nodes, edges, onConnect } = useFlowFixture({ nodes: initialNodes, edges: initialEdges });
</script>
<template>
  <VueFlow v-model:nodes="nodes" v-model:edges="edges" :min-zoom="0.2" :max-zoom="4" fit-view @connect="onConnect">
    <template #edge-custom="edge"><CustomEdge v-bind="edge" /></template>
    <Background /><Controls /><MiniMap />
  </VueFlow>
</template>
