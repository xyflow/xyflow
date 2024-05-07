<script lang="ts">
  import { MarkerDefinition } from '$lib/container/EdgeRenderer/MarkerDefinition';
  import { useStore } from '$lib/store';
  import type { EdgeRendererProps } from './types';
  import EdgeUpdater from '$lib/components/EdgeWrapper/EdgeUpdater.svelte';

  let { defaultEdgeOptions, onedgeclick, onedgecontextmenu, edges }: EdgeRendererProps = $props();

  const store = useStore();
  // TODO: Double check this
  // if (defaultEdgeOptions) store.edges.setDefaultOptions(defaultEdgeOptions);
  // $effect.pre(() => {
  //   if (defaultEdgeOptions) store.edges.setDefaultOptions(defaultEdgeOptions);
  // });
</script>

<div class="svelte-flow__edges">
  <svg class="svelte-flow__marker">
    <MarkerDefinition />
  </svg>

  {#each edges as edge (edge.id)}
    <EdgeUpdater id={edge.id} {edge} {onedgeclick} {onedgecontextmenu} />
  {/each}
</div>
