<script lang="ts" setup>
import type { Edge, Node } from '@xyflow/vue';
import { Background, Controls, MiniMap, setupVueFlow, VueFlow } from '@xyflow/vue';

const { addNodes, addEdges, onConnect, onInit, onNodeDragStop } = setupVueFlow();

const nodes = shallowRef<Node[]>([]);
const edges = shallowRef<Edge[]>([]);

const flowEl = ref<HTMLElement>();

onConnect(addEdges);

onInit(flowInstance => console.log('flow loaded:', flowInstance));

onNodeDragStop(node => console.log('drag stop', node));

function addRandomNode() {
  const nodeId = (nodes.value.length + 1).toString();

  addNodes({
    id: nodeId,
    data: { label: `Node: ${nodeId}` },
    position: {
      x: Math.random() * (flowEl.value?.clientWidth ?? 0),
      y: Math.random() * (flowEl.value?.clientHeight ?? 0),
    },
  });
}
</script>

<template>
  <div ref="flowEl" style="width: 100%; height: 100%">
    <VueFlow v-model:nodes="nodes" v-model:edges="edges">
      <MiniMap />
      <Controls />
      <Background variant="lines" />

      <button type="button" :style="{ position: 'absolute', left: '10px', top: '10px', zIndex: 4 }" @click="addRandomNode">
        add node
      </button>
    </VueFlow>
  </div>
</template>
