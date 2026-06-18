<script lang="ts" setup>
import { Background, Controls, MiniMap, VueFlow } from '@xyflow/vue';

import CustomEdge2 from './CustomEdge2.vue';
import CustomEdge from './CustomEdge.vue';
import { initialEdges, initialNodes } from './initial-elements';
</script>

<template>
  <VueFlow :edges="initialEdges" :nodes="initialNodes" fit-view snap-to-grid>
    <template #edge-custom="props">
      <CustomEdge v-bind="props" />
    </template>

    <template #edge-custom2="props">
      <CustomEdge2 v-bind="props" />
    </template>

    <MiniMap />
    <Controls />
    <Background />
  </VueFlow>
</template>
