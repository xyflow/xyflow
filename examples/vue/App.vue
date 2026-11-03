<script lang="ts" setup>
import { useRoute } from 'vue-router';
import Header from './Header.vue';

const route = useRoute();
</script>

<template>
  <Header v-if="!route.meta.blank" />
  <router-view />
</template>
