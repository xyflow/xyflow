<script lang="ts" setup>
defineProps<{
  disabled?: boolean;
  label?: string;
}>();

defineEmits<{
  click: [payload: MouseEvent];
}>();
</script>

<script lang="ts">
export default {
  name: 'ControlButton',
  compatConfig: { MODE: 3 },
};
</script>

<template>
  <button
    type="button"
    class="vue-flow__controls-button"
    :disabled="disabled"
    :aria-label="label"
    :title="label"
    @click="$emit('click', $event)"
  >
    <slot />
  </button>
</template>
