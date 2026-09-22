<script setup lang="ts">
import { watch } from 'vue';
import { Handle, Position, useVueFlow, useNodesData, useNodeConnections, type NodeProps } from '@xyflow/vue';
const props = defineProps<NodeProps>();
const { updateNodeData } = useVueFlow();
const connections = useNodeConnections({ handleType: 'target' });
const source = useNodesData(() => connections.value[0]?.source);
watch(
  source,
  (node) =>
    updateNodeData(props.id, { text: node?.type === 'text' ? String(node.data.text).toUpperCase() : undefined }),
  { immediate: true }
);
</script>
<template>
  <div style="background: #eee; color: #222; padding: 10px; font-size: 12px; border-radius: 10px">
    <Handle type="target" :position="Position.Left" :is-connectable="connections.length === 0" />
    uppercase transform
    <Handle type="source" :position="Position.Right" />
  </div>
</template>
