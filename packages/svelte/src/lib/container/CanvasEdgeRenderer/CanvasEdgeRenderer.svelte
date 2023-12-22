<script lang="ts">
  import { useStore } from '$lib/store';
  import { onMount } from 'svelte';

  const { viewport, visibleEdges, width, height } = useStore();
  let canvas: HTMLCanvasElement;
  let dpr = 1;
  onMount(() => {
    dpr = window.devicePixelRatio ?? 1;
  });
</script>

<canvas
  bind:this={canvas}
  width={$width * dpr}
  height={$height * dpr}
  class="svelte-flow__edge-canvas"
/>
