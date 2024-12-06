<script lang="ts">
  import { setContext } from 'svelte';
  import cc from 'classcat';

  import { getMarkerId } from '@xyflow/system';

  import { useStore } from '$lib/store';
  import { BezierEdgeInternal } from '$lib/components/edges';
  import { useHandleEdgeSelect } from '$lib/hooks/useHandleEdgeSelect';

  import type { EdgeLayouted, Edge, EdgeEvents } from '$lib/types';
  import type { SvelteFlowStore } from '$lib/store/types';

  const {
    id,
    type = 'default',
    store,
    source,
    target,
    data = {},
    style,
    zIndex,
    animated = false,
    selected = false,
    selectable,
    deletable,
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
  }: { store: SvelteFlowStore } & EdgeLayouted & EdgeEvents = $props();

  setContext('svelteflow__edge_id', id);

  let edgeType = $derived(type ?? 'default');
  let EdgeComponent = $derived(store.edgeTypes[edgeType] ?? BezierEdgeInternal);
  let markerStartUrl = $derived(
    markerStart ? `url('#${getMarkerId(markerStart, store.flowId)}')` : undefined
  );
  let markerEndUrl = $derived(
    markerEnd ? `url('#${getMarkerId(markerEnd, store.flowId)}')` : undefined
  );
  let isSelectable = $derived(selectable ?? store.elementsSelectable);

  const handleEdgeSelect = useHandleEdgeSelect();

  function onclick(event: MouseEvent | TouchEvent) {
    const edge = store.edgeLookup.get(id);

    if (edge) {
      handleEdgeSelect(id);
      onedgeclick?.({ event, edge });
    }
  }

  function onMouseEvent(
    event: MouseEvent,
    callback: ({ edge, event }: { edge: Edge; event: MouseEvent }) => void
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
      class={cc(['svelte-flow__edge', className])}
      class:animated
      class:selected
      class:selectable={isSelectable}
      data-id={id}
      {onclick}
      oncontextmenu={onedgecontextmenu
        ? (e) => {
            onMouseEvent(e, onedgecontextmenu);
          }
        : undefined}
      onmouseenter={onedgemouseenter
        ? (e) => {
            onMouseEvent(e, onedgemouseenter);
          }
        : undefined}
      onmouseleave={onedgemouseleave
        ? (e) => {
            onMouseEvent(e, onedgemouseleave);
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
        selectable={isSelectable}
        deletable={deletable ?? true}
        type={edgeType}
        sourceHandleId={sourceHandle}
        targetHandleId={targetHandle}
        markerStart={markerStartUrl}
        markerEnd={markerEndUrl}
      />
    </g>
  </svg>
{/if}
