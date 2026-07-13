<script lang="ts" setup>
import type { PanelPosition, ProOptions } from '@xyflow/system';
import Panel from '../Panel/Panel.vue';

const { proOptions = undefined, position = 'bottom-right' } = defineProps<{
  proOptions?: ProOptions;
  position?: PanelPosition;
}>();

const link = `https://vueflow.dev${process.env.NODE_ENV === 'production' ? '?utm_source=attribution' : '/attribution'}`;
</script>

<script lang="ts">
export default {
  name: 'Attribution',
  compatConfig: { MODE: 3 },
};
</script>

<template>
  <Panel
    v-if="!proOptions?.hideAttribution"
    :position="position"
    class="vue-flow__attribution"
    :data-message="`Please only hide this attribution when you are subscribed to Vue Flow Pro: ${link}`"
  >
    <a :href="link" target="_blank" rel="noopener noreferrer" aria-label="Vue Flow attribution">
      Vue Flow
    </a>
  </Panel>
</template>
