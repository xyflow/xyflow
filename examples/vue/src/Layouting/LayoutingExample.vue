<script lang="ts" setup>
import type { Direction } from './composables/useLayout';
import { Background, Panel, setupVueFlow, VueFlow } from '@xyflow/vue';
import { ref } from 'vue';
import Icon from './components/Icon.vue';
import { useLayout } from './composables/useLayout';

import { useRunProcess } from './composables/useRunProcess';
import ProcessEdge from './edges/ProcessEdge.vue';
import { initialEdges, initialNodes } from './initial-elements';
import ProcessNode from './nodes/ProcessNode.vue';

import './styles.css';

const nodes = shallowRef(initialNodes);

const edges = shallowRef(initialEdges);

const cancelOnError = ref(true);

const { graph, layout } = useLayout();

const { run, stop, reset, isRunning } = useRunProcess({ graph, cancelOnError });

const { fitView } = setupVueFlow();

async function layoutGraph(direction: Direction) {
  // Stop the current execution process
  await stop();

  // Reset the nodes to their initial status
  reset(nodes.value);

  // Layout the graph
  nodes.value = layout(nodes.value, edges.value, direction);

  // Fit the view to the graph
  await fitView();
}
</script>

<template>
  <div class="layout-flow">
    <VueFlow
      v-model:nodes="nodes"
      v-model:edges="edges"
      :default-edge-options="{ type: 'process', animated: true }"
      @nodes-initialized="layoutGraph('LR')"
    >
      <template #node-process="processNodeProps">
        <ProcessNode v-bind="processNodeProps" />
      </template>

      <template #edge-process="processEdgeProps">
        <ProcessEdge v-bind="processEdgeProps" />
      </template>

      <Background />

      <Panel class="process-panel" position="top-right">
        <div class="layout-panel">
          <button v-if="isRunning" class="stop-btn" title="stop" @click="stop">
            <Icon name="stop" />
            <span class="spinner" />
          </button>
          <button v-else title="start" @click="run(nodes)">
            <Icon name="play" />
          </button>

          <button title="set horizontal layout" @click="layoutGraph('LR')">
            <Icon name="horizontal" />
          </button>

          <button title="set vertical layout" @click="layoutGraph('TB')">
            <Icon name="vertical" />
          </button>
        </div>

        <div class="checkbox-panel">
          <label>Cancel on error</label>
          <input v-model="cancelOnError" type="checkbox">
        </div>
      </Panel>
    </VueFlow>
  </div>
</template>
