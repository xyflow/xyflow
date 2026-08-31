<script lang="ts" setup>
import type { MarkerProps } from '@xyflow/system';
import { MarkerType } from '@xyflow/system';

const {
  id,
  type,
  width = 12.5,
  height = 12.5,
  markerUnits = 'strokeWidth',
  orient = 'auto-start-reverse',
  strokeWidth = 1,
  color = 'none',
} = defineProps<MarkerProps>();
</script>

<script lang="ts">
export default {
  name: 'MarkerSymbols',
  compatConfig: { MODE: 3 },
};
</script>

<template>
  <marker
    :id="id"
    class="vue-flow__arrowhead"
    viewBox="-10 -10 20 20"
    refX="0"
    refY="0"
    :markerWidth="`${width}`"
    :markerHeight="`${height}`"
    :markerUnits="markerUnits"
    :orient="orient"
  >
    <polyline
      v-if="type === MarkerType.ArrowClosed"
      class="arrowclosed"
      :style="color ? { stroke: color, fill: color, strokeWidth } : { strokeWidth }"
      stroke-linecap="round"
      stroke-linejoin="round"
      points="-5,-4 0,0 -5,4 -5,-4"
    />

    <polyline
      v-if="type === MarkerType.Arrow"
      class="arrow"
      :style="color ? { stroke: color, strokeWidth } : { strokeWidth }"
      stroke-linecap="round"
      stroke-linejoin="round"
      fill="none"
      points="-5,-4 0,0 -5,4"
    />
  </marker>
</template>
