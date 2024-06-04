<script lang="ts">
  import { setContext } from 'svelte';
  import cc from 'classcat';
  import { getMarkerId } from '@xyflow/system';

  import { useStore } from '$lib/store';
  import { useHandleEdgeSelect } from '$lib/hooks/useHandleEdgeSelect';
  import { BezierEdgeInternal } from '$lib/components/edges';

  import type { EdgeLayouted, EdgeEvents, Edge } from '$lib/types';

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
    class: className,
    onedgeclick,
    onedgecontextmenu,
    onedgemouseenter,
    onedgemouseleave
  }: EdgeLayouted & EdgeEvents = $props();

  setContext('svelteflow__edge_id', id);

  const store = useStore();

  let edgeType = $derived(type || 'default');
  let edgeComponent = $derived(store.edgeTypes[edgeType] || BezierEdgeInternal);
  let markerStartUrl = $derived(
    markerStart ? `url(#${getMarkerId(markerStart, store.flowId)})` : undefined
  );
  let markerEndUrl = $derived(
    markerEnd ? `url(#${getMarkerId(markerEnd, store.flowId)})` : undefined
  );
  let isSelectable = $derived(
    selectable || (store.elementsSelectable && typeof selectable === 'undefined')
  );

  const handleEdgeSelect = useHandleEdgeSelect();

  function onclick(event: MouseEvent | TouchEvent) {
    const edge = store.edgeLookup.get(id);

    if (edge && isSelectable) {
      handleEdgeSelect(id);
      onedgeclick?.({ event, edge });
    }
  }

  function getEdgeEvent(
    callback: ((param: { event: MouseEvent; edge: Edge }) => void) | undefined
  ) {
    if (callback) {
      return (event: MouseEvent) => {
        const edge = store.edgeLookup.get(id);

        if (edge) {
          callback({ event, edge });
        }
      };
    }
    return undefined;
  }
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
{#if !hidden}
  <svg style:z-index={zIndex}>
    <g
      class={cc(['svelte-flow__edge', className])}
      class:animated
      class:selected
      class:selectable={isSelectable}
      data-id={id}
      {onclick}
      oncontextmenu={getEdgeEvent(onedgecontextmenu)}
      onmouseenter={getEdgeEvent(onedgemouseenter)}
      onmouseleave={getEdgeEvent(onedgemouseleave)}
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
