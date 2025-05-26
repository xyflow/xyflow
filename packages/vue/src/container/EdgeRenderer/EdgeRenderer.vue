<script lang="ts" setup>
import ConnectionLine from '../../components/ConnectionLine';
import EdgeWrapper from '../../components/Edges/EdgeWrapper';
import { useVueFlow } from '../../composables';
import MarkerDefinitions from './MarkerDefinitions.vue';

const { getEdges } = useVueFlow();
</script>

<script lang="ts">
export default {
  name: 'Edges',
  compatConfig: { MODE: 3 },
};
</script>

<template>
  <MarkerDefinitions />

  <!-- the per-edge svg wrapper (and its node-lookup-tracking zIndex) lives in EdgeWrapper, so this
  v-for only re-renders on edge membership changes, not on every node replacement -->
  <EdgeWrapper v-for="edge of getEdges" :id="edge.id" :key="edge.id" />

  <ConnectionLine />
</template>
