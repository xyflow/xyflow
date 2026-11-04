<script lang="ts" setup>
import type { Connection, Edge, Node } from '@xyflow/vue';
import { addEdge, VueFlow } from '@xyflow/vue';
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

function onConnect(connection: Connection) {
  edges.value = addEdge(connection, edges.value);
}
</script>

<template>
  <VueFlow v-model:nodes="nodes" v-model:edges="edges" fit-view @connect="onConnect">
    <template #connection-line="props">
      <ConnectionLine v-bind="props" />
    </template>
  </VueFlow>
</template>
