<script lang="ts">
  import { useStore } from '$lib/store';
  import { onMount } from 'svelte';

  const { width, height } = useStore();

  // TODO: put canvas element into store
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
