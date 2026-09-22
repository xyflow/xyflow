<script setup lang="ts">
import { Handle, Position, type NodeProps } from '@xyflow/vue';
defineProps<NodeProps>();
</script>
<template>
  <div class="detached-node">
    {{ data.label }}
    <Handle type="target" :position="Position.Left" />
    <Handle type="source" :position="Position.Right"><button class="detached-handle">➡️</button></Handle>
  </div>
</template>
<style scoped>
.detached-node {
  background: white;
  padding: 10px;
  border: 1px solid #777;
  border-radius: 20px;
}
.detached-handle {
  position: absolute;
  top: 50%;
  left: 1rem;
  transform: translateY(-50%);
  width: 2rem;
  height: 2rem;
  border: none;
  border-radius: 50%;
}
</style>
