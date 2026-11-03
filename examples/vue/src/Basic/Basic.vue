<script lang="ts" setup>
import type { Connection, Edge, Node } from '@xyflow/vue';
import { Background, Controls, MiniMap, Panel, setupVueFlow, VueFlow } from '@xyflow/vue';

const { addEdges, toObject, setViewport } = setupVueFlow();

const nodes = shallowRef<Node[]>([
  { id: '1', type: 'input', data: { label: 'Node 1' }, position: { x: 250, y: 5 }, class: 'light' },
  { id: '2', data: { label: 'Node 2' }, position: { x: 100, y: 100 }, class: 'light' },
  { id: '3', data: { label: 'Node 3' }, position: { x: 400, y: 100 }, class: 'light' },
  { id: '4', data: { label: 'Node 4' }, position: { x: 400, y: 200 }, class: 'light' },
]);

const edges = shallowRef<Edge[]>([
  { id: 'e1-2', source: '1', target: '2', animated: true },
  { id: 'e1-3', source: '1', target: '3' },
]);

function onConnect(connection: Connection) {
  addEdges([connection]);
}

function updatePos() {
  nodes.value = nodes.value.map((n) => {
    return {
      ...n,
      position: {
        x: Math.random() * 400,
        y: Math.random() * 400,
      },
    };
  });
}

function logToObject() {
  return console.log(toObject());
}
function resetViewport() {
  return setViewport({ x: 0, y: 0, zoom: 1 });
}
function toggleclass() {
  nodes.value = nodes.value.map(el => ({ ...el, class: el.class === 'light' ? 'dark' : 'light' }));
}
</script>

<template>
  <VueFlow
    v-model:nodes="nodes"
    v-model:edges="edges"
    :min-zoom="0.2"
    :max-zoom="4"
    class="vue-flow-basic-example"
    fit-view
    @connect="onConnect"
  >
    <Background />
    <MiniMap />
    <Controls />
    <Panel position="top-right" style="display: flex; gap: 5px">
      <button @click="resetViewport">
        reset viewport
      </button>
      <button @click="updatePos">
        change pos
      </button>
      <button @click="toggleclass">
        toggle class
      </button>
      <button @click="logToObject">
        toObject
      </button>
    </Panel>
  </VueFlow>
</template>
