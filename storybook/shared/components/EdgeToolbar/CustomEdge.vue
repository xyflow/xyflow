<script setup lang="ts">
import { computed } from 'vue';
import {
  BaseEdge,
  EdgeToolbar,
  getBezierPath,
  getStraightPath,
  getSmoothStepPath,
  useVueFlow,
  type Edge,
  type EdgeProps,
} from '@xyflow/vue';
const props =
  defineProps<EdgeProps<Edge<{ type?: string; align?: ['left' | 'center' | 'right', 'top' | 'center' | 'bottom'] }>>>();
const { removeEdges } = useVueFlow();
const path = computed(() =>
  (props.data?.type === 'straight'
    ? getStraightPath
    : props.data?.type === 'smoothstep'
      ? getSmoothStepPath
      : getBezierPath)(props)
);
</script>
<template>
  <BaseEdge :id="props.id" :path="path[0]" />
  <EdgeToolbar
    :edge-id="props.id"
    :x="path[1]"
    :y="path[2]"
    :align-x="props.data?.align?.[0] ?? 'center'"
    :align-y="props.data?.align?.[1] ?? 'center'"
    is-visible
  >
    <button @click="removeEdges([props.id])">Delete</button>
  </EdgeToolbar>
</template>
