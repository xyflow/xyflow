<script lang="ts" setup>
import { computed } from 'vue';
import { storeToRefs, useStore, useVueFlow } from '../../composables';
import ZoomPaneSlot from './ZoomPaneSlot';

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
  <div class="vue-flow__viewport vue-flow__container" :style="{ transform, opacity: isHidden ? 0 : undefined }">
    <slot />

    <!-- the `zoom-pane` slot belongs in this transformed layer; pulled from the provided `Slots` as a
    propless child so it bails out of this component's per-frame (transform) re-renders -->
    <ZoomPaneSlot />
  </div>
</template>
