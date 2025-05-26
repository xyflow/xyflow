<script lang="ts" setup>
import type { NodeDimensionChange } from '@xyflow/system';
import type { ControlLinePosition, ControlPosition, NodeResizerEmits, NodeResizerProps } from './types';
import { getNodeDimensions } from '@xyflow/system';
import { computed, inject, toRef, watch } from 'vue';
import { useVueFlow } from '../../composables';
import { NodeId } from '../../context';
import ResizeControl from './ResizeControl.vue';
import { ResizeControlVariant } from './types';

const props = withDefaults(defineProps<NodeResizerProps>(), {
  isVisible: true,
  autoScale: true,
});

const emits = defineEmits<NodeResizerEmits>();

const { getInternalNode, emits: triggerEmits } = useVueFlow();

const handleControls: ControlPosition[] = ['top-left', 'top-right', 'bottom-left', 'bottom-right'];

const lineControls: ControlLinePosition[] = ['top', 'right', 'bottom', 'left'];

const contextNodeId = inject(NodeId, null);

const nodeId = toRef(() => (typeof props.nodeId === 'string' ? props.nodeId : contextNodeId ?? undefined));

const node = computed(() => getInternalNode(nodeId.value));

watch(
  [
    () => props.minWidth,
    () => props.minHeight,
    () => props.maxWidth,
    () => props.maxHeight,
    () => !!node.value?.measured.width && !!node.value.measured.height,
  ],
  ([minWidth, minHeight, maxWidth, maxHeight, isInitialized]) => {
    const n = node.value;

    if (n && isInitialized) {
      const dimensions = getNodeDimensions(n);

      const dimensionChange: NodeDimensionChange = {
        id: n.id,
        type: 'dimensions',
        setAttributes: true,
        dimensions: {
          width: dimensions.width,
          height: dimensions.height,
        },
      };

      if (minWidth && dimensions.width < minWidth) {
        dimensionChange.dimensions!.width = minWidth;
      }

      if (minHeight && dimensions.height < minHeight) {
        dimensionChange.dimensions!.height = minHeight;
      }

      if (maxWidth && dimensions.width > maxWidth) {
        dimensionChange.dimensions!.width = maxWidth;
      }

      if (maxHeight && dimensions.height > maxHeight) {
        dimensionChange.dimensions!.height = maxHeight;
      }

      if (dimensionChange.dimensions!.width !== n.measured.width || dimensionChange.dimensions!.height !== n.measured.height) {
        triggerEmits.nodesChange([dimensionChange]);
      }
    }
  },
  { flush: 'post', immediate: true },
);
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
      v-for="c of lineControls"
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
      v-for="c of handleControls"
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
