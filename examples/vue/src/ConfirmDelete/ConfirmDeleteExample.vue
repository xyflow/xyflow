<script lang="ts" setup>
import type { Edge, Node, OnBeforeDelete } from '@xyflow/vue';
import { Background, useVueFlow, VueFlow } from '@xyflow/vue';
import Dialog from './Dialog.vue';
import { useDialog } from './useDialog';

const { onConnect, addEdges } = useVueFlow();

const dialog = useDialog({ message: 'Do you really want to delete this item?' });

const nodes = ref<Node[]>([
  { id: '1', type: 'input', data: { label: 'Node 1' }, position: { x: 250, y: 5 }, class: 'light' },
  { id: '2', data: { label: 'Node 2' }, position: { x: 100, y: 100 }, class: 'light' },
  { id: '3', data: { label: 'Node 3' }, position: { x: 400, y: 100 }, class: 'light' },
  { id: '4', data: { label: 'Node 4' }, position: { x: 400, y: 200 }, class: 'light' },
]);

const edges = ref<Edge[]>([
  { id: 'e1-2', source: '1', target: '2', animated: true },
  { id: 'e1-3', source: '1', target: '3' },
]);

onConnect(addEdges);

// `onBeforeDelete` is consulted once per deletion (a node together with its connected edges) — return
// `false` to cancel or `true` to proceed. Replaces the old `auto-apply-changes="false"` + per-change dialog.
const onBeforeDelete: OnBeforeDelete = () => dialog.confirm();
</script>

<template>
  <VueFlow :nodes="nodes" :edges="edges" :on-before-delete="onBeforeDelete" fit-view class="vue-flow-basic-example">
    <Background />

    <Dialog />
  </VueFlow>
</template>
