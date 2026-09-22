<script setup lang="ts">
import { Handle, Position, useNodeConnections, useNodesData } from '@xyflow/vue';
const connections = useNodeConnections({ handleType: 'target' });
const sources = useNodesData(() => connections.value.map((connection) => connection.source));
</script>
<template>
  <div style="background: #eee; color: #222; padding: 10px; font-size: 12px; border-radius: 10px">
    <Handle type="target" :position="Position.Left" />
    incoming texts:
    <div v-for="node in sources.filter((node) => node.type === 'text' || node.type === 'uppercase')" :key="node.id">
      {{ node.data.text }}
    </div>
  </div>
</template>
