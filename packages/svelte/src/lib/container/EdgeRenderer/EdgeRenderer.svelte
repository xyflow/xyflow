<script lang="ts">
  import { EdgeWrapper } from '$lib/components/EdgeWrapper';
  import { MarkerDefinition } from '$lib/container/EdgeRenderer/MarkerDefinition';
  import type { EdgeEvents } from '$lib/types';
  import type { SvelteFlowStore } from '$lib/store/types';

  let {
    store = $bindable(),
    onedgeclick,
    onedgecontextmenu,
    onedgepointerenter,
    onedgepointerleave
  }: { store: SvelteFlowStore } & EdgeEvents = $props();
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
