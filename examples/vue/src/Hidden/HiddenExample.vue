<script lang="ts" setup>
import type { Edge, Node } from '@xyflow/vue';
import { Controls, MiniMap, VueFlow } from '@xyflow/vue';

const isHidden = ref(false);

const nodes = ref<Node[]>([
  { id: '1', type: 'input', data: { label: 'Node 1' }, position: { x: 250, y: 5 } },
  { id: '2', data: { label: 'Node 2' }, position: { x: 100, y: 100 } },
  { id: '3', data: { label: 'Node 3' }, position: { x: 400, y: 100 } },
  { id: '4', data: { label: 'Node 4' }, position: { x: 400, y: 200 } },
]);

const edges = ref<Edge[]>([
  { id: 'e1-2', source: '1', target: '2' },
  { id: 'e1-3', source: '1', target: '3' },
  { id: 'e3-4', source: '3', target: '4' },
]);

watch(isHidden, (shouldHide) => {
  nodes.value = nodes.value.map(n => ({ ...n, hidden: shouldHide }));
  edges.value = edges.value.map(e => ({ ...e, hidden: shouldHide }));
});
</script>

<template>
  <VueFlow v-model:nodes="nodes" v-model:edges="edges">
    <MiniMap />

    <Controls />

    <div :style="{ position: 'absolute', left: '10px', top: '10px', zIndex: 4 }">
      <div>
        <label for="ishidden">
          isHidden
          <input id="ishidden" v-model="isHidden" type="checkbox" class="vue-flow__ishidden">
        </label>
      </div>
    </div>
  </VueFlow>
</template>
