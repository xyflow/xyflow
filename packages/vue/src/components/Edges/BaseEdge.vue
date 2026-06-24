<script lang="ts" setup>
import type { BaseEdgeProps } from '../../types';
import { shallowRef, useAttrs } from 'vue';
import EdgeText from './EdgeText.vue';

withDefaults(defineProps<BaseEdgeProps>(), { interactionWidth: 20 });

const pathEl = shallowRef<SVGPathElement | null>(null);

const interactionEl = shallowRef<SVGPathElement | null>(null);

const labelEl = shallowRef<SVGGElement | null>(null);

const attrs = useAttrs();

defineExpose({
  pathEl,
  interactionEl,
  labelEl,
});
</script>

<script lang="ts">
export default {
  name: 'BaseEdge',
  inheritAttrs: false,
  compatConfig: { MODE: 3 },
};
</script>

<template>
  <path
    v-bind="attrs"
    :id="id"
    ref="pathEl"
    :d="path"
    class="vue-flow__edge-path"
    :marker-end="markerEnd"
    :marker-start="markerStart"
  />

  <path
    v-if="interactionWidth"
    ref="interactionEl"
    fill="none"
    :d="path"
    :stroke-width="interactionWidth"
    :stroke-opacity="0"
    class="vue-flow__edge-interaction"
  />

  <EdgeText
    v-if="label && labelX && labelY"
    ref="labelEl"
    :x="labelX"
    :y="labelY"
    :label="label"
    :label-show-bg="labelShowBg"
    :label-bg-style="labelBgStyle"
    :label-bg-padding="labelBgPadding"
    :label-bg-border-radius="labelBgBorderRadius"
    :label-style="labelStyle"
  />
</template>
