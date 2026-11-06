<script lang="ts" setup>
import type { EdgeProps } from '@xyflow/vue';
import { BaseEdge, getBezierPath, useVueFlow } from '@xyflow/vue';
import { getEdgeParams } from './floating-edge-utils';

const props = defineProps<EdgeProps>();

const { getInternalNode } = useVueFlow();

const edgeParams = computed(() => {
  const sourceNode = getInternalNode(props.source);
  const targetNode = getInternalNode(props.target);

  if (!sourceNode || !targetNode) {
    return null;
  }

  return getEdgeParams(sourceNode, targetNode);
});

const edgePath = computed(
  () =>
    (edgeParams.value?.sx
      && getBezierPath({
        sourceX: edgeParams.value.sx,
        sourceY: edgeParams.value.sy,
        targetX: edgeParams.value.tx,
        targetY: edgeParams.value.ty,
        sourcePosition: edgeParams.value.sourcePos,
        targetPosition: edgeParams.value.targetPos,
      }))
      // fall back to an array so `edgePath[0]` is always a string — before the nodes are measured
      // `sx` is undefined and a bare `''` fallback made `edgePath[0]` undefined (BaseEdge `path` warning)
      || [''],
);
</script>

<template>
  <BaseEdge :id="id" :path="edgePath[0]" :marker-start="markerStart" :marker-end="markerEnd" :style="style" />
</template>
