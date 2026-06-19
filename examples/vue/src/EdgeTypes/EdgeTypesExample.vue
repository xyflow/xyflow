<script lang="ts" setup>
import type { Edge, Node } from '@xyflow/vue';
import { Controls, isEdge, isNode, MiniMap, VueFlow } from '@xyflow/vue';

import { getElements } from './utils';

const initialElements = getElements();
const nodes = ref<Node[]>(initialElements.filter(isNode));
const edges = ref<Edge[]>(initialElements.filter(isEdge));
</script>

<template>
  <VueFlow v-model:nodes="nodes" v-model:edges="edges" :min-zoom="0.2" fit-view>
    <MiniMap />
    <Controls />
  </VueFlow>
</template>
