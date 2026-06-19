<script lang="ts" setup>
import type { Node, NodeProps } from '@xyflow/vue';
import type { Colors } from './utils';
import { Handle, Position } from '@xyflow/vue';

type RGBNode = Node<{ color: Colors }, 'rgb'>;

interface RGBNodeProps extends Pick<NodeProps<RGBNode>, 'data'> {
  amount: Record<Colors, number>;
}

const props = defineProps<RGBNodeProps>();

const emit = defineEmits<{ (event: 'change', data: { color: Colors; val: number }): void }>();

const currentColor = toRef(props.data, 'color', 'red');

function onChange(e: InputEvent) {
  return emit('change', { color: currentColor.value, val: Number.parseInt((e.target as HTMLInputElement).value) });
}
</script>

<template>
  <div class="wrapper">
    <div class="text-md" :style="{ color: currentColor }">
      {{ `${currentColor}`.toUpperCase() }}
    </div>

    <input
      :value="amount[currentColor]"
      class="slider nodrag"
      :style="{ '--color': currentColor }"
      type="range"
      min="0"
      max="255"
      @input="onChange"
    >

    <Handle type="source" :position="Position.Right" :style="{ backgroundColor: currentColor }" />
  </div>
</template>

<style>
.wrapper {
  padding: 16px;
  background: #fff;
  border-radius: 10px;
  border: 2px solid black;
  text-align: left;
}

.slider {
  --color: red;
  margin-top: 12px;
  background: gainsboro;
  width: 100%;
  height: 10px;
  outline: none;
  border-radius: 999px;
  -webkit-appearance: none;
  appearance: none;

  &::-moz-range-thumb,
  &::-webkit-slider-thumb {
    @apply w-[15px] h-[15px] cursor-pointer border-1 border-solid border-white rounded-full;
    -webkit-appearance: none;
    background: var(--color);
  }
}
</style>
