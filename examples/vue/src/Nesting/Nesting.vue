<script lang="ts" setup>
import type { Connection, Edge, Node, VueFlowInstance } from '@xyflow/vue';
import { Background, ConnectionMode, Controls, MiniMap, VueFlow } from '@xyflow/vue';

const nodes = ref<Node[]>([
  { id: '1', type: 'input', data: { label: 'Node 1' }, position: { x: 250, y: 5 }, class: 'light' },
  {
    id: '2',
    data: { label: 'Node 2' },
    position: { x: 100, y: 100 },
    class: 'light',
    style: { backgroundColor: 'rgba(255, 0, 0, 0.8)' },
  },
  {
    id: '2a',
    data: { label: 'Node 2a' },
    position: { x: 10, y: 50 },
    parentId: '2',
  },
  { id: '3', data: { label: 'Node 3' }, position: { x: 320, y: 100 }, class: 'light' },
  {
    id: '4',
    data: { label: 'Node 4' },
    position: { x: 320, y: 200 },
    class: 'light',
    style: { backgroundColor: 'rgba(255, 0, 0, 0.7)', width: '300px', height: '300px' },
  },
  {
    id: '4a',
    data: { label: 'Node 4a' },
    position: { x: 15, y: 65 },
    class: 'light',
    extent: 'parent',
    parentId: '4',
  },
  {
    id: '4b',
    data: { label: 'Node 4b' },
    position: { x: 15, y: 120 },
    class: 'light',
    style: { backgroundColor: 'rgba(255, 0, 255, 0.7)', height: '150px', width: '270px' },
    parentId: '4',
  },
  {
    id: '4b1',
    data: { label: 'Node 4b1' },
    position: { x: 20, y: 40 },
    class: 'light',
    parentId: '4b',
  },
  {
    id: '4b2',
    data: { label: 'Node 4b2' },
    position: { x: 100, y: 100 },
    class: 'light',
    parentId: '4b',
  },
]);

const edges = ref<Edge[]>([
  { id: 'e1-2', source: '1', target: '2', animated: true },
  { id: 'e1-3', source: '1', target: '3' },
  { id: 'e2a-4a', source: '2a', target: '4a' },
  { id: 'e3-4', source: '3', target: '4' },
  { id: 'e3-4b', source: '3', target: '4b' },
  { id: 'e4a-4b1', source: '4a', target: '4b1' },
  { id: 'e4a-4b2', source: '4a', target: '4b2' },
  { id: 'e4b1-4b2', source: '4b1', target: '4b2' },
]);

// `<VueFlow>` exposes its store via `defineExpose`, so a template ref is the pure-provider way to reach
// the store from the component that renders the flow.
const flow = ref<VueFlowInstance>();

function onConnect(connection: Connection) {
  flow.value?.addEdges([connection]);
}

onMounted(() => {
  // add nodes to parent
  flow.value?.addNodes({
    id: '999',
    type: 'input',
    data: { label: 'Added after mount' },
    position: { x: 20, y: 100 },
    class: 'light',
    expandParent: true,
    parentId: '2',
  });

  setTimeout(() => {
    const node = flow.value?.getNode('999');
    if (node) {
      flow.value?.updateNode('999', {
        expandParent: false,
        extent: 'parent',
      });
    }
  });
});
</script>

<template>
  <VueFlow
    ref="flow"
    v-model:nodes="nodes"
    v-model:edges="edges"
    fit-view
    :connection-mode="ConnectionMode.Loose"
    @connect="onConnect"
  >
    <MiniMap />
    <Controls />
    <Background />
  </VueFlow>
</template>
