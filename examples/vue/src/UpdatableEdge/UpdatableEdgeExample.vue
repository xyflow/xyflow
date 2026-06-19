<script lang="ts" setup>
import type { Edge, FlowEvents, Node, VueFlowInstance } from '@xyflow/vue';
import { ConnectionMode, Controls, isEdge, isNode, VueFlow } from '@xyflow/vue';

const initialElements: (Node | Edge)[] = [
  {
    id: '1',
    type: 'input',
    data: { label: 'Node <strong>A</strong>' },
    position: { x: 250, y: 0 },
  },
  {
    id: '2',
    data: { label: 'Node <strong>B</strong>' },
    position: { x: 100, y: 100 },
  },
  {
    id: '3',
    data: { label: 'Node <strong>C</strong>' },
    position: { x: 400, y: 100 },
    style: { background: '#D6D5E6', color: '#333', border: '1px solid #222138', width: 180 },
  },
  { id: 'e1-2', source: '1', target: '2', label: 'Updatable target', reconnectable: 'target' },
];

const nodes = ref<Node[]>(initialElements.filter(isNode));
const edges = ref<Edge[]>(initialElements.filter(isEdge));

// imperative store access for the component that renders `<VueFlow>` (pure-provider model)
const flow = ref<VueFlowInstance>();

function onLoad(flowInstance: VueFlowInstance) {
  return flowInstance.fitView();
}

function onReconnectStart({ edge }: FlowEvents['reconnectStart']) {
  return console.log('start update', edge);
}

function onReconnectEnd({ edge }: FlowEvents['reconnectEnd']) {
  return console.log('end update', edge);
}

function onReconnect({ edge, connection }: FlowEvents['reconnect']) {
  return flow.value?.reconnectEdge(edge, connection);
}
</script>

<template>
  <VueFlow
    ref="flow"
    v-model:nodes="nodes"
    v-model:edges="edges"
    :snap-to-grid="true"
    :connection-mode="ConnectionMode.Loose"
    @init="onLoad"
    @reconnect="onReconnect"
    @reconnect-start="onReconnectStart"
    @reconnect-end="onReconnectEnd"
  >
    <Controls />
  </VueFlow>
</template>
