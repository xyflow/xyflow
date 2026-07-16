<script lang="ts" setup>
import type { Edge, Node } from '@xyflow/vue';
import { VueFlow } from '@xyflow/vue';
import ConnectionLine from './SnappableConnectionLine.vue';

const nodes = shallowRef<Node[]>([
  {
    id: '1',
    data: { label: 'Node 1' },
    position: { x: 0, y: 0 },
  },
  {
    id: '2',
    data: { label: 'Node 2' },
    position: { x: 100, y: 100 },
  },
  {
    id: '3',
    data: { label: 'Node 3' },
    position: { x: 200, y: 0 },
  },
]);

const edges = shallowRef<Edge[]>([]);
</script>

<template>
  <VueFlow v-model:nodes="nodes" v-model:edges="edges" auto-connect fit-view>
    <template #connection-line="props">
      <ConnectionLine v-bind="props" />
    </template>
  </VueFlow>
</template>
