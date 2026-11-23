<script lang="ts" setup>
import { Handle, NodeResizeControl, Position, ResizeControlVariant } from '@xyflow/vue';

defineProps(['label']);
</script>

<template>
  <NodeResizeControl
    :variant="ResizeControlVariant.Handle"
    position="bottom-right"
    resize-direction="horizontal"
    :min-width="100"
    :max-width="500"
    color="orange"
    :auto-scale="false"
  />

  <Handle type="target" :position="Position.Left" />
  <div style="padding: 10px">
    {{ label }}
  </div>
  <Handle type="source" :position="Position.Right" />
</template>
