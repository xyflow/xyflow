<script lang="ts" setup>
import type { ConnectionLineProps } from '@xyflow/vue';
import { BaseEdge, getStraightPath } from '@xyflow/vue';
import { computed } from 'vue';

const props = defineProps<ConnectionLineProps>();

const edgePath = computed(() =>
  getStraightPath({
    sourceX: props.fromX - (props.fromNode.measured?.width ?? 0) / 2,
    sourceY: props.fromY,
    targetX: props.toX,
    targetY: props.toY,
  }),
);
</script>

<template>
  <g>
    <BaseEdge
      :style="{
        strokeWidth: 3,
        stroke: 'black',
      }"
      :path="edgePath[0]"
    />
    <circle :cx="toX" :cy="toY" fill="black" :r="3" stroke="black" :stroke-width="1.5" />
  </g>
</template>
