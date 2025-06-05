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
  style:--xy-view-x={`${store.viewport.x}px`}
  style:--xy-view-y={`${store.viewport.y}px`}
  style:--xy-view-zoom={store.viewport.zoom}
  style:--xy-view-zoom-inverse={1 / store.viewport.zoom}
>
  {@render children()}
</div>
