<script lang="ts">
  import { useStore } from '$lib/store';
  import type { Snippet } from 'svelte';

  const { viewport } = useStore();

  let { children }: { children: Snippet } = $props();
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
