<script lang="ts" setup>
import type { Edge, EdgeProps } from '@xyflow/vue';
import type { Colors } from './utils';
import { getBezierPath } from '@xyflow/vue';
import { computed } from 'vue';

interface EdgeData extends Record<string, unknown> {
  // the RGB channel value rendered as the edge label (e.g. 128) — a number, not a string
  text?: number;
  color?: Colors;
}

type RGBEdge = Edge<EdgeData, 'rgb-edge'>;

const props = defineProps<EdgeProps<RGBEdge>>();

const edgePath = computed(() => getBezierPath(props));
</script>

<script lang="ts">
export default {
  inheritAttrs: false,
};
</script>

<template>
  <path
    :id="id"
    class="vue-flow__edge-path"
    :style="{ stroke: data?.color, strokeWidth: '3' }"
    :d="edgePath[0]"
    :marker-end="markerEnd"
  />

  <text>
    <textPath :href="`#${id}`" :style="{ fontSize: '1.25rem', fill: 'black' }" startOffset="50%" text-anchor="middle">
      {{ data?.text }}
    </textPath>
  </text>
</template>
