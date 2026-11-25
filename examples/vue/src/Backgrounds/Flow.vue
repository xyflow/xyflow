<script lang="ts" setup>
import type { BackgroundProps, Node } from '@xyflow/vue';
import { Background, VueFlow } from '@xyflow/vue';

defineProps<{ id: string; bgProps: BackgroundProps[] }>();

const nodes = shallowRef<Node[]>([{ id: '1', data: { label: 'Node 1' }, position: { x: 50, y: 50 } }]);
</script>

<template>
  <VueFlow :id="id" v-model:nodes="nodes">
    <Background v-for="(props, idx) of bgProps" :id="String(idx)" :key="idx" v-bind="props" />
  </VueFlow>
</template>
