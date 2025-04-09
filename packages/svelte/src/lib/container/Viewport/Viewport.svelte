<script lang="ts">
  import type { SvelteFlowStore } from '$lib/store/types';
  import type { Snippet } from 'svelte';

  let { store, children }: { store: SvelteFlowStore; children: Snippet } = $props();

  let { x, y, zoom } = $derived(store._viewport);
</script>

<div
  class="svelte-flow__viewport xyflow__viewport"
  style="transform: translate({x}px, {y}px) scale({zoom})"
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
