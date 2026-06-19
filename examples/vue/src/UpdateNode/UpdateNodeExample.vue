<script lang="ts" setup>
import type { Edge, Node } from '@xyflow/vue';
import { isEdge, isNode, useVueFlow, VueFlow } from '@xyflow/vue';

const initialElements: (Node | Edge)[] = [
  { id: '1', data: { label: '-' }, position: { x: 100, y: 100 } },
  { id: '2', data: { label: 'Node 2' }, position: { x: 100, y: 200 } },
  { id: 'e1-2', source: '1', target: '2' },
];

const nodes = ref<Node[]>(initialElements.filter(isNode));
const edges = ref<Edge[]>(initialElements.filter(isEdge));

const { updateNode } = useVueFlow();

const opts = reactive({
  bg: '#eeeeee',
  name: 'Node 1',
  hidden: false,
});

function onUpdate() {
  updateNode('1', node => ({
    data: { ...node.data, label: opts.name },
    style: { backgroundColor: opts.bg },
    hidden: opts.hidden,
  }));
}

onMounted(onUpdate);
</script>

<template>
  <VueFlow v-model:nodes="nodes" v-model:edges="edges" :default-viewport="{ zoom: 1.5 }" :min-zoom="0.2" :max-zoom="4">
    <div class="updatenode__controls">
      <label>label:</label>
      <input v-model="opts.name" @input="onUpdate">

      <label class="updatenode__bglabel">background:</label>
      <input v-model="opts.bg" type="color" @input="onUpdate">

      <div class="updatenode__checkboxwrapper">
        <label>hidden:</label>
        <input v-model="opts.hidden" type="checkbox" @change="onUpdate">
      </div>
    </div>
  </VueFlow>
</template>

<style>
@import 'updatenode.css';
</style>
