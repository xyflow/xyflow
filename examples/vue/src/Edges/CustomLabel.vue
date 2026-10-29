<script lang="ts" setup>
interface CustomLabelProps {
  label: string;
}

defineProps<CustomLabelProps>();
</script>

<template>
  <tspan dy="10" x="0">
    {{ label }}
  </tspan>
</template>
