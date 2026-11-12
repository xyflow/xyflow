<script lang="ts" setup>
interface CustomConnectionLineProps {
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
}

const props = defineProps<CustomConnectionLineProps>();
</script>

<template>
  <g>
    <path
      class="animated"
      fill="none"
      stroke="#222"
      :stroke-width="1.5"
      :d="`M${props.sourceX},${props.sourceY} C ${props.sourceX} ${props.targetY} ${props.sourceX} ${props.targetY} ${props.targetX},${props.targetY}`"
    />
    <circle :cx="props.targetX" :cy="props.targetY" fill="#fff" :r="3" stroke="#222" :stroke-width="1.5" />
  </g>
</template>
