<script context="module">
  import { Map } from 'svelte/reactivity';

  function updateConnection(
    edgeId: string,
    store: SvelteFlowStore,
    source: string,
    target: string,
    sourceHandle: string | null = null,
    targetHandle: string | null = null,
    sourceNode?: InternalNode,
    targetNode?: InternalNode
  ) {
    if (!sourceNode || !targetNode) return;
    const sourceKey = `${source}-source-${sourceHandle}`;
    const targetKey = `${target}-target-${targetHandle}`;

    const prevSources =
      untrack(() => store.connectionLookup.get(sourceKey)) ?? new Map<string, HandleConnection>();
    const prevTargets =
      untrack(() => store.connectionLookup.get(targetKey)) ?? new Map<string, HandleConnection>();

    const connection = {
      edgeId,
      source,
      target,
      sourceHandle,
      targetHandle,
      sourceNode,
      targetNode
    };

    store.connectionLookup.set(sourceKey, prevSources.set(`${target}-${targetHandle}`, connection));
    store.connectionLookup.set(targetKey, prevTargets.set(`${source}-${sourceHandle}`, connection));

    return () => {
      prevSources.delete(`${target}-${targetHandle}`);
      prevTargets.delete(`${source}-${sourceHandle}`);

      store.connectionLookup.set(sourceKey, prevSources);
      store.connectionLookup.set(targetKey, prevTargets);
    };
  }
</script>

<script lang="ts">
  import { useStore } from '$lib/store';
  import type { DefaultEdgeOptions, Edge, EdgeEvents, InternalNode } from '$lib/types';
  import { getEdgePosition, getElevatedEdgeZIndex, type HandleConnection } from '@xyflow/system';
  import EdgeWrapper from './EdgeWrapper.svelte';
  import { onDestroy, untrack } from 'svelte';
  import CallOnMount from '../CallOnMount/CallOnMount.svelte';
  import type { SvelteFlowStore } from '$lib/store/types';

  let {
    id,
    edge,
    defaultEdgeOptions = {},
    onedgeclick,
    onedgecontextmenu
  }: EdgeEvents & { id: string; edge: Edge; defaultEdgeOptions?: DefaultEdgeOptions } = $props();

  const store = useStore();

  let sourceNode = $derived(store.nodeLookup.get(edge.source));
  let targetNode = $derived(store.nodeLookup.get(edge.target));

  let position = $derived.by(() => {
    if (!sourceNode || !targetNode) {
      return null;
    }

    // Listen to updates of handle bounds
    targetNode.internals.handleBounds;

    return getEdgePosition({
      id,
      sourceNode,
      targetNode,
      sourceHandle: edge.sourceHandle || null,
      targetHandle: edge.targetHandle || null,
      connectionMode: store.connectionMode,
      onError: store.onerror
    });
  });

  let zIndex = $derived.by(() => {
    if (!sourceNode || !targetNode) {
      return null;
    }

    return getElevatedEdgeZIndex({
      selected: edge.selected,
      zIndex: edge.zIndex,
      sourceNode,
      targetNode,
      elevateOnSelect: false
    });
  });

  $effect.pre(() => {
    if (edge.selected) {
      store.selectedEdges.set(id, edge);
    } else {
      store.selectedEdges.delete(id);
    }
  });

  // Ensure the edge lands in the edge lookup
  store.edgeLookup.set(id, edge);
  $effect.pre(() => {
    store.edgeLookup.set(id, edge);
  });
  onDestroy(() => {
    store.edgeLookup.delete(id);
    store.selectedEdges.delete(id);
  });

  // Ensure the connection is updated in the connection lookup
  // having the deletion logic in the effect cleanup might lead
  // to additional updates
  $effect.pre(() => {
    const deleteConnection = updateConnection(
      id,
      store,
      edge.source,
      edge.target,
      edge.sourceHandle,
      edge.targetHandle,
      store.nodeLookup.get(edge.source),
      store.nodeLookup.get(edge.target)
    );
    return deleteConnection;
  });
</script>

{#if position !== null && zIndex !== null}
  <!-- TODO: this does not make sense here but lets see how visible edges pans out -->
  <CallOnMount
    onMount={() => {
      if (!store.edgesInitialized) store.edgesInitialized = true;
    }}
    onDestroy={() => {
      // if (store.edgesInitialized) store.edgesInitialized = false;
    }}
  />
  <EdgeWrapper
    {id}
    source={edge.source}
    target={edge.target}
    data={edge.data ?? defaultEdgeOptions.data}
    style={edge.style ?? defaultEdgeOptions.style}
    animated={edge.animated ?? defaultEdgeOptions.animated}
    selected={edge.selected}
    selectable={edge.selectable ?? defaultEdgeOptions.selectable}
    hidden={edge.hidden ?? defaultEdgeOptions.hidden}
    label={edge.label ?? defaultEdgeOptions.label}
    labelStyle={edge.labelStyle ?? defaultEdgeOptions.labelStyle}
    markerStart={edge.markerStart ?? defaultEdgeOptions.markerStart}
    markerEnd={edge.markerEnd ?? defaultEdgeOptions.markerEnd}
    sourceHandle={edge.sourceHandle}
    targetHandle={edge.targetHandle}
    sourceX={position.sourceX}
    sourceY={position.sourceY}
    targetX={position.targetX}
    targetY={position.targetY}
    sourcePosition={position.sourcePosition}
    targetPosition={position.targetPosition}
    ariaLabel={edge.ariaLabel ?? defaultEdgeOptions.ariaLabel}
    interactionWidth={edge.interactionWidth ?? defaultEdgeOptions.interactionWidth}
    class={edge.class}
    type={edge.type}
    {zIndex}
    {onedgeclick}
    {onedgecontextmenu}
  />
{/if}
