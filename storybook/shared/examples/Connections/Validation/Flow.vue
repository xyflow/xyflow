<script setup lang="ts">
import { VueFlow } from '@xyflow/vue';
import { initialNodes, isValidConnection } from './config';
import { useFlowFixture } from '../../../vue/useFlowFixture';
import ValidationNode from './ValidationNode.vue';
import ConnectionStatus from './ConnectionStatus.vue';
const { nodes, edges, onConnect } = useFlowFixture({ nodes: initialNodes });
</script>
<template>
  <VueFlow
    v-model:nodes="nodes"
    v-model:edges="edges"
    :is-valid-connection="isValidConnection"
    edges-reconnectable
    :select-nodes-on-drag="false"
    fit-view
    @connect="onConnect"
  >
    <template #node-custominput="node"><ValidationNode v-bind="node" /></template>
    <template #node-customnode="node"><ValidationNode v-bind="node" /></template>
    <ConnectionStatus />
  </VueFlow>
</template>
