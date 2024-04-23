<script lang="ts">
  import { createEventDispatcher, setContext } from 'svelte';
  import cc from 'classcat';
  import { getMarkerId } from '@xyflow/system';

  import { useStore } from '$lib/store';
  import { useHandleEdgeSelect } from '$lib/hooks/useHandleEdgeSelect';
  import { BezierEdgeInternal } from '$lib/components/edges';

  import type { EdgeLayouted, Edge } from '$lib/types';

  const {
    id,
    type = 'default',
    source,
    target,
    data = {},
    style,
    zIndex,
    animated = false,
    selected = false,
    selectable,
    hidden,
    label,
    labelStyle,
    markerStart,
    markerEnd,
    sourceHandle,
    targetHandle,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    ariaLabel,
    interactionWidth,
    class: className
  }: EdgeLayouted = $props();

  setContext('svelteflow__edge_id', id);

  const { edgeLookup, edgeTypes, flowId, elementsSelectable } = useStore();
  const dispatch = createEventDispatcher<{
    edgeclick: { edge: Edge; event: MouseEvent | TouchEvent };
    edgecontextmenu: { edge: Edge; event: MouseEvent };
  }>();

  let edgeType = $derived(type || 'default');
  let edgeComponent = $derived($edgeTypes[edgeType] || BezierEdgeInternal);
  let markerStartUrl = $derived(
    markerStart ? `url(#${getMarkerId(markerStart, $flowId)})` : undefined
  );
  let markerEndUrl = $derived(markerEnd ? `url(#${getMarkerId(markerEnd, $flowId)})` : undefined);
  let isSelectable = $derived(
    selectable || ($elementsSelectable && typeof selectable === 'undefined')
  );

  const handleEdgeSelect = useHandleEdgeSelect();

  function onclick(event: MouseEvent | TouchEvent) {
    const edge = $edgeLookup.get(id);

    if (edge) {
      handleEdgeSelect(id);
      dispatch('edgeclick', { event, edge });
    }
  }

  function oncontextmenu(event: MouseEvent) {
    const edge = $edgeLookup.get(id);

    if (edge) {
      dispatch('edgecontextmenu', { event, edge });
    }
  }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
{#if !hidden}
  <svg style:z-index={zIndex}>
    <g
      class={cc(['svelte-flow__edge', className])}
      class:animated
      class:selected
      class:selectable={isSelectable}
      data-id={id}
      {onclick}
      {oncontextmenu}
      aria-label={ariaLabel === null
        ? undefined
        : ariaLabel
          ? ariaLabel
          : `Edge from ${source} to ${target}`}
      role="img"
    >
      <svelte:component
        this={edgeComponent}
        {id}
        {source}
        {target}
        {sourceX}
        {sourceY}
        {targetX}
        {targetY}
        {sourcePosition}
        {targetPosition}
        {animated}
        {selected}
        {label}
        {labelStyle}
        {data}
        {style}
        {interactionWidth}
        type={edgeType}
        sourceHandleId={sourceHandle}
        targetHandleId={targetHandle}
        markerStart={markerStartUrl}
        markerEnd={markerEndUrl}
      />
    </g>
  </svg>
{/if}
