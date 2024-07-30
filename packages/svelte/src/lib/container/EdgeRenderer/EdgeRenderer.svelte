<script lang="ts">
  import { MarkerDefinition } from '$lib/container/EdgeRenderer/MarkerDefinition';
  import type { EdgeRendererProps } from './types';
  import EdgeUpdater from '$lib/components/EdgeWrapper/EdgeUpdater.svelte';
  import { useStore } from '$lib/store';

  let { defaultEdgeOptions, onedgeclick, onedgecontextmenu, edges, nodes }: EdgeRendererProps =
    $props();

  let store = useStore();

  let previousMap = new Map();

  // TODO: We can get the positions right here & rename things to make it clearer
  let _edges = $derived.by(() => {
    nodes;
    let checkArray = [];
    for (const edge of $edges) {
      let sourceNode = store.nodeLookup.get(edge.source);
      let targetNode = store.nodeLookup.get(edge.target);

      let previous = previousMap.get(edge.id);

      if (previous && sourceNode === previous.sourceNode && targetNode === previous.targetNode) {
        previous.edge = edge;
        checkArray.push(previous);
        continue;
      }
      checkArray.push({
        sourceNode,
        targetNode,
        edge
      });
    }
    return checkArray;
  });

  $effect(() => {
    previousMap.clear();
    for (const edge of _edges) {
      previousMap.set(edge.edge.id, edge);
    }
  });
</script>

<div class="svelte-flow__edges">
  <svg class="svelte-flow__marker">
    <MarkerDefinition />
  </svg>

  {#each _edges as check (check.edge.id)}
    {@const _check = check}
    <EdgeUpdater
      id={_check.edge.id}
      {defaultEdgeOptions}
      edge={_check.edge}
      {onedgeclick}
      {onedgecontextmenu}
    />
  {/each}
</div>
