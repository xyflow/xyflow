<script setup lang="ts">
import { Background, Panel, setupVueFlow, VueFlow } from '@xyflow/vue';
import { ref, shallowRef } from 'vue';
import { getElements } from './utils';

const { nodes: initialNodes, edges: initialEdges } = getElements(30, 30);

const nodes = shallowRef(initialNodes);
const edges = shallowRef(initialEdges);

const { fitView } = setupVueFlow();

const flowEl = ref<HTMLElement>();

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

async function updatePos() {
  const width = flowEl.value?.clientWidth ?? 0;
  const height = flowEl.value?.clientHeight ?? 0;

  nodes.value = nodes.value.map(el => ({
    ...el,
    position: {
      x: Math.random() * 10 * width,
      y: Math.random() * 10 * height,
    },
  }));

  await fitView({ duration: 1000, padding: 0.5 });
}
</script>

<template>
  <div ref="flowEl" style="width: 100%; height: 100%">
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
  </div>
</template>
