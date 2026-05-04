<script lang="ts" generics="NodeType extends Node = Node, EdgeType extends Edge = Edge">
  import { elementSelectionKeys, getMarkerId } from '@xyflow/system';

  import { setEdgeIdContext } from '$lib/store/context';

  import { BezierEdgeInternal } from '$lib/components/edges';

  import type { Node, EdgeLayouted, Edge, EdgeEvents } from '$lib/types';
  import type { SvelteFlowStore } from '$lib/store/types';
  import { ARIA_EDGE_DESC_KEY } from '../A11yDescriptions';

  const {
    edge,
    store = $bindable(),
    onedgeclick,
    onedgecontextmenu,
    onedgepointerenter,
    onedgepointerleave
  }: {
    store: SvelteFlowStore<NodeType, EdgeType>;
    edge: EdgeLayouted<EdgeType>;
  } & EdgeEvents<EdgeType> = $props();

  let {
    id,
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

  // svelte-ignore state_referenced_locally
  setEdgeIdContext(id);

  // svelte-ignore non_reactive_update
  let edgeRef: SVGGElement | null = null;

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
    callback: ({ edge, event }: { edge: EdgeType; event: T }) => void
  ) {
    const edge = store.edgeLookup.get(id);

    if (edge) {
      callback({ event, edge });
    }
  }

  function onkeydown(event: KeyboardEvent) {
    if (!store.disableKeyboardA11y && elementSelectionKeys.includes(event.key) && selectable) {
      const { unselectNodesAndEdges, addSelectedEdges } = store;
      const unselect = event.key === 'Escape';

      if (unselect) {
        edgeRef?.blur();
        unselectNodesAndEdges({ edges: [edge] });
      } else {
        addSelectedEdges([id]);
      }
    }
  }
</script>

<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
{#if !hidden}
  <svg style:z-index={zIndex} class="svelte-flow__edge-wrapper">
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
      aria-describedby={focusable ? `${ARIA_EDGE_DESC_KEY}-${store.flowId}` : undefined}
      role={edge.ariaRole ?? (focusable ? 'group' : 'img')}
      aria-roledescription="edge"
      onkeydown={focusable ? onkeydown : undefined}
      tabindex={focusable ? 0 : undefined}
      {...edge.domAttributes}
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
