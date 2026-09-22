<script setup lang="ts">
import { VueFlow, Background } from '@xyflow/vue';
import { initialNodes } from './config';
import { useFlowFixture } from '../../../vue/useFlowFixture';
import CustomNode from './CustomNode.vue';
const { nodes, edges, onConnect } = useFlowFixture({ nodes: initialNodes });
</script>
<template>
  <VueFlow v-model:nodes="nodes" v-model:edges="edges" :connection-radius="10" fit-view @connect="onConnect">
    <template #node-detached="node"><CustomNode v-bind="node" /></template><Background />
  </VueFlow>
</template>
