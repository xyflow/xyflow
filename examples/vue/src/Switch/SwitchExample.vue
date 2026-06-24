<script lang="ts" setup>
import type { Edge, Node } from '@xyflow/vue';
import { VueFlow } from '@xyflow/vue';

const nodesA: Node[] = [
  { id: '1a', type: 'input', data: { label: 'Node 1' }, position: { x: 250, y: 5 }, class: 'light' },
  { id: '2a', data: { label: 'Node 2' }, position: { x: 100, y: 100 }, class: 'light' },
  { id: '3a', data: { label: 'Node 3' }, position: { x: 400, y: 100 }, class: 'light' },
  { id: '4a', data: { label: 'Node 4' }, position: { x: 400, y: 200 }, class: 'light' },
];

const edgesA: Edge[] = [
  { id: 'e1-2', source: '1a', target: '2a' },
  { id: 'e1-3', source: '1a', target: '3a' },
];

const nodesB: Node[] = [
  { id: 'inputb', type: 'input', data: { label: 'Input' }, position: { x: 300, y: 5 }, class: 'light' },
  { id: '1b', data: { label: 'Node 1' }, position: { x: 0, y: 100 }, class: 'light' },
  { id: '2b', data: { label: 'Node 2' }, position: { x: 200, y: 100 }, class: 'light' },
  { id: '3b', data: { label: 'Node 3' }, position: { x: 400, y: 100 }, class: 'light' },
  { id: '4b', data: { label: 'Node 4' }, position: { x: 600, y: 100 }, class: 'light' },
];

const edgesB: Edge[] = [
  { id: 'e1b', source: 'inputb', target: '1b' },
  { id: 'e2b', source: 'inputb', target: '2b' },
  { id: 'e3b', source: 'inputb', target: '3b' },
  { id: 'e4b', source: 'inputb', target: '4b' },
];

const nodes = ref<Node[]>(nodesA);
const edges = ref<Edge[]>(edgesA);

function switchToA() {
  nodes.value = nodesA;
  edges.value = edgesA;
}

function switchToB() {
  nodes.value = nodesB;
  edges.value = edgesB;
}
</script>

<template>
  <VueFlow v-model:nodes="nodes" v-model:edges="edges">
    <div :style="{ position: 'absolute', right: 10, top: 10, zIndex: 4 }">
      <button style="margin-right: 5px" @click="switchToA">
        flow a
      </button>
      <button @click="switchToB">
        flow b
      </button>
    </div>
  </VueFlow>
</template>
