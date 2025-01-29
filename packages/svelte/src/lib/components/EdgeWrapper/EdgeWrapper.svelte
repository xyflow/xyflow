<script lang="ts">
  import { setContext } from 'svelte';

  import { getMarkerId } from '@xyflow/system';

  import { BezierEdgeInternal } from '$lib/components/edges';

  import type { EdgeLayouted, Edge, EdgeEvents } from '$lib/types';
  import type { SvelteFlowStore } from '$lib/store/types';

  const {
    edge,
    store,
    onedgeclick,
    onedgecontextmenu,
    onedgepointerenter,
    onedgepointerleave
  }: { store: SvelteFlowStore; edge: EdgeLayouted } & EdgeEvents = $props();

  let {
    source,
    target,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    animated = false,
    selected = false,
    label,
    labelStyle,
    data = {},
    style,
    interactionWidth,
    type = 'default',
    sourceHandle,
    targetHandle,
    markerStart,
    markerEnd,
    selectable: edgeSelectable,
    deletable = true,
    hidden,
    zIndex,
    class: className,
    ariaLabel
  } = $derived(store.defaultEdgeOptions ? { ...store.defaultEdgeOptions, ...edge } : edge);

  const { id } = edge;
  setContext('svelteflow__edge_id', id);

  let selectable = $derived(edgeSelectable ?? store.elementsSelectable);
  let EdgeComponent = $derived(store.edgeTypes[type] ?? BezierEdgeInternal);

  let markerStartUrl = $derived(
    markerStart ? `url('#${getMarkerId(markerStart, store.flowId)}')` : undefined
  );
  let markerEndUrl = $derived(
    markerEnd ? `url('#${getMarkerId(markerEnd, store.flowId)}')` : undefined
  );

  function onclick(event: MouseEvent) {
    const edge = store.edgeLookup.get(id);

    if (edge) {
      if (selectable) store.handleEdgeSelection(id);
      onedgeclick?.({ event, edge });
    }
  }

  function onMouseEvent<T = MouseEvent>(
    event: T,
    callback: ({ edge, event }: { edge: Edge; event: T }) => void
  ) {
    const edge = store.edgeLookup.get(id);

    if (edge) {
      callback({ event, edge });
    }
  }
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
{#if !hidden}
  <svg style:z-index={zIndex}>
    <g
      class={['svelte-flow__edge', className]}
      class:animated
      class:selected
      class:selectable
      data-id={id}
      {onclick}
      oncontextmenu={onedgecontextmenu
        ? (e) => {
            onMouseEvent(e, onedgecontextmenu);
          }
        : undefined}
      onpointerenter={onedgepointerenter
        ? (e) => {
            onMouseEvent(e, onedgepointerenter);
          }
        : undefined}
      onpointerleave={onedgepointerleave
        ? (e) => {
            onMouseEvent(e, onedgepointerleave);
          }
        : undefined}
      aria-label={ariaLabel === null
        ? undefined
        : ariaLabel
          ? ariaLabel
          : `Edge from ${source} to ${target}`}
      role="img"
    >
      <EdgeComponent
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
        {selectable}
        {deletable}
        {type}
        sourceHandleId={sourceHandle}
        targetHandleId={targetHandle}
        markerStart={markerStartUrl}
        markerEnd={markerEndUrl}
      />
    </g>
  </svg>
{/if}
