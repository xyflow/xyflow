<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import Flow from './Flow.vue';

const flowConfigs = import.meta.glob<FlowConfig>('./**/*.ts', { eager: true, import: 'default' });

const route = useRoute();

const flowConfig = computed(() => {
  const path = `.${route.path.replace('/tests/generic', '')}.ts`;
  return flowConfigs[path];
});
</script>

<template>
  <Flow v-if="flowConfig" :key="route.path" :flow-config="flowConfig" />
  <div v-else>
    404: This route doesn't exist.
  </div>
</template>
