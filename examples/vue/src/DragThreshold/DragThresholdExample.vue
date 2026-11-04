<script lang="ts" setup>
import type { Node, NodeMouseEvent } from '@xyflow/vue';
import { Background, Panel, VueFlow } from '@xyflow/vue';

const nodes = shallowRef<Node[]>([
  { id: '1', data: { label: 'Node 1' }, position: { x: 0, y: 0 } },
  { id: '2', data: { label: 'Node 2' }, position: { x: 200, y: 100 } },
  { id: '3', data: { label: 'Node 3' }, position: { x: 0, y: 200 } },
]);

const dragThreshold = ref(1);
const snapGridSize = ref(0);
const messages = ref<string[]>([]);
let clickCount = 0;

const snapToGrid = computed(() => snapGridSize.value > 0);

function log(msg: string) {
  clickCount++;
  messages.value = [`#${clickCount} ${msg}`, ...messages.value].slice(0, 10);
}

function onNodeClick({ node }: NodeMouseEvent) {
  log(`node click: node ${node.id}`);
}

function onPaneClick() {
  log('pane click');
}
</script>

<template>
  <VueFlow
    v-model:nodes="nodes"
    :node-drag-threshold="dragThreshold"
    :snap-to-grid="snapToGrid"
    :snap-grid="snapToGrid ? [snapGridSize, snapGridSize] : undefined"
    fit-view
    @node-click="onNodeClick"
    @pane-click="onPaneClick"
  >
    <Background :gap="snapToGrid ? snapGridSize : undefined" />
    <Panel position="top-left" class="controls">
      <div>
        <label>
          nodeDragThreshold
          <input v-model.number="dragThreshold" type="number" min="0">
        </label>
      </div>
      <div>
        <label>
          snapGrid size (0 = off)
          <input v-model.number="snapGridSize" type="number" min="0">
        </label>
      </div>
      <button @click="messages = []">
        clear
      </button>
      <ul>
        <li v-for="msg in messages" :key="msg">
          {{ msg }}
        </li>
      </ul>
    </Panel>
  </VueFlow>
</template>

<style scoped>
.controls {
  /* reset the example app's global #root styles (uppercase, monospace, centered) */
  text-transform: none;
  font-family: system-ui, sans-serif;
  text-align: left;
  background: var(--xy-node-background-color-default);
  color: var(--xy-node-color-default);
  border: var(--xy-node-border-default);
  border-radius: 5px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.controls button {
  align-self: flex-start;
}

.controls ul {
  margin: 0;
  padding-left: 20px;
}
</style>
