<script lang="ts" setup>
import { computed } from 'vue';
import { storeToRefs, useStore, useVueFlow } from '../../composables';

const { viewport } = useVueFlow();

const { fitViewOnInit, fitViewOnInitDone } = storeToRefs(useStore());

const isHidden = computed(() => {
  if (fitViewOnInit.value) {
    return !fitViewOnInitDone.value;
  }

  return false;
});

const transform = computed(() => `translate(${viewport.value.x}px,${viewport.value.y}px) scale(${viewport.value.zoom})`);
</script>

<script lang="ts">
export default {
  name: 'Viewport',
  compatConfig: { MODE: 3 },
};
</script>

<template>
  <div class="vue-flow__renderer vue-flow__container" :style="{ transform, opacity: isHidden ? 0 : undefined }">
    <slot />
  </div>
</template>
