<script lang="ts">
  import { MarkerDefinition } from '$lib/container/EdgeRenderer/MarkerDefinition';
  import type { EdgeRendererProps } from './types';
  import EdgeUpdater from '$lib/components/EdgeWrapper/EdgeUpdater.svelte';

  let { defaultEdgeOptions, onedgeclick, onedgecontextmenu, edges }: EdgeRendererProps = $props();
</script>

<div class="svelte-flow__edges">
  <svg class="svelte-flow__marker">
    <MarkerDefinition />
  </svg>

  {#each edges as edge (edge.id)}
    <EdgeUpdater id={edge.id} {defaultEdgeOptions} {edge} {onedgeclick} {onedgecontextmenu} />
  {/each}
</div>
