<script lang="ts">
  import type { SvelteFlowStore } from '$lib/store/types';
  import type { Snippet } from 'svelte';

  let { store = $bindable(), children }: { store: SvelteFlowStore; children: Snippet } = $props();
</script>

<div
  class="svelte-flow__viewport xyflow__viewport svelte-flow__container"
  style:transform="translate({store.viewport.x}px, {store.viewport.y}px) scale({store.viewport
    .zoom})"
>
  {@render children()}
</div>
