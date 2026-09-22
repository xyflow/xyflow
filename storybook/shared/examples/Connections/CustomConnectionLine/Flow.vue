<script setup lang="ts">
import { VueFlow, Background } from '@xyflow/vue';
import { defaultFlowProps } from '../../../defaultFlow';
import { useFlowFixture } from '../../../vue/useFlowFixture';
const { nodes, edges, onConnect } = useFlowFixture(defaultFlowProps);
</script>
<template>
  <VueFlow
    v-bind="defaultFlowProps"
    v-model:nodes="nodes"
    v-model:edges="edges"
    :connection-drag-threshold="25"
    @connect="onConnect"
  >
    <Background />
    <template #connection-line="{ fromX, fromY, toX, toY }">
      <path
        fill="none"
        stroke="#222"
        :stroke-width="1.5"
        class="animated"
        :d="'M' + fromX + ',' + fromY + ' C ' + fromX + ' ' + toY + ' ' + fromX + ' ' + toY + ' ' + toX + ',' + toY"
      />
      <circle :cx="toX" :cy="toY" r="3" fill="#fff" stroke="#222" :stroke-width="1.5" />
    </template>
  </VueFlow>
</template>
