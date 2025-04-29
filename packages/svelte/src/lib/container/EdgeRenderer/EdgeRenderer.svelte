<script lang="ts" generics="NodeType extends Node = Node, EdgeType extends Edge = Edge">
  import { EdgeWrapper } from '$lib/components/EdgeWrapper';
  import { MarkerDefinition } from '$lib/container/EdgeRenderer/MarkerDefinition';
  import type { Node, Edge, EdgeEvents } from '$lib/types';
  import type { SvelteFlowStore } from '$lib/store/types';

  let {
    store = $bindable(),
    onedgeclick,
    onedgecontextmenu,
    onedgepointerenter,
    onedgepointerleave
  }: { store: SvelteFlowStore<NodeType, EdgeType> } & EdgeEvents<EdgeType> = $props();
</script>

<div class="svelte-flow__edges">
  <svg class="svelte-flow__marker">
    <MarkerDefinition />
  </svg>

  {#each store.visible.edges.values() as edge (edge.id)}
    <EdgeWrapper
      bind:store
      {edge}
      {onedgeclick}
      {onedgecontextmenu}
      {onedgepointerenter}
      {onedgepointerleave}
    />
  {/each}
</div>
