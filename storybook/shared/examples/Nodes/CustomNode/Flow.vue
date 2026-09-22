<script setup lang="ts">
import { VueFlow, Background, Controls } from '@xyflow/vue';
import { initialNodes, initialEdges } from './config';
import { defaultFlowProps } from '../../../defaultFlow';
import { useFlowFixture } from '../../../vue/useFlowFixture';
import ColorNode from './ColorNode.vue';
const { nodes, edges, onConnect } = useFlowFixture({ nodes: initialNodes, edges: initialEdges });
</script>
<template>
  <VueFlow v-bind="defaultFlowProps" v-model:nodes="nodes" v-model:edges="edges" @connect="onConnect">
    <template #node-color="node"><ColorNode v-bind="node" :data="node.data as { color: string }" /></template>
    <Background
      :style="{ backgroundColor: String(nodes.find((node) => node.id === '2')?.data.color ?? '#fff') }"
    /><Controls />
  </VueFlow>
</template>
