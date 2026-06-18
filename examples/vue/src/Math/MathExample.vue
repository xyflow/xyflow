<script setup lang="ts">
import type { OperatorNodeData, ValueNodeData } from './types';
import { Background, VueFlow } from '@xyflow/vue';
import { initialEdges, initialNodes } from './initialElements';
import OperatorNode from './OperatorNode.vue';
import ResultNode from './ResultNode.vue';
import ValueNode from './ValueNode.vue';
import './styles.css';

const nodes = ref(initialNodes);

const edges = ref(initialEdges);
</script>

<template>
  <VueFlow class="math-flow" :nodes="nodes" :edges="edges" fit-view>
    <!-- node slots are keyed by `node-${type | string}`, so their `data` widens to `Record<string, unknown>`;
         narrow it back to each node's concrete data type at the call site. -->
    <template #node-value="props">
      <ValueNode :id="props.id" :data="props.data as ValueNodeData" />
    </template>

    <template #node-operator="props">
      <OperatorNode :id="props.id" :data="props.data as OperatorNodeData" />
    </template>

    <template #node-result="props">
      <ResultNode :id="props.id" />
    </template>

    <Background />
  </VueFlow>
</template>
