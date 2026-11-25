<script setup lang="ts">
import type { NodeProps } from '@xyflow/vue';
import { useVueFlow } from '@xyflow/vue';
import { ref } from 'vue';

// declare the node props so they don't fall through to the DOM (a stray `draggable` attr would trigger native drag)
defineProps<NodeProps>();

// long enough for a test to interrupt the transition halfway
const duration = 5000;

const { fitView, setCenter, setViewport, zoomTo, zoomIn } = useVueFlow();

const status = ref('idle');

async function track(name: string, transition: () => Promise<boolean>) {
  status.value = `${name}: pending`;
  const ended = await transition();
  status.value = `${name}: ${ended ? 'ended' : 'interrupted'}`;
}

function setCenterThenSetViewport() {
  const transition = setCenter(800, 600, { zoom: 2, duration });
  setViewport({ x: 0, y: 0, zoom: 1 });
  return transition;
}

function fitViewTwice() {
  const transition = fitView({ nodes: [{ id: 'target' }], duration });
  setTimeout(() => fitView({ nodes: [{ id: 'transitions' }], duration: 2000 }), 500);
  return transition;
}
</script>

<template>
  <div class="container">
    <button class="nodrag" @click="track('fit view', () => fitView({ nodes: [{ id: 'target' }], duration }))">
      fit view
    </button>
    <button class="nodrag" @click="track('set center', () => setCenter(800, 600, { zoom: 2, duration }))">
      set center
    </button>
    <button class="nodrag" @click="track('zoom to', () => zoomTo(2, { duration }))">
      zoom to
    </button>
    <button class="nodrag" @click="track('zoom in', () => zoomIn({ duration }))">
      zoom in
    </button>
    <button class="nodrag" @click="track('set center briefly', () => setCenter(800, 600, { zoom: 2, duration: 200 }))">
      set center briefly
    </button>
    <button class="nodrag" @click="track('set center then set viewport', setCenterThenSetViewport)">
      set center then set viewport
    </button>
    <button class="nodrag" @click="track('fit view twice', fitViewTwice)">
      fit view twice
    </button>
    <div role="status">{{ status }}</div>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 8px;
  background: white;
}
</style>
