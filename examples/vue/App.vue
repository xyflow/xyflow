<script lang="ts" setup>
import { VueFlowProvider } from '@xyflow/vue';
import Header from './Header.vue';
</script>

<template>
  <Header />
  <VueFlowProvider>
    <router-view />
  </VueFlowProvider>
</template>
