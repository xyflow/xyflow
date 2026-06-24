<script lang="ts" setup>
import type { Edge, Node } from '@xyflow/vue';
import { VueFlow } from '@xyflow/vue';
import ConnectionLine from './SnappableConnectionLine.vue';

const nodes = ref<Node[]>([
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

const edges = ref<Edge[]>([]);
</script>

<template>
  <VueFlow v-model:nodes="nodes" v-model:edges="edges" auto-connect fit-view>
    <template #connection-line="{ fromX, fromY, toX, toY, fromPosition, toPosition }">
      <ConnectionLine
        :source-x="fromX"
        :source-y="fromY"
        :target-x="toX"
        :target-y="toY"
        :source-position="fromPosition"
        :target-position="toPosition"
      />
    </template>
  </VueFlow>
</template>
