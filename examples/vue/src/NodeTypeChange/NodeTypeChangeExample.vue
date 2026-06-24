<script lang="ts" setup>
import type { Edge, Node } from '@xyflow/vue';
import { isEdge, isNode, Position, VueFlow } from '@xyflow/vue';

const initialElements: (Node | Edge)[] = [
  {
    id: '1',
    sourcePosition: Position.Right,
    type: 'input',
    data: { label: 'Input' },
    position: { x: 0, y: 80 },
  },
  {
    id: '2',
    type: 'output',
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
    data: { label: 'A Node' },
    position: { x: 250, y: 0 },
  },
  { id: 'e1-2', source: '1', type: 'smoothstep', target: '2', animated: true },
];

const nodes = ref<Node[]>(initialElements.filter(isNode));
const edges = ref<Edge[]>(initialElements.filter(isEdge));

function changeType() {
  // immutably re-map — user nodes are `markRaw`d in 2.0, so mutating `el.type` in place never re-commits
  nodes.value = nodes.value.map(el =>
    el.type === 'input' ? el : { ...el, type: el.type === 'default' ? 'output' : 'default' },
  );
}
</script>

<template>
  <VueFlow v-model:nodes="nodes" v-model:edges="edges" fit-view>
    <button :style="{ position: 'absolute', right: 10, top: 30, zIndex: 4 }" @click="changeType">
      change type
    </button>
  </VueFlow>
</template>
