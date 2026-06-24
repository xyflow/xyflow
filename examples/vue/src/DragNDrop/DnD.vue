<script lang="ts" setup>
import type { Connection, Node, VueFlowInstance } from '@xyflow/vue';
import { VueFlow } from '@xyflow/vue';
import Sidebar from './Sidebar.vue';

let id = 0;
function getId() {
  return `dndnode_${id++}`;
}

const nodes = ref<Node[]>([
  {
    id: '1',
    type: 'input',
    data: { label: 'input node' },
    position: { x: 250, y: 5 },
  },
]);

const flow = ref<VueFlowInstance>();

function onDragOver(event: DragEvent) {
  event.preventDefault();
  if (event.dataTransfer) {
    event.dataTransfer.dropEffect = 'move';
  }
}

function onConnect(connection: Connection) {
  flow.value?.addEdges([connection]);
}

function onDrop(event: DragEvent) {
  const type = event.dataTransfer?.getData('application/vueflow');

  // screenToFlowPosition handles the container-offset internally (replaces the removed `project`)
  const position = flow.value!.screenToFlowPosition({
    x: event.clientX,
    y: event.clientY,
  });

  flow.value?.addNodes({
    id: getId(),
    type,
    position,
    data: { label: `${type} node` },
  });
}
</script>

<template>
  <div class="dndflow" @drop="onDrop">
    <VueFlow ref="flow" v-model:nodes="nodes" @connect="onConnect" @dragover="onDragOver" />
    <Sidebar />
  </div>
</template>

<style>
@import 'dnd.css';
</style>
