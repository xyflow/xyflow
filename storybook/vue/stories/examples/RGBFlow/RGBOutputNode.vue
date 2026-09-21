<script lang="ts" setup>
import { Handle, Position } from '@xyflow/vue';

interface RBGOutputNodeProps {
  rgb: string;
}

const props = defineProps<RBGOutputNodeProps>();
</script>

<template>
  <div :style="{ backgroundColor: props.rgb }" class="rgb-output-node">
    <div class="text-md uppercase">
      {{ props.rgb }}
    </div>
    <Handle type="target" :position="Position.Left" />
  </div>
</template>

<style>
.rgb-output-node {
  padding: 9px;
  border-radius: 25px;
  text-align: left;
  color: white;
}
</style>
