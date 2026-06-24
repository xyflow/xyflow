<script setup lang="ts">
import { Background, Panel, storeToRefs, useStore, useVueFlow, VueFlow } from '@xyflow/vue';
import { nextTick, shallowRef } from 'vue';
import { getElements } from './utils';

const { nodes: initialNodes, edges: initialEdges } = getElements(30, 30);

const nodes = shallowRef(initialNodes);
const edges = shallowRef(initialEdges);

const { fitView } = useVueFlow();

const { dimensions } = storeToRefs(useStore());

function toggleClass() {
  nodes.value = nodes.value.map(el => ({
    ...el,
    class: el.class === 'light' ? 'dark' : 'light',
  }));

  edges.value = edges.value.map(el => ({
    ...el,
    class: el.class === 'light' ? 'dark' : 'light',
  }));
}

function updatePos() {
  nodes.value = nodes.value.map(el => ({
    ...el,
    position: {
      x: Math.random() * 10 * dimensions.value.width,
      y: Math.random() * 10 * dimensions.value.height,
    },
  }));

  nextTick(() => {
    fitView({ duration: 1000, padding: 0.5 });
  });
}
</script>

<template>
  <VueFlow v-model:nodes="nodes" v-model:edges="edges" :min-zoom="0.1" fit-view>
    <Background />

    <Panel position="top-right">
      <button style="margin-right: 5px" @click="updatePos">
        update positions
      </button>
      <button @click="toggleClass">
        toggle class
      </button>
    </Panel>
  </VueFlow>
</template>
