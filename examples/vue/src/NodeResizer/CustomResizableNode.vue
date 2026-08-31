<script lang="ts" setup>
import { Handle, NodeResizer, Position } from '@xyflow/vue';

defineProps(['label']);
</script>

<template>
  <NodeResizer color="#2563eb" :handle-style="{ width: '10px', height: '10px', borderRadius: '50%' }" :min-width="100" :min-height="30" />

  <Handle type="target" :position="Position.Left" />
  <div style="padding: 10px">
    {{ label }}
  </div>
  <Handle type="source" :position="Position.Right" />
</template>
