<script lang="ts" setup>
import type { EdgeProps } from '@xyflow/vue';
import { EdgeLabelRenderer, getBezierPath, useVueFlow } from '@xyflow/vue';

const props = defineProps<EdgeProps>();

const { removeEdges } = useVueFlow();

const path = computed(() => getBezierPath(props));
</script>

<script lang="ts">
export default {
  inheritAttrs: false,
};
</script>

<template>
  <path :id="id" :style="style" class="vue-flow__edge-path" :d="path[0]" :marker-end="markerEnd" />

  <EdgeLabelRenderer>
    <div
      :style="{
        pointerEvents: 'all',
        position: 'absolute',
        transform: `translate(-50%, -50%) translate(${path[1]}px,${path[2]}px)`,
      }"
      class="nodrag nopan"
    >
      <button class="edgebutton" @click="removeEdges(id)">
        ×
      </button>
    </div>
  </EdgeLabelRenderer>
</template>

<style>
.edgebutton {
  border-radius: 999px;
  cursor: pointer;
}
.edgebutton:hover {
  box-shadow: 0 0 0 2px pink, 0 0 0 4px #f05f75;
}
</style>
