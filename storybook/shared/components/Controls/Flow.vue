<script setup lang="ts">
import { computed } from 'vue';
import { VueFlow, Background, Controls } from '@xyflow/vue';
import { defaultFlowProps } from '../../defaultFlow';
import { useFlowFixture } from '../../vue/useFlowFixture';
import type { SharedControlsArgs } from './config';
const props = defineProps<SharedControlsArgs>();
const addonProps = computed(() => {
  const { className, orientation, fitViewOptions, 'aria-label': ariaLabel, ...rest } = props;
  return { ...rest, fitViewParams: fitViewOptions, ariaLabel, ...(className ? { class: className } : {}) };
});
const { nodes, edges, resetKey, onConnect } = useFlowFixture(defaultFlowProps);
</script>
<template>
  <VueFlow :key="resetKey" v-bind="defaultFlowProps" v-model:nodes="nodes" v-model:edges="edges" @connect="onConnect">
    <Background />
    <Controls
      v-bind="addonProps"
      :style="{ display: 'flex', flexDirection: props.orientation === 'horizontal' ? 'row' : 'column', ...props.style }"
    />
  </VueFlow>
</template>
