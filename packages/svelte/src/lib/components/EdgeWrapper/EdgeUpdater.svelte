<script context="module">
  function updateConnection(
    edgeId: string,
    connectionLookup: ConnectionLookup,
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

    const prevSources = connectionLookup.get(sourceKey) ?? new Map<string, HandleConnection>();
    const prevTargets = connectionLookup.get(targetKey) ?? new Map<string, HandleConnection>();

    const connection = {
      edgeId,
      source,
      target,
      sourceHandle,
      targetHandle,
      sourceNode,
      targetNode
    };

    connectionLookup.set(sourceKey, prevSources.set(`${target}-${targetHandle}`, connection));
    connectionLookup.set(targetKey, prevTargets.set(`${source}-${sourceHandle}`, connection));

    return () => {
      prevSources.delete(`${target}-${targetHandle}`);
      prevTargets.delete(`${source}-${sourceHandle}`);

      // TODO: is this neccessary?
      if (prevSources.size === 0) connectionLookup.delete(sourceKey);
      if (prevTargets.size === 0) connectionLookup.delete(targetKey);
    };
  }
</script>

<script lang="ts">
  import { useStore } from '$lib/store';
  import type { Edge, EdgeEvents, InternalNode } from '$lib/types';
  import {
    getEdgePosition,
    getElevatedEdgeZIndex,
    type ConnectionLookup,
    type HandleConnection
  } from '@xyflow/system';
  import EdgeWrapper from './EdgeWrapper.svelte';
  import { onDestroy } from 'svelte';
  import CallOnMount from '../CallOnMount/CallOnMount.svelte';

  let { id, edge, onedgeclick, onedgecontextmenu }: EdgeEvents & { id: string; edge: Edge } =
    $props();

  const store = useStore();

  let sourceNode = $derived(store.nodeLookup.get(edge.source));
  let targetNode = $derived(store.nodeLookup.get(edge.target));

  let position = $derived.by(() => {
    if (!sourceNode || !targetNode) {
      return null;
    }

    targetNode.internals.handleBounds;
    // sourceNode.sourcePosition;
    // targetNode.targetPosition;
    return getEdgePosition({
      id: edge.id,
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

  // Ensure the edge lands in the edge lookup
  store.edgeLookup.set(edge.id, edge);
  $effect.pre(() => {
    store.edgeLookup.set(edge.id, edge);
  });
  onDestroy(() => {
    store.edgeLookup.delete(edge.id);
  });

  // Ensure the connection is updated in the connection lookup
  // having the deletion logic in the effect cleanup might lead
  // to additional updates
  updateConnection(
    id,
    store.connectionLookup,
    edge.source,
    edge.target,
    edge.sourceHandle,
    edge.targetHandle,
    store.nodeLookup.get(edge.source),
    store.nodeLookup.get(edge.target)
  );
  $effect.pre(() => {
    const deleteConnection = updateConnection(
      id,
      store.connectionLookup,
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
    data={edge.data}
    style={edge.style}
    animated={edge.animated}
    selected={edge.selected}
    selectable={edge.selectable}
    hidden={edge.hidden}
    label={edge.label}
    labelStyle={edge.labelStyle}
    markerStart={edge.markerStart}
    markerEnd={edge.markerEnd}
    sourceHandle={edge.sourceHandle}
    targetHandle={edge.targetHandle}
    sourceX={position.sourceX}
    sourceY={position.sourceY}
    targetX={position.targetX}
    targetY={position.targetY}
    sourcePosition={position.sourcePosition}
    targetPosition={position.targetPosition}
    ariaLabel={edge.ariaLabel}
    interactionWidth={edge.interactionWidth}
    class={edge.class}
    type={edge.type}
    {zIndex}
    {onedgeclick}
    {onedgecontextmenu}
  />
{/if}
