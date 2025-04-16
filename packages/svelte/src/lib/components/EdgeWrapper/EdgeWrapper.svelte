<script lang="ts">
  import { setContext } from 'svelte';

  import { elementSelectionKeys, getMarkerId } from '@xyflow/system';

  import { BezierEdgeInternal } from '$lib/components/edges';

  import type { EdgeLayouted, Edge, EdgeEvents } from '$lib/types';
  import type { SvelteFlowStore } from '$lib/store/types';

  const {
    edge,
    store = $bindable(),
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
    selectable: _selectable,
    focusable: _focusable,
    deletable = true,
    hidden,
    zIndex,
    class: className,
    ariaLabel
  } = $derived(edge);

  // svelte-ignore non_reactive_update
  let edgeRef: SVGGElement | null = null;

  const { id } = edge;
  setContext('svelteflow__edge_id', id);

  let selectable = $derived(_selectable ?? store.elementsSelectable);
  let focusable = $derived(_focusable ?? store.edgesFocusable);

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

  function onmouseevent<T = MouseEvent>(
    event: T,
    callback: ({ edge, event }: { edge: Edge; event: T }) => void
  ) {
    const edge = store.edgeLookup.get(id);

    if (edge) {
      callback({ event, edge });
    }
  }

  onkeydown = (event: KeyboardEvent) => {
    // TODO: Possible Svelte Bug? onkeydown is always firing for the last edge
    if (!store.disableKeyboardA11y && elementSelectionKeys.includes(event.key) && selectable) {
      const { unselectNodesAndEdges, addSelectedEdges } = store;
      const unselect = event.key === 'Escape';

      if (unselect) {
        edgeRef?.blur();
        unselectNodesAndEdges({ edges: [edge] });
      } else {
        console.log(id);
        addSelectedEdges([id]);
      }
    }
  };
</script>

<!-- TODO: aria-label, describedby -->
{#if !hidden}
  <svg style:z-index={zIndex}>
    <g
      bind:this={edgeRef}
      class={['svelte-flow__edge', className]}
      class:animated
      class:selected
      class:selectable
      data-id={id}
      {onclick}
      oncontextmenu={onedgecontextmenu
        ? (e) => {
            onmouseevent(e, onedgecontextmenu);
          }
        : undefined}
      onpointerenter={onedgepointerenter
        ? (e) => {
            onmouseevent(e, onedgepointerenter);
          }
        : undefined}
      onpointerleave={onedgepointerleave
        ? (e) => {
            onmouseevent(e, onedgepointerleave);
          }
        : undefined}
      aria-label={ariaLabel === null
        ? undefined
        : ariaLabel
          ? ariaLabel
          : `Edge from ${source} to ${target}`}
      role={focusable ? 'button' : 'img'}
      onkeydown={focusable ? onkeydown : undefined}
      tabIndex={focusable ? 0 : undefined}
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
