<script lang="ts" setup>
import type { Edge, Node } from '@xyflow/vue';
import { VueFlow } from '@xyflow/vue';
import ConnectionLine from './ConnectionLine.vue';

const nodes = ref<Node[]>([
  {
    id: '1',
    type: 'input',
    data: { label: 'Node 1' },
    position: { x: 250, y: 5 },
  },
]);

const edges = ref<Edge[]>([]);
</script>

<template>
  <VueFlow v-model:nodes="nodes" v-model:edges="edges">
    <template #connection-line="{ fromX, fromY, toX, toY }">
      <ConnectionLine :source-x="fromX" :source-y="fromY" :target-x="toX" :target-y="toY" />
    </template>
  </VueFlow>
</template>
