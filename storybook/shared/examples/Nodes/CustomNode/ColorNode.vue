<script setup lang="ts">
import { Handle, Position, useVueFlow, type Node, type NodeProps } from '@xyflow/vue';
defineProps<NodeProps<Node<{ color: string }>>>();
const { updateNodeData } = useVueFlow();
</script>
<template>
  <div style="background: white; color: #222; padding: 12px; border: 1px solid #777; border-radius: 8px">
    <Handle type="target" :position="Position.Top" />
    <label
      >Node color
      <input
        aria-label="Node color"
        class="nodrag nokey"
        type="color"
        :value="data.color"
        @input="(event) => updateNodeData(id, { color: (event.target as HTMLInputElement).value })"
    /></label>
    <Handle type="source" :position="Position.Bottom" />
  </div>
</template>
