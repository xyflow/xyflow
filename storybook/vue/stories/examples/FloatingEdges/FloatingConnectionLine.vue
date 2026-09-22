<script lang="ts" setup>
import type { InternalNode, Position } from '@xyflow/vue';
import { getBezierPath } from '@xyflow/vue';
import { getEdgeParams } from './floating-edge-utils';

interface FloatingConnectionLineProps {
  toX: number;
  toY: number;
  fromPosition: Position;
  toPosition: Position;
  fromNode: InternalNode;
}

const props = defineProps<FloatingConnectionLineProps>();

const targetNode = computed(() => {
  return {
    id: 'connection-target',
    internals: { positionAbsolute: { x: props.toX, y: props.toY }, z: 0 },
    measured: { width: 1, height: 1 },
  } as unknown as InternalNode;
});

const edgeParams = computed(() => getEdgeParams(props.fromNode, targetNode.value));

const edgePath = computed(() =>
  getBezierPath({
    sourceX: edgeParams.value.sx,
    sourceY: edgeParams.value.sy,
    sourcePosition: props.fromPosition,
    targetX: props.toX,
    targetY: props.toY,
    targetPosition: props.toPosition,
  }),
);
</script>

<template>
  <g>
    <path fill="none" stroke="#222" :stroke-width="1.5" class="animated" :d="edgePath[0]" />
    <circle :cx="toX" :cy="toY" fill="#fff" :r="3" stroke="#222" :stroke-width="1.5" />
  </g>
</template>
