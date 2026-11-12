<script setup lang="ts">
import type { ColorMode, Connection, Edge, Node } from '@xyflow/vue';
import { ref, shallowRef } from 'vue';
import { addEdge, Background, Controls, MiniMap, Panel, Position, VueFlow } from '@xyflow/vue';

const nodeDefaults = {
  sourcePosition: Position.Right,
  targetPosition: Position.Left,
};

const nodes = shallowRef<Node[]>([
  { id: 'A', type: 'input', position: { x: 0, y: 150 }, data: { label: 'A' }, ...nodeDefaults },
  { id: 'B', position: { x: 250, y: 0 }, data: { label: 'B' }, ...nodeDefaults },
  { id: 'C', position: { x: 250, y: 150 }, data: { label: 'C' }, ...nodeDefaults },
  { id: 'D', position: { x: 250, y: 300 }, data: { label: 'D' }, ...nodeDefaults },
]);

const edges = shallowRef<Edge[]>([
  { id: 'A-B', source: 'A', target: 'B' },
  { id: 'A-C', source: 'A', target: 'C' },
  { id: 'A-D', source: 'A', target: 'D' },
]);

type PageTheme = 'system' | ColorMode;

const pageTheme = ref<PageTheme>('system');
const forceColorMode = ref<ColorMode | undefined>(undefined);

function onConnect(connection: Connection) {
  edges.value = addEdge(connection, edges.value);
}

function onPageThemeChange(event: Event) {
  const value = (event.target as HTMLSelectElement).value as PageTheme;

  pageTheme.value = value;

  if (value === 'system') {
    document.documentElement.removeAttribute('data-theme');
  }
  else {
    document.documentElement.setAttribute('data-theme', value);
  }
}

function onForceColorModeChange(event: Event) {
  const value = (event.target as HTMLSelectElement).value;

  forceColorMode.value = value === 'none' ? undefined : (value as ColorMode);
}
</script>

<template>
  <div class="color-mode-flow">
    <VueFlow
      v-model:nodes="nodes"
      v-model:edges="edges"
      :force-color-mode="forceColorMode"
      fit-view
      @connect="onConnect"
    >
      <MiniMap />
      <Background />
      <Controls />

      <Panel position="top-right">
        <label>
          Page theme (html data-theme)
          <select v-bind="{ 'data-testid': 'colormode-select' }" :value="pageTheme" @change="onPageThemeChange">
            <option value="system">system</option>
            <option value="light">light</option>
            <option value="dark">dark</option>
          </select>
        </label>
        <label>
          Force color mode (flow only)
          <select v-bind="{ 'data-testid': 'force-colormode-select' }" @change="onForceColorModeChange">
            <option value="none">none</option>
            <option value="light">light</option>
            <option value="dark">dark</option>
          </select>
        </label>
      </Panel>
    </VueFlow>
  </div>
</template>

<style scoped>
.color-mode-flow {
  position: fixed;
  inset: 0;
  text-transform: none;
}
</style>
