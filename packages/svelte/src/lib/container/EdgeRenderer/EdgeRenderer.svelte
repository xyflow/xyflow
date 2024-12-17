<script lang="ts">
  import { EdgeWrapper } from '$lib/components/EdgeWrapper';
  import { CallOnMount } from '$lib/components/CallOnMount';
  import { MarkerDefinition } from '$lib/container/EdgeRenderer/MarkerDefinition';
  import type { EdgeEvents, EdgeLayouted } from '$lib/types';
  import { getEdgePosition, getElevatedEdgeZIndex } from '@xyflow/system';
  import type { SvelteFlowStore } from '$lib/store/types';

  let {
    store,
    onedgeclick,
    onedgecontextmenu,
    onedgemouseenter,
    onedgemouseleave
  }: { store: SvelteFlowStore } & EdgeEvents = $props();

  let previousLayoutedEdges = new Map<string, EdgeLayouted>();
  let layoutedEdges = $derived.by(() => {
    // here for update reference
    store.nodes;

    const layoutedEdges = new Map<string, EdgeLayouted>();

    for (let edge of store.edges) {
      const sourceNode = store.nodeLookup.get(edge.source);
      const targetNode = store.nodeLookup.get(edge.target);

      if (!sourceNode || !targetNode) {
        continue;
      }

      // we reuse the previous edge object if
      // the current and previous edge are the same
      // and the source and target node are the same
      // and references to internalNodes are the same
      const previous = previousLayoutedEdges.get(edge.id);
      if (
        previous &&
        edge == previous.edge &&
        sourceNode == previous.sourceNode &&
        targetNode == previous.targetNode
      ) {
        layoutedEdges.set(edge.id, previous);
        continue;
      }

      const edgePosition = getEdgePosition({
        id: edge.id,
        sourceNode,
        targetNode,
        sourceHandle: edge.sourceHandle || null,
        targetHandle: edge.targetHandle || null,
        connectionMode: store.connectionMode,
        onError: store.onerror
      });

      if (edgePosition) {
        layoutedEdges.set(edge.id, {
          ...edge,
          zIndex: getElevatedEdgeZIndex({
            selected: edge.selected,
            zIndex: edge.zIndex,
            sourceNode,
            targetNode,
            elevateOnSelect: false
          }),
          ...edgePosition,
          sourceNode,
          targetNode,
          edge
        });
      }
    }

    previousLayoutedEdges = layoutedEdges;
    return layoutedEdges;
  });
</script>

<div class="svelte-flow__edges">
  <svg class="svelte-flow__marker">
    <MarkerDefinition />
  </svg>

  {#each layoutedEdges.values() as edge (edge.id)}
    <EdgeWrapper
      {store}
      {edge}
      {onedgeclick}
      {onedgecontextmenu}
      {onedgemouseenter}
      {onedgemouseleave}
    />
  {/each}

  {#if layoutedEdges.size > 0}
    <CallOnMount
      onMount={() => {
        store.edgesInitialized = true;
      }}
      onDestroy={() => {
        store.edgesInitialized = false;
      }}
    />
  {/if}
</div>
