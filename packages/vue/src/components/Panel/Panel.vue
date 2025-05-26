<script lang="ts" setup>
import type { PanelProps } from '../../types/panel';
import { computed } from 'vue';
import { storeToRefs, useStore } from '../../composables';

const props = defineProps<PanelProps>();

const { userSelectionActive } = storeToRefs(useStore());

const positionClasses = computed(() => `${props.position}`.split('-'));
</script>

<script lang="ts">
export default {
  name: 'Panel',
  compatConfig: { MODE: 3 },
};
</script>

<template>
  <div
    class="vue-flow__panel"
    :class="positionClasses"
    :aria-label="label ?? undefined"
    :style="{ pointerEvents: userSelectionActive ? 'none' : 'all' }"
  >
    <slot />
  </div>
</template>
