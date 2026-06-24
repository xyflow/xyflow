<script lang="ts" setup>
import type { Rect as RectType } from '@xyflow/system';
import type { EdgeTextProps } from '../../types/components';
import { computed, onMounted, shallowRef, watch } from 'vue';

const {
  x,
  y,
  label,
  labelStyle = {},
  labelShowBg = true,
  labelBgStyle = {},
  labelBgPadding = [2, 4],
  labelBgBorderRadius = 2,
} = defineProps<EdgeTextProps>();

const box = shallowRef<RectType>({ x: 0, y: 0, width: 0, height: 0 });

const el = shallowRef<SVGTextElement | null>(null);

const transform = computed(() => `translate(${x - box.value.width / 2} ${y - box.value.height / 2})`);

onMounted(() => {
  getBox();

  // The first measurement can run before the theme stylesheet (`font-size`) and web font are applied,
  // sizing the box for the wrong (default 16px) font. Since we deliberately don't re-measure on x/y
  // changes (that would force a reflow every drag frame — see the watch below), it would never self-
  // correct. Re-measure once after a frame and once fonts settle so the box snaps to the real text size.
  requestAnimationFrame(getBox);
  document.fonts?.ready?.then(getBox);
});

// the text's bounding box depends on its content/font, NOT its x/y position — re-measuring (getBBox forces
// a reflow) on every move would thrash layout each drag frame for no change, so only watch el + label
watch([el, () => label], getBox);

function getBox() {
  if (!el.value) {
    return;
  }

  const nextBox = el.value.getBBox();

  if (nextBox.width !== box.value.width || nextBox.height !== box.value.height) {
    box.value = nextBox;
  }
}
</script>

<script lang="ts">
export default {
  name: 'EdgeText',
  compatConfig: { MODE: 3 },
};
</script>

<template>
  <g :transform="transform" :visibility="box.width ? 'visible' : 'hidden'" class="vue-flow__edge-textwrapper">
    <rect
      v-if="labelShowBg"
      class="vue-flow__edge-textbg"
      :width="`${box.width + 2 * labelBgPadding[0]}px`"
      :height="`${box.height + 2 * labelBgPadding[1]}px`"
      :x="-labelBgPadding[0]"
      :y="-labelBgPadding[1]"
      :style="labelBgStyle"
      :rx="labelBgBorderRadius"
      :ry="labelBgBorderRadius"
    />

    <text v-bind="$attrs" ref="el" class="vue-flow__edge-text" :y="box.height / 2" dy="0.3em" :style="labelStyle">
      <slot>
        <component :is="label" v-if="typeof label !== 'string'" />
        <template v-else>
          {{ label }}
        </template>
      </slot>
    </text>
  </g>
</template>
