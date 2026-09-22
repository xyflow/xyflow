<script setup lang="ts">
import { VueFlow, Background, Controls, MiniMap } from '@xyflow/vue';
import { initialNodes, initialEdges } from './config';
import { useFlowFixture } from '../../../vue/useFlowFixture';
import TextNode from './TextNode.vue';
import UppercaseNode from './UppercaseNode.vue';
import ResultNode from './ResultNode.vue';
const { nodes, edges, onConnect } = useFlowFixture({ nodes: initialNodes, edges: initialEdges });
</script>
<template>
  <VueFlow v-model:nodes="nodes" v-model:edges="edges" fit-view @connect="onConnect">
    <template #node-text="node"><TextNode v-bind="node" :data="node.data as { text: string }" /></template>
    <template #node-uppercase="node"><UppercaseNode v-bind="node" /></template>
    <template #node-result><ResultNode /></template>
    <Background /><Controls /><MiniMap />
  </VueFlow>
</template>
