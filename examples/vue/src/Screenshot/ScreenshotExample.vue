<script lang="ts" setup>
import type { Edge, Node, NodeChangeset } from '@xyflow/vue';
import { Panel, VueFlow } from '@xyflow/vue';
import { useScreenshot } from './useScreenshot';

const { capture } = useScreenshot();

const flowEl = ref<HTMLElement>();

const nodes = shallowRef<Node[]>([
  { id: '1', type: 'input', data: { label: 'Node 1' }, position: { x: 250, y: 5 } },
  { id: '2', data: { label: 'Node 2' }, position: { x: 100, y: 100 } },
  { id: '3', data: { label: 'Node 3' }, position: { x: 400, y: 100 } },
  { id: '4', data: { label: 'Node 4' }, position: { x: 400, y: 200 } },
]);

const edges = shallowRef<Edge[]>([
  { id: 'e1-2', source: '1', target: '2', animated: true },
  { id: 'e1-3', source: '1', target: '3' },
]);

function doScreenshot() {
  if (!flowEl.value) {
    console.warn('VueFlow element not found');
    return;
  }

  capture(flowEl.value, { shouldDownload: true });
}
function onNodesChange(changes: NodeChangeset<Node>) {
  nodes.value = changes.applyTo(nodes.value);
}
</script>

<template>
  <div ref="flowEl" style="width: 100%; height: 100%">
    <VueFlow :nodes="nodes" :edges="edges" @nodes-change="onNodesChange" fit-view style="background: white">
      <Panel position="top-center">
        <button @click="doScreenshot">Screenshot</button>
      </Panel>
    </VueFlow>
  </div>
</template>
