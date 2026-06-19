<script lang="ts" setup>
import type { Connection, Edge, Node, VueFlowInstance } from '@xyflow/vue';
import { Background, Controls, isEdge, isNode, MarkerType, MiniMap, VueFlow } from '@xyflow/vue';

import { createElements } from './floating-edge-utils';
import FloatingConnectionLine from './FloatingConnectionLine.vue';
import FloatingEdge from './FloatingEdge.vue';

const initialElements = createElements();

const nodes = ref<Node[]>(initialElements.filter(isNode) as Node[]);
const edges = ref<Edge[]>(initialElements.filter(isEdge) as Edge[]);

const flow = ref<VueFlowInstance>();

function onConnect(params: Connection) {
  flow.value?.addEdges({ ...params, type: 'floating', markerEnd: MarkerType.Arrow });
}
</script>

<template>
  <div class="floatingedges">
    <VueFlow ref="flow" v-model:nodes="nodes" v-model:edges="edges" fit-view @connect="onConnect">
      <Background variant="lines" :gap="24" />

      <MiniMap />

      <Controls />

      <template #connection-line="props">
        <FloatingConnectionLine v-bind="props" />
      </template>

      <template #edge-floating="props">
        <FloatingEdge v-bind="props" />
      </template>
    </VueFlow>
  </div>
</template>

<style>
.floatingedges {
  flex-direction: column;
  display: flex;
  height: 100%;
}

.floatingedges .vue-flow__handle {
  opacity: 0;
}
</style>
