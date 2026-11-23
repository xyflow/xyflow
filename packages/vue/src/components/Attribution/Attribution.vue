<script lang="ts" setup>
import type { PanelPosition } from '@xyflow/system';
import type { ProOptions } from 'src/types/pro';
import { handleAttributionWarning } from '@xyflow/system';
import { onMounted } from 'vue';
import { isDev } from '../../utils/log';
import Panel from '../Panel/Panel.vue';

const { proOptions = undefined, position = 'bottom-right' } = defineProps<{
  proOptions?: ProOptions;
  position?: PanelPosition;
}>();

const link = `https://vueflow.dev${isDev() ? '/attribution' : '?utm_source=attribution'}`;

onMounted(() => {
  if (isDev()) {
    handleAttributionWarning('vue');
  }
});
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
    v-bind="{ 'data-message': `Please only hide this attribution when you are subscribed to Vue Flow Pro: ${link}` }"
  >
    <a :href="link" target="_blank" rel="noopener noreferrer" aria-label="Vue Flow attribution"> Vue Flow </a>
  </Panel>
</template>
