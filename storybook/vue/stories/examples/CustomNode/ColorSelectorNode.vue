<script lang="ts" setup>
import type { CSSProperties } from 'vue';
import type { ColorSelectorNodeProps } from './types';
import { Handle, Position } from '@xyflow/vue';

defineProps<ColorSelectorNodeProps>();

const emits = defineEmits<{
  change: [color: string];
}>();

const targetHandleStyle: CSSProperties = { background: '#555' };
const sourceHandleStyleA: CSSProperties = { ...targetHandleStyle, top: '10px' };
const sourceHandleStyleB: CSSProperties = { ...targetHandleStyle, bottom: '10px', top: 'auto' };
</script>

<script lang="ts">
export default {
  inheritAttrs: false,
};
</script>

<template>
  <Handle type="target" :position="Position.Left" :style="targetHandleStyle">
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" :width="10" :height="10">
      <circle cx="8" cy="8" r="7" fill="hotpink" />
    </svg>
  </Handle>

  <div>
    Custom Color Picker Node: <strong>{{ data.color }}</strong>
  </div>

  <input class="nodrag" type="color" :value="data.color" @input="emits('change', ($event.target as HTMLInputElement).value)">
  <Handle id="a" type="source" :position="Position.Right" :style="sourceHandleStyleA" />
  <Handle id="b" type="source" :position="Position.Right" :style="sourceHandleStyleB" />
</template>
