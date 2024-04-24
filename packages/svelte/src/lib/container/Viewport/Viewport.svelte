<script lang="ts">
  import type { Snippet } from 'svelte';
  import { useStore } from '$lib/store';

  let { children }: { children: Snippet } = $props();

  const { viewport } = useStore();
  console.log(viewport);
</script>

<div
  class="svelte-flow__viewport xyflow__viewport"
  style="transform: translate({$viewport.x}px, {$viewport.y}px) scale({$viewport.zoom})"
>
  {@render children()}
</div>

<style>
  .svelte-flow__viewport {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
  }
</style>
