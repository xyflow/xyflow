<script lang="ts" setup>
import { Handle, NodeResizer, Position } from '@xyflow/vue';

defineProps(['label']);
</script>

<template>
  <NodeResizer :min-width="100" :min-height="30" :max-height="200" :max-width="200" keep-aspect-ratio />

  <Handle type="target" :position="Position.Left" />
  <div style="padding: 10px">
    {{ label }}
  </div>
  <Handle type="source" :position="Position.Right" />
</template>
