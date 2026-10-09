<script lang="ts" setup>
import type { BackgroundProps, BackgroundVariant } from './types';
import { computed } from 'vue';
import { useVueFlow } from '../../composables/useVueFlow';
import { DotPattern, LinePattern } from './patterns';

const props = withDefaults(defineProps<BackgroundProps>(), {
  variant: 'dots',
  gap: 20,
  lineWidth: 1,
  x: 0,
  y: 0,
  offset: 0,
});

const { id: vueFlowId, viewport } = useVueFlow();

const defaultSize: Record<BackgroundVariant, number> = {
  dots: 1,
  lines: 1,
  cross: 6,
};

const background = computed(() => {
  const { gap, offset, size, variant } = props;

  const zoom = viewport.value.zoom;
  const patternSize = size || defaultSize[variant];
  const [gapX, gapY] = Array.isArray(gap) ? gap : [gap, gap];
  const scaledGap: [number, number] = [gapX * zoom || 1, gapY * zoom || 1];
  const scaledSize = patternSize * zoom;
  const [offsetX, offsetY]: [number, number] = Array.isArray(offset) ? offset : [offset, offset];
  const dimensions: [number, number] = variant === 'cross' ? [scaledSize, scaledSize] : scaledGap;
  const scaledOffset: [number, number] = [offsetX * zoom + dimensions[0] / 2, offsetY * zoom + dimensions[1] / 2];

  return {
    scaledGap,
    dimensions,
    offset: scaledOffset,
    size: scaledSize,
  };
});

// when there are multiple flows on a page we need to make sure that every background gets its own pattern.
const patternId = computed(() => `pattern-${vueFlowId}${props.id ? `-${props.id}` : ''}`);
</script>

<script lang="ts">
export default {
  name: 'Background',
  compatConfig: { MODE: 3 },
};
</script>

<template>
  <svg
    :style="{
      '--xy-background-color-props': bgColor,
      '--xy-background-pattern-color-props': color,
    }"
    class="vue-flow__background vue-flow__container"
  >
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
          <DotPattern v-if="variant === 'dots'" :radius="background.size / 2" :pattern-class-name="patternClassName" />

          <LinePattern
            v-else
            :dimensions="background.dimensions"
            :line-width="lineWidth"
            :variant="variant"
            :pattern-class-name="patternClassName"
          />
        </slot>
      </pattern>
    </slot>

    <rect :x="x" :y="y" width="100%" height="100%" :fill="`url(#${patternId})`" />

    <slot :id="patternId" />
  </svg>
</template>
