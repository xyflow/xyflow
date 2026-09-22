<script setup lang="ts">
import { computed } from 'vue';
import { VueFlow, Background, MiniMap } from '@xyflow/vue';
import { defaultFlowProps } from '../../defaultFlow';
import { useFlowFixture } from '../../vue/useFlowFixture';
import type { SharedMiniMapArgs } from './config';
const props = defineProps<SharedMiniMapArgs>();
const addonProps = computed(() => {
  const { className, ...rest } = props;
  return { ...rest, ...(className ? { class: className } : {}) };
});
const { nodes, edges, resetKey, onConnect } = useFlowFixture(defaultFlowProps);
</script>
<template>
  <VueFlow :key="resetKey" v-bind="defaultFlowProps" v-model:nodes="nodes" v-model:edges="edges" @connect="onConnect">
    <Background />
    <MiniMap v-bind="addonProps" :style="{ backgroundColor: props.bgColor, ...props.style }">
      <template v-if="props.customNode" #node-default="node">
        <circle
          :cx="node.position.x + node.dimensions.width / 2"
          :cy="node.position.y + node.dimensions.height / 2"
          :r="Math.max(1, Math.min(node.dimensions.width, node.dimensions.height) / 2)"
          :fill="node.selected ? '#ff6b6b' : '#ffcc00'"
        /> </template
    ></MiniMap>
  </VueFlow>
</template>
