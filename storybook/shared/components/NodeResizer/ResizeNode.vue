<script setup lang="ts">
import { computed } from 'vue';
import {
  Handle,
  NodeResizer,
  NodeResizeControl,
  Position,
  type Node,
  type NodeResizerProps,
  type CoordinateExtent,
  type NodeProps,
} from '@xyflow/vue';
const props =
  defineProps<
    NodeProps<Node<Record<string, unknown> & NodeResizerProps & { label?: string; extent?: CoordinateExtent }>>
  >();
const resizeProps = computed(() => ({
  minWidth: props.data.minWidth,
  maxWidth: props.data.maxWidth,
  minHeight: props.data.minHeight,
  maxHeight: props.data.maxHeight,
  keepAspectRatio: props.data.keepAspectRatio,
  shouldResize: props.data.shouldResize,
}));
const positions = computed(() =>
  props.type === 'verticalResizer' ? (['top', 'bottom'] as const) : (['left', 'right'] as const)
);
</script>
<template>
  <NodeResizer
    v-if="props.type === 'defaultResizer'"
    v-bind="resizeProps"
    :is-visible="props.data.isVisible ?? props.selected"
  />
  <NodeResizeControl
    v-else-if="props.type === 'customResizer'"
    v-bind="resizeProps"
    style="background: transparent; border: none"
    >↘</NodeResizeControl
  >
  <NodeResizeControl
    v-else-if="props.type === 'bottomRightResizer'"
    position="bottom-right"
    :min-width="100"
    :max-width="500"
    :min-height="props.height"
    :max-height="props.height"
    color="orange"
    :auto-scale="false"
  />
  <template v-else-if="props.type === 'verticalResizer' || props.type === 'horizontalResizer'">
    <NodeResizeControl
      v-for="position in positions"
      :key="position"
      v-bind="resizeProps"
      :position="position"
      color="red"
    />
  </template>
  <NodeResizer v-else :min-width="100" :min-height="30" />
  <Handle type="target" :position="props.type === 'horizontalResizer' ? Position.Top : Position.Left" />
  <div style="padding: 10px">{{ props.data.label }}</div>
  <Handle
    v-if="props.type !== 'fixedExtent'"
    type="source"
    :position="props.type === 'horizontalResizer' ? Position.Bottom : Position.Right"
  />
</template>
