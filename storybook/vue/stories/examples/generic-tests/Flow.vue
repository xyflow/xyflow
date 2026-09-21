<script setup lang="ts">
import type { Connection } from '@xyflow/vue';
import { shallowRef } from 'vue';
import { addEdge, Background, Controls, MiniMap, Panel, VueFlow } from '@xyflow/vue';

const props = defineProps<{ flowConfig: FlowConfig }>();

const { nodes: initialNodes = [], edges: initialEdges = [], ...rest }
  = props.flowConfig.flowProps ?? ({} as NonNullable<FlowConfig['flowProps']>);

// the remaining flow props are spread onto <VueFlow> via `v-bind`; widen so the generic spread type-checks
const flowProps = rest as Record<string, unknown>;

const nodes = shallowRef([...initialNodes]);
const edges = shallowRef([...initialEdges]);

function onConnect(connection: Connection) {
  edges.value = addEdge(connection, edges.value);
}
</script>

<template>
  <div class="generic-test-flow">
    <!-- fixed id so generated marker ids are deterministic (`1__…`); Vue Flow otherwise defaults to a random `useId()` -->
    <VueFlow
      id="1"
      v-model:nodes="nodes"
      v-model:edges="edges"
      v-bind="flowProps"
      @connect="onConnect"
    >
      <Controls v-if="flowConfig.controlsProps" v-bind="flowConfig.controlsProps" />
      <Panel v-if="flowConfig.panelProps" v-bind="flowConfig.panelProps" />
      <MiniMap v-if="flowConfig.minimapProps" v-bind="flowConfig.minimapProps" />
      <Background v-if="flowConfig.backgroundProps" v-bind="flowConfig.backgroundProps" />
    </VueFlow>
  </div>
</template>

<style scoped>
.generic-test-flow {
  position: fixed;
  inset: 0;
  text-transform: none;
}
</style>
