<script lang="ts" setup>
defineProps<{
  name: '+' | '-' | '*' | '/';
}>();
</script>

<template>
  <svg v-if="name === '+'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <path fill="currentColor" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6z" />
  </svg>

  <svg v-else-if="name === '-'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <path fill="currentColor" d="M19 13H5v-2h14v2z" />
  </svg>

  <svg v-else-if="name === '*'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <path
      fill="none"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      d="M12 12L6 6m6 6l6 6m-6-6l6-6m-6 6l-6 6"
    />
  </svg>

  <svg v-else-if="name === '/'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <path
      fill="currentColor"
      d="M19 13H5v-2h14zm-7-8a2 2 0 0 1 2 2a2 2 0 0 1-2 2a2 2 0 0 1-2-2a2 2 0 0 1 2-2m0 10a2 2 0 0 1 2 2a2 2 0 0 1-2 2a2 2 0 0 1-2-2a2 2 0 0 1 2-2"
    />
  </svg>
</template>
