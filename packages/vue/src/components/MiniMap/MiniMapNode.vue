<script setup lang="ts">
import type { MiniMapNodeEmits, MiniMapNodeProps } from './types';
import { inject, useAttrs } from 'vue';
import { Slots } from './types';

const props = defineProps<MiniMapNodeProps>();

const emits = defineEmits<MiniMapNodeEmits>();

const miniMapSlots = inject(Slots, {});

const attrs = useAttrs() as Record<string, any>;
</script>

<script lang="ts">
export default {
  name: 'MiniMapNode',
  compatConfig: { MODE: 3 },
  inheritAttrs: false,
};
</script>

<template>
  <template v-if="!hidden && dimensions.width !== 0 && dimensions.height !== 0">
    <component
      :is="miniMapSlots[`node-${props.type}`]"
      v-if="miniMapSlots[`node-${props.type}`]"
      v-bind="{ ...props, ...attrs }"
    />

    <rect
      v-else
      :id="id"
      v-bind="attrs"
      class="vue-flow__minimap-node"
      :class="{ selected, dragging }"
      :x="position.x"
      :y="position.y"
      :rx="borderRadius"
      :ry="borderRadius"
      :width="dimensions.width"
      :height="dimensions.height"
      :fill="color || (attrs.style?.background as string) || attrs.style?.backgroundColor"
      :stroke="strokeColor"
      :stroke-width="strokeWidth"
      :shape-rendering="shapeRendering"
      @click="emits('click', $event)"
      @dblclick="emits('dblclick', $event)"
      @mouseenter="emits('mouseenter', $event)"
      @mousemove="emits('mousemove', $event)"
      @mouseleave="emits('mouseleave', $event)"
    />
  </template>
</template>
