<script lang="ts" setup>
import type { Connection, Node } from '@xyflow/vue';
import { setupVueFlow, VueFlow } from '@xyflow/vue';
import Sidebar from './Sidebar.vue';

const { addEdges, addNodes, screenToFlowPosition } = setupVueFlow();

let id = 0;
function getId() {
  return `dndnode_${id++}`;
}

const nodes = shallowRef<Node[]>([
  {
    id: '1',
    type: 'input',
    data: { label: 'input node' },
    position: { x: 250, y: 5 },
  },
]);

function onDragOver(event: DragEvent) {
  event.preventDefault();
  if (event.dataTransfer) {
    event.dataTransfer.dropEffect = 'move';
  }
}

function onConnect(connection: Connection) {
  addEdges([connection]);
}

function onDrop(event: DragEvent) {
  const type = event.dataTransfer?.getData('application/vueflow');

  // screenToFlowPosition handles the container-offset internally (replaces the removed `project`)
  const position = screenToFlowPosition({
    x: event.clientX,
    y: event.clientY,
  });

  addNodes({
    id: getId(),
    type,
    position,
    data: { label: `${type} node` },
  });
}
</script>

<template>
  <div class="dndflow" @drop="onDrop">
    <VueFlow v-model:nodes="nodes" @connect="onConnect" @dragover="onDragOver" />
    <Sidebar />
  </div>
</template>

<style>
@import 'dnd.css';
</style>
