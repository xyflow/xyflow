<script lang="ts" setup>
import type { EdgeProps } from '@xyflow/vue';
import { BaseEdge, getStraightPath, useVueFlow } from '@xyflow/vue';
import { computed } from 'vue';

import { getEdgeParams } from './utils';

const props = defineProps<EdgeProps>();

const { getInternalNode } = useVueFlow();

const edgePath = computed(() => {
  const sourceNode = getInternalNode(props.source);
  const targetNode = getInternalNode(props.target);

  if (!sourceNode || !targetNode) {
    return null;
  }

  const { sx, sy, tx, ty } = getEdgeParams(sourceNode, targetNode);

  return getStraightPath({
    sourceX: sx,
    sourceY: sy,
    targetX: tx,
    targetY: ty,
  });
});
</script>

<template>
  <BaseEdge v-if="edgePath" :id="id" :path="edgePath[0]" :marker-end="markerEnd" :style="style" />
</template>
