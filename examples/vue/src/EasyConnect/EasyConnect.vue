<script lang="ts" setup>
import type { Connection, Edge, Node, VueFlowInstance } from '@xyflow/vue';
import { Background, MarkerType, VueFlow } from '@xyflow/vue';
import { ref } from 'vue';
import CustomNode from './CustomNode.vue';
import FloatingConnectionLine from './FloatingConnectionLine.vue';
import FloatingEdge from './FloatingEdge.vue';

const defaultEdgeOptions = {
  style: { strokeWidth: 3, stroke: 'black' },
  type: 'floating',
  markerEnd: {
    type: MarkerType.ArrowClosed,
    color: 'black',
  },
};

const nodes = ref<Node[]>([
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

const edges = ref<Edge[]>([]);

const flow = ref<VueFlowInstance>();

function onConnect(connection: Connection) {
  flow.value?.addEdges([connection]);
}
</script>

<template>
  <VueFlow
    ref="flow"
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
