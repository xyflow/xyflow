<script lang="ts" setup>
import type { CSSProperties } from 'vue';
import type { EdgeToolbarProps } from './types';
import { getEdgeToolbarTransform } from '@xyflow/system';
import { computed } from 'vue';
import { useVueFlow, useVueFlowStore } from '../../composables';
import EdgeLabelRenderer from '../Edges/EdgeLabelRenderer.vue';

const props = withDefaults(defineProps<EdgeToolbarProps>(), {
  alignX: 'center',
  alignY: 'center',
  isVisible: undefined,
});

const { viewport } = useVueFlow();

const { edgeLookup } = useVueFlowStore();

const edge = computed(() => edgeLookup.get(props.edgeId));

const isActive = computed(() =>
  typeof props.isVisible === 'boolean' ? props.isVisible : edge.value?.selected,
);

const wrapperStyle = computed<CSSProperties>(() => ({
  position: 'absolute',
  transform: getEdgeToolbarTransform(props.x, props.y, viewport.value.zoom, props.alignX, props.alignY),
  zIndex: (edge.value?.zIndex ?? 0) + 1,
  pointerEvents: 'all',
  transformOrigin: '0 0',
}));
</script>

<script lang="ts">
export default {
  name: 'EdgeToolbar',
  compatConfig: { MODE: 3 },
  inheritAttrs: false,
};
</script>

<template>
  <EdgeLabelRenderer v-if="isActive">
    <div v-bind="{ ...$attrs, 'data-id': edge?.id ?? '' }" :style="wrapperStyle" class="vue-flow__edge-toolbar">
      <slot />
    </div>
  </EdgeLabelRenderer>
</template>
