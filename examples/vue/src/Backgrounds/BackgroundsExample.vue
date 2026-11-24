<script lang="ts" setup>
import Flow from './Flow.vue';
</script>

<template>
  <div class="vue-flow__example-backgrounds">
    <Flow id="flow-a" :bg-props="[{ variant: 'dots' }]" />

    <Flow id="flow-b" :bg-props="[{ variant: 'lines', gap: [50, 50] }]" />

    <Flow id="flow-c" :bg-props="[{ variant: 'cross', gap: [100, 50] }]" />

    <Flow
      id="flow-d"
      :bg-props="[
        { variant: 'lines', gap: 10 },
        { variant: 'lines', gap: 100, offset: 2, color: '#ccc' },
      ]"
    />
  </div>
</template>

<style>
@import 'backgrounds.css';
</style>
