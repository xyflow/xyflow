<script lang="ts" generics="NodeType extends Node = Node, EdgeType extends Edge = Edge">
  import type { SvelteFlowStore } from '$lib/store/types';
  import type { Node, Edge } from '$lib/types';
  import type { Snippet } from 'svelte';

  let {
    store = $bindable(),
    children
  }: { store: SvelteFlowStore<NodeType, EdgeType>; children: Snippet } = $props();
</script>

<div
  class="svelte-flow__viewport xyflow__viewport svelte-flow__container"
  style:transform="translate({store.viewport.x}px, {store.viewport.y}px) scale({store.viewport
    .zoom})"
>
  {@render children()}
</div>
