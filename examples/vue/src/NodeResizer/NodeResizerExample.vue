<script lang="ts" setup>
import type { Edge, Node } from '@xyflow/vue';
import { VueFlow } from '@xyflow/vue';
import CustomResizableNode from './CustomResizableNode.vue';
import ResizableNode from './ResizableNode.vue';
import ResizableNodeSelected from './ResizableNodeSelected.vue';

const nodes = ref<Node[]>([
  {
    id: '1',
    type: 'resizable',
    data: { label: 'NodeResizer' },
    position: { x: 0, y: 50 },
    style: { background: '#fff', border: '1px solid black', borderRadius: '15px', fontSize: '12px' },
  },
  {
    id: '2',
    type: 'resizableSelected',
    data: { label: 'NodeResizer when selected' },
    position: { x: 100, y: 300 },
    style: { background: '#fff', border: '1px solid black', borderRadius: '15px', fontSize: '12px' },
  },
  {
    id: '3',
    type: 'custom-resizable',
    data: { label: 'Custom Resize Icon' },
    position: { x: 150, y: 150 },
    style: {
      background: '#fff',
      fontSize: '12px',
      border: '1px solid black',
      padding: '5px',
      borderRadius: '15px',
      height: '100px',
    },
  },
]);

const edges = ref<Edge[]>([]);
</script>

<template>
  <VueFlow v-model:nodes="nodes" v-model:edges="edges" fit-view class="vue-flow-basic-example">
    <template #node-resizable="resizableNodeProps">
      <ResizableNode :label="resizableNodeProps.data?.label" />
    </template>

    <template #node-resizableSelected="resizableNodeProps">
      <ResizableNodeSelected :label="resizableNodeProps.data?.label" :selected="resizableNodeProps.selected" />
    </template>

    <template #node-custom-resizable="customResizableNodeProps">
      <CustomResizableNode :label="customResizableNodeProps.data?.label" />
    </template>
  </VueFlow>
</template>
