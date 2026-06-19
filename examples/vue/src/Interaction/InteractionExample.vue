<script lang="ts" setup>
import type { Connection, Edge, FlowEvents, Node, VueFlowInstance } from '@xyflow/vue';
import { Controls, MiniMap, VueFlow, VueFlowProvider } from '@xyflow/vue';
import InteractionControls from './InteractionControls.vue';

const nodes = ref<Node[]>([
  { id: '1', type: 'input', data: { label: 'Node 1' }, position: { x: 250, y: 5 } },
  { id: '2', data: { label: 'Node 2' }, position: { x: 100, y: 100 } },
  { id: '3', data: { label: 'Node 3' }, position: { x: 400, y: 100 } },
  { id: '4', data: { label: 'Node 4' }, position: { x: 400, y: 200 } },
]);

const edges = ref<Edge[]>([
  { id: 'e1-2', source: '1', target: '2', animated: true },
  { id: 'e1-3', source: '1', target: '3' },
]);

const captureZoomClick = ref(false);

const captureZoomScroll = ref(false);

const flow = ref<VueFlowInstance>();

function onConnect(connection: Connection) {
  flow.value?.addEdges([connection]);
}

function onNodeDragStart(e: FlowEvents['nodeDragStart']) {
  console.log('drag start', e);
}

function onNodeDragStop(e: FlowEvents['nodeDragStop']) {
  console.log('drag stop', e);
}

function onPaneClick(event: FlowEvents['paneClick']) {
  return captureZoomClick.value && console.log('pane click', event);
}

function onPaneScroll(event: FlowEvents['paneScroll']) {
  return captureZoomScroll.value && console.log('pane scroll', event);
}

function onPaneContextMenu(event: FlowEvents['paneContextMenu']) {
  return captureZoomClick.value && console.log('pane ctx menu', event);
}

function onMoveEnd(moveEvent: FlowEvents['moveEnd']) {
  return console.log('move end', moveEvent);
}
</script>

<template>
  <VueFlowProvider>
    <VueFlow
      ref="flow"
      v-model:nodes="nodes"
      v-model:edges="edges"
      @connect="onConnect"
      @node-drag-start="onNodeDragStart"
      @node-drag-stop="onNodeDragStop"
      @pane-click="onPaneClick"
      @pane-scroll="onPaneScroll"
      @pane-context-menu="onPaneContextMenu"
      @move-end="onMoveEnd"
    >
      <MiniMap />

      <Controls />

      <InteractionControls v-model:capture-zoom-click="captureZoomClick" v-model:capture-zoom-scroll="captureZoomScroll" />
    </VueFlow>
  </VueFlowProvider>
</template>
