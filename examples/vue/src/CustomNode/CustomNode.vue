<script lang="ts" setup>
import type { Edge, Node } from '@xyflow/vue';
import type { ColorSelectorNodeProps } from './types';

import { Controls, MiniMap, Position, VueFlow } from '@xyflow/vue';
import ColorSelectorNode from './ColorSelectorNode.vue';

const bgColor = shallowRef('#1A192B');

const nodes = ref<Node[]>([
  {
    id: '1',
    type: 'input',
    data: { label: 'An input node' },
    position: { x: 0, y: 50 },
    sourcePosition: Position.Right,
  },
  {
    id: '2',
    type: 'colorSelector',
    data: { color: bgColor },
    style: { border: '1px solid #777', padding: '10px' },
    position: { x: 250, y: 50 },
  },
  {
    id: '3',
    type: 'output',
    data: { label: 'Output A' },
    position: { x: 650, y: 25 },
    targetPosition: Position.Left,
  },
  {
    id: '4',
    type: 'output',
    data: { label: 'Output B' },
    position: { x: 650, y: 100 },
    targetPosition: Position.Left,
  },
]);

const edges = ref<Edge[]>([
  { id: 'e1-2', source: '1', target: '2', animated: true, style: { stroke: '#fff' } },
  { id: 'e2a-3', source: '2', sourceHandle: 'a', target: '3', animated: true, style: { stroke: '#fff' } },
  { id: 'e2b-4', source: '2', sourceHandle: 'b', target: '4', animated: true, style: { stroke: '#fff' } },
]);

function nodeStroke(n: Node) {
  switch (n.type) {
    case 'colorSelector':
      return bgColor.value;
    case 'input':
      return '#0041d0';
    case 'output':
      return '#ff0072';
    default:
      return '#eee';
  }
}

function nodeColor(n: Node) {
  if (n.type === 'colorSelector') {
    return bgColor.value;
  }

  return '#fff';
}
</script>

<template>
  <VueFlow :nodes="nodes" :edges="edges" fit-view :style="{ backgroundColor: bgColor }">
    <template #node-colorSelector="props">
      <!-- the `#node-colorSelector` slot only renders for colorSelector nodes, so the wide slot props are
           that node's props at runtime; cast to satisfy the typed child (slot keys can't narrow the type). -->
      <ColorSelectorNode v-bind="props as unknown as ColorSelectorNodeProps" @change="bgColor = $event" />
    </template>
    <MiniMap :node-stroke-color="nodeStroke" :node-color="nodeColor" />
    <Controls />
  </VueFlow>
</template>
