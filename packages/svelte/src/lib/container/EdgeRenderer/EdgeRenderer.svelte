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

  // const { edges, nodes } = store;

  let layoutedEdges = $derived.by(() => {
    store.nodes;
    const layoutedEdges = store.edges.reduce<EdgeLayouted[]>((res, edge) => {
      const sourceNode = store.nodeLookup.get(edge.source);
      const targetNode = store.nodeLookup.get(edge.target);

      if (!sourceNode || !targetNode) {
        return res;
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
        res.push({
          ...edge,
          zIndex: getElevatedEdgeZIndex({
            selected: edge.selected,
            zIndex: edge.zIndex,
            sourceNode,
            targetNode,
            elevateOnSelect: false
          }),
          ...edgePosition
        });
      }

      return res;
    }, []);

    return layoutedEdges;
  });
</script>

<div class="svelte-flow__edges">
  <svg class="svelte-flow__marker">
    <MarkerDefinition />
  </svg>

  {#each layoutedEdges as edge (edge.id)}
    <EdgeWrapper
      {store}
      id={edge.id}
      source={edge.source}
      target={edge.target}
      data={edge.data}
      style={edge.style}
      animated={edge.animated}
      selected={edge.selected}
      selectable={edge.selectable ?? store.elementsSelectable}
      deletable={edge.deletable}
      hidden={edge.hidden}
      label={edge.label}
      labelStyle={edge.labelStyle}
      markerStart={edge.markerStart}
      markerEnd={edge.markerEnd}
      sourceHandle={edge.sourceHandle}
      targetHandle={edge.targetHandle}
      sourceX={edge.sourceX}
      sourceY={edge.sourceY}
      targetX={edge.targetX}
      targetY={edge.targetY}
      sourcePosition={edge.sourcePosition}
      targetPosition={edge.targetPosition}
      ariaLabel={edge.ariaLabel}
      interactionWidth={edge.interactionWidth}
      class={edge.class}
      type={edge.type || 'default'}
      zIndex={edge.zIndex}
      {onedgeclick}
      {onedgecontextmenu}
      {onedgemouseenter}
      {onedgemouseleave}
    />
  {/each}

  {#if layoutedEdges.length > 0}
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
