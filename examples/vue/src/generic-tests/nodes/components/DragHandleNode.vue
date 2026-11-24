<script setup lang="ts">
import type { NodeProps } from '@xyflow/vue';

// declare the node props so they don't fall through to the DOM (a stray `draggable` attr would trigger native drag)
defineProps<NodeProps>();
</script>

<template>
  <div
    class="container"
    :style="{
      width: '100px',
      height: '50px',
      background: 'red',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }"
  >
    <div
      class="drag-handle custom-drag-handle"
      :style="{
        display: 'inline-block',
        width: '25px',
        height: '25px',
        backgroundColor: 'green',
      }"
    />
  </div>
</template>
