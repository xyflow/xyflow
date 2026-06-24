<script lang="ts" setup>
import type { Edge, EdgeProps } from '@xyflow/vue';
import { BezierEdge } from '@xyflow/vue';

defineProps<EdgeProps<Edge<{ text: string }>>>();
</script>

<script lang="ts">
export default {
  inheritAttrs: false,
};
</script>

<template>
  <BezierEdge
    :label="data.text"
    :source-x="sourceX"
    :source-y="sourceY"
    :target-x="targetX"
    :target-y="targetY"
    :source-position="sourcePosition"
    :target-position="targetPosition"
    :marker-end="markerEnd"
    :label-style="{ fill: 'white' }"
    :label-show-bg="true"
    :label-bg-style="{ fill: 'red' }"
    :label-bg-padding="[2, 4]"
    :label-bg-border-radius="2"
  />
</template>
