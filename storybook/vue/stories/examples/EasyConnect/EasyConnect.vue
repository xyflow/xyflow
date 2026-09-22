<script lang="ts" setup>
import type { Connection, Edge, Node } from '@xyflow/vue';
import { Background, MarkerType, setupVueFlow, VueFlow } from '@xyflow/vue';
import CustomNode from './CustomNode.vue';
import FloatingConnectionLine from './FloatingConnectionLine.vue';
import FloatingEdge from './FloatingEdge.vue';

const { addEdges } = setupVueFlow();

const defaultEdgeOptions = {
  style: { strokeWidth: 3, stroke: 'black' },
  type: 'floating',
  markerEnd: {
    type: MarkerType.ArrowClosed,
    color: 'black',
  },
};

const nodes = shallowRef<Node[]>([
  {
    id: '1',
    type: 'custom',
    position: { x: 0, y: 0 },
    data: {},
  },
  {
    id: '2',
    type: 'custom',
    position: { x: 250, y: 320 },
    data: {},
  },
  {
    id: '3',
    type: 'custom',
    position: { x: 40, y: 300 },
    data: {},
  },
  {
    id: '4',
    type: 'custom',
    position: { x: 300, y: 0 },
    data: {},
  },
]);

const edges = shallowRef<Edge[]>([]);

function onConnect(connection: Connection) {
  addEdges([connection]);
}
</script>

<template>
  <VueFlow
    v-model:nodes="nodes"
    v-model:edges="edges"
    :elevate-nodes-on-select="false"
    :default-edge-options="defaultEdgeOptions"
    fit-view
    @connect="onConnect"
  >
    <Background :gap="8" />

    <template #node-custom="props">
      <CustomNode :id="props.id" />
    </template>

    <template #edge-floating="fProps">
      <FloatingEdge v-bind="fProps" />
    </template>

    <template #connection-line="cProps">
      <FloatingConnectionLine v-bind="cProps" />
    </template>
  </VueFlow>
</template>
