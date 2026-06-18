<script lang="ts" setup>
import type { Edge, FlowExportObject, Node } from '@xyflow/vue';
import { storeToRefs, useStore, useVueFlow } from '@xyflow/vue';

const flowKey = 'example-flow';

const state = useStorage(flowKey, {
  nodes: [] as Node[],
  edges: [] as Edge[],
  viewport: { x: 0, y: 0, zoom: 1 },
} as FlowExportObject);

function getNodeId() {
  return `randomnode_${Date.now()}`;
}

const { addNodes, setNodes, setEdges, toObject, setViewport } = useVueFlow();

const { dimensions } = storeToRefs(useStore());

function onSave() {
  state.value = toObject();
}

function onRestore() {
  const flow = state.value;

  if (flow) {
    const { x = 0, y = 0, zoom = 1 } = flow.viewport;

    setNodes(flow.nodes);

    setEdges(flow.edges);

    setViewport({ x, y, zoom });
  }
}

function onAdd() {
  addNodes({
    id: `random_node-${getNodeId()}`,
    data: { label: 'Added node' },
    position: { x: Math.random() * dimensions.value.width, y: Math.random() * dimensions.value.height },
  });
}
</script>

<template>
  <div class="save__controls">
    <button @click="onSave">
      save
    </button>
    <button @click="onRestore">
      restore
    </button>
    <button @click="onAdd">
      add node
    </button>
  </div>
</template>
