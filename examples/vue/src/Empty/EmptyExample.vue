<script lang="ts" setup>
import { Background, Controls, MiniMap, storeToRefs, useStore, useVueFlow, VueFlow } from '@xyflow/vue';

const { addNodes, addEdges, onConnect, onInit, onNodeDragStop } = useVueFlow();

const { nodes, dimensions } = storeToRefs(useStore());

onConnect(addEdges);

onInit(flowInstance => console.log('flow loaded:', flowInstance));

onNodeDragStop(node => console.log('drag stop', node));

function addRandomNode() {
  const nodeId = (nodes.value.length + 1).toString();

  addNodes({
    id: nodeId,
    data: { label: `Node: ${nodeId}` },
    position: { x: Math.random() * dimensions.value.width, y: Math.random() * dimensions.value.height },
  });
}
</script>

<template>
  <VueFlow>
    <MiniMap />
    <Controls />
    <Background variant="lines" />

    <button type="button" :style="{ position: 'absolute', left: '10px', top: '10px', zIndex: 4 }" @click="addRandomNode">
      add node
    </button>
  </VueFlow>
</template>
