<script lang="ts" setup>
import type { Connection, Edge, Node } from '@xyflow/vue';
import { Background, Controls, isEdge, isNode, MarkerType, MiniMap, setupVueFlow, VueFlow } from '@xyflow/vue';

import { createElements } from './floating-edge-utils';
import FloatingConnectionLine from './FloatingConnectionLine.vue';
import FloatingEdge from './FloatingEdge.vue';

const initialElements = createElements();

const nodes = shallowRef<Node[]>(initialElements.filter(isNode) as Node[]);
const edges = shallowRef<Edge[]>(initialElements.filter(isEdge) as Edge[]);

const { addEdges } = setupVueFlow();

function onConnect(params: Connection) {
  addEdges({ ...params, type: 'floating', markerEnd: MarkerType.Arrow });
}
</script>

<template>
  <div class="floatingedges">
    <VueFlow v-model:nodes="nodes" v-model:edges="edges" fit-view @connect="onConnect">
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
