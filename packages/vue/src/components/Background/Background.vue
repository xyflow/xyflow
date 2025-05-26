<script lang="ts" setup>
import type { BackgroundProps } from './types';
import { computed } from 'vue';
import { useVueFlow } from '../../composables/useVueFlow';
import { DefaultBgColors, DotPattern, LinePattern } from './patterns';

const props = withDefaults(defineProps<BackgroundProps>(), {
  variant: 'dots',
  gap: 20,
  size: 1,
  lineWidth: 1,
  x: 0,
  y: 0,
  offset: 0,
});

const { id: vueFlowId, viewport } = useVueFlow();

const background = computed(() => {
  const { gap, offset, size } = props;

  const zoom = viewport.value.zoom;
  const [gapX, gapY] = Array.isArray(gap) ? gap : [gap, gap];
  const scaledGap: [number, number] = [gapX * zoom || 1, gapY * zoom || 1];
  const scaledSize = size * zoom;
  const [offsetX, offsetY]: [number, number] = Array.isArray(offset) ? offset : [offset, offset];

  const scaledOffset: [number, number] = [offsetX * zoom || 1 + scaledGap[0] / 2, offsetY * zoom || 1 + scaledGap[1] / 2];

  return {
    scaledGap,
    offset: scaledOffset,
    size: scaledSize,
  };
});

// when there are multiple flows on a page we need to make sure that every background gets its own pattern.
const patternId = computed(() => `pattern-${vueFlowId}${props.id ? `-${props.id}` : ''}`);

const patternColor = computed(() => props.color || DefaultBgColors[props.variant || 'dots']);
</script>

<script lang="ts">
export default {
  name: 'Background',
  compatConfig: { MODE: 3 },
};
</script>

<template>
  <svg class="vue-flow__background vue-flow__container">
    <slot :id="patternId" name="pattern-container">
      <pattern
        :id="patternId"
        :x="viewport.x % background.scaledGap[0]"
        :y="viewport.y % background.scaledGap[1]"
        :width="background.scaledGap[0]"
        :height="background.scaledGap[1]"
        :patternTransform="`translate(-${background.offset[0]},-${background.offset[1]})`"
        patternUnits="userSpaceOnUse"
      >
        <slot name="pattern">
          <template v-if="variant === 'lines'">
            <LinePattern :size="lineWidth" :color="patternColor" :dimensions="background.scaledGap" />
          </template>

          <template v-else-if="variant === 'dots'">
            <DotPattern :color="patternColor" :radius="background.size / 2" />
          </template>
        </slot>
      </pattern>
    </slot>

    <rect :x="x" :y="y" width="100%" height="100%" :fill="`url(#${patternId})`" />

    <slot :id="patternId" />
  </svg>
</template>
