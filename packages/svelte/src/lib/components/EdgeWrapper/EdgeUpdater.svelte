<script lang="ts">
  import { useStore } from '$lib/store';
  import type { Edge, EdgeEvents } from '$lib/types';
  import { getEdgePosition, getElevatedEdgeZIndex } from '@xyflow/system';
  import EdgeWrapper from './EdgeWrapper.svelte';

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
</script>

{#if position !== null && zIndex !== null}
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
