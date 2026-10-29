<script lang="ts" setup>
import type { NodeResizerEmits, NodeResizerProps } from './types';
import { XY_RESIZER_HANDLE_POSITIONS, XY_RESIZER_LINE_POSITIONS } from '@xyflow/system';
import ResizeControl from './ResizeControl.vue';
import { ResizeControlVariant } from './types';

withDefaults(defineProps<NodeResizerProps>(), {
  isVisible: true,
  autoScale: true,
});

const emits = defineEmits<NodeResizerEmits>();
</script>

<script lang="ts">
export default {
  name: 'NodeResizer',
  compatConfig: { MODE: 3 },
  inheritAttrs: false,
};
</script>

<template>
  <template v-if="isVisible">
    <ResizeControl
      v-for="c of XY_RESIZER_LINE_POSITIONS"
      :key="c"
      :class="lineClassName"
      :style="lineStyle"
      :node-id="nodeId"
      :position="c"
      :variant="ResizeControlVariant.Line"
      :color="color"
      :min-width="minWidth"
      :min-height="minHeight"
      :max-width="maxWidth"
      :max-height="maxHeight"
      :should-resize="shouldResize"
      :keep-aspect-ratio="keepAspectRatio"
      :auto-scale="autoScale"
      @resize-start="emits('resizeStart', $event)"
      @resize="emits('resize', $event)"
      @resize-end="emits('resizeEnd', $event)"
    />

    <ResizeControl
      v-for="c of XY_RESIZER_HANDLE_POSITIONS"
      :key="c"
      :class="handleClassName"
      :style="handleStyle"
      :node-id="nodeId"
      :position="c"
      :color="color"
      :min-width="minWidth"
      :min-height="minHeight"
      :max-width="maxWidth"
      :max-height="maxHeight"
      :should-resize="shouldResize"
      :keep-aspect-ratio="keepAspectRatio"
      :auto-scale="autoScale"
      @resize-start="emits('resizeStart', $event)"
      @resize="emits('resize', $event)"
      @resize-end="emits('resizeEnd', $event)"
    />
  </template>
</template>
