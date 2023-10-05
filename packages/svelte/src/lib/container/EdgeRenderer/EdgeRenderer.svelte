<script lang="ts">
  import { onMount } from 'svelte';
  import { EdgeWrapper } from '$lib/components/EdgeWrapper';
  import { MarkerDefinition } from '$lib/container/EdgeRenderer/MarkerDefinition';
  import { useStore } from '$lib/store';
  import type { DefaultEdgeOptions } from '$lib/types';

  export let defaultEdgeOptions: DefaultEdgeOptions | undefined;

  const {
    elementsSelectable,
    edgeTree,
    edges: { setDefaultOptions }
  } = useStore();

  onMount(() => {
    if (defaultEdgeOptions) setDefaultOptions(defaultEdgeOptions);
  });
</script>

{#each $edgeTree as group (group.level)}
  <svg style="z-index: {group.level}" class="svelte-flow__edges">
    {#if group.isMaxLevel} <MarkerDefinition />{/if}
    <g>
      {#each group.edges as edge (edge.id)}
        {@const edgeType = edge.type || 'default'}
        {@const selectable = !!(
          edge.selectable ||
          ($elementsSelectable && typeof edge.selectable === 'undefined')
        )}

        <EdgeWrapper {...edge} type={edgeType} {selectable} on:edgeclick on:edgecontextmenu />
      {/each}
    </g>
  </svg>
{/each}

<style>
  .svelte-flow__edges {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
  }
</style>
