<script lang="ts">
  import { get } from 'svelte/store';
  import type { Viewport } from '@reactflow/system';
  
  import { useStore } from '$lib/store';
  import zoom from '$lib/actions/zoom';

  export let initialViewport: Viewport = { x: 0, y: 0, zoom: 1 };

  const { transform, d3, selectionKeyPressed, selectionRectMode, minZoom, maxZoom } = useStore();

  $: selecting = $selectionKeyPressed || $selectionRectMode === 'user';
</script>

<div class="svelte-flow__zoom" use:zoom={{ transform, d3, selecting, minZoom: get(minZoom), maxZoom: get(maxZoom), initialViewport }}>
  <slot />
</div>

<style>
  .svelte-flow__zoom {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 4;
  }
</style>
