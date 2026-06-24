<script lang="ts" setup>
import type { NodeResizerEmits, ResizeControlLineProps } from './types';
import ResizeControl from './ResizeControl.vue';
import { ResizeControlVariant } from './types';

const props = defineProps<ResizeControlLineProps>();

const emits = defineEmits<NodeResizerEmits>();
</script>

<script lang="ts">
export default {
  name: 'ResizeControlLine',
  compatConfig: { MODE: 3 },
};
</script>

<template>
  <ResizeControl
    v-bind="props"
    :variant="ResizeControlVariant.Line"
    @resize-start="emits('resizeStart', $event)"
    @resize="emits('resize', $event)"
    @resize-end="emits('resizeEnd', $event)"
  />
</template>
