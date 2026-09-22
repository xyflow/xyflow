<script setup lang="ts">
import { Handle, Position, type NodeProps } from '@xyflow/vue';
defineProps<NodeProps>();
</script>
<template>
  <div
    style="
      width: 150px;
      padding: 10px;
      border: 1px solid #ddd;
      border-radius: 5px;
      background: #eee;
      color: #555;
      text-align: center;
    "
  >
    <Handle v-if="type !== 'custominput'" type="target" :position="Position.Top" :is-connectable-start="false" />
    {{ type === 'custominput' ? 'Only connectable with B' : id }}
    <Handle type="source" :position="Position.Right" />
  </div>
</template>
