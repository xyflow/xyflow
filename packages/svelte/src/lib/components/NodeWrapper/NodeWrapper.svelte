<script lang="ts">
  import { setContext, onDestroy } from 'svelte';
  import { get, writable } from 'svelte/store';
  import cc from 'classcat';
  import { errorMessages, Position } from '@xyflow/system';

  import drag from '$lib/actions/drag';
  import { useStore } from '$lib/store';
  import DefaultNode from '$lib/components/nodes/DefaultNode.svelte';
  import type { ConnectableContext, NodeWrapperProps } from './types';
  import { getNodeInlineStyleDimensions } from './utils';
  import type { NodeEvents } from '$lib/types';

  let {
    node,
    id,
    data = {},
    selected = false,
    draggable,
    selectable,
    deletable,
    connectable = true,
    hidden = false,
    dragging = false,
    resizeObserver = null,
    style,
    class: className,
    type = 'default',
    isParent = false,
    parentId,
    positionX,
    positionY,
    sourcePosition,
    targetPosition,
    zIndex,
    measuredWidth,
    measuredHeight,
    initialWidth,
    initialHeight,
    width,
    height,
    dragHandle,
    initialized = false,
    nodeClickDistance,
    onnodeclick,
    onnodedrag,
    onnodedragstart,
    onnodedragstop,
    onnodemouseenter,
    onnodemouseleave,
    onnodemousemove,
    onnodecontextmenu
  }: NodeWrapperProps & NodeEvents = $props();

  const store = useStore();
  const {
    nodeTypes,
    nodeDragThreshold,
    selectNodesOnDrag,
    handleNodeSelection,
    updateNodeInternals
  } = store;

  let nodeRef: HTMLDivElement | null = $state(null);
  let prevNodeRef: HTMLDivElement | null = null;

  let prevType: string | undefined;
  let prevSourcePosition: Position | undefined;
  let prevTargetPosition: Position | undefined;

  let NodeComponent = $derived($nodeTypes[type] ?? DefaultNode);

  let connectableContext: ConnectableContext = {
    get value() {
      return connectable;
    }
  };
  setContext('svelteflow__node_connectable', connectableContext);
  setContext('svelteflow__node_id', id);

  if (process.env.NODE_ENV === 'development') {
    $effect(() => {
      const valid = !!$nodeTypes[type];
      if (!valid) {
        console.warn('003', errorMessages['error003'](type!));
      }
    });
  }

  let inlineStyleDimensions = $derived(
    getNodeInlineStyleDimensions({
      width,
      height,
      initialWidth,
      initialHeight,
      measuredWidth,
      measuredHeight
    })
  );

  $effect(() => {
    // if type, sourcePosition or targetPosition changes,
    // we need to re-calculate the handle positions
    const doUpdate =
      (prevType && type !== prevType) ||
      (prevSourcePosition && sourcePosition !== prevSourcePosition) ||
      (prevTargetPosition && targetPosition !== prevTargetPosition);

    if (doUpdate && nodeRef !== null) {
      requestAnimationFrame(() => {
        if (nodeRef !== null) {
          updateNodeInternals(
            new Map([
              [
                id,
                {
                  id,
                  nodeElement: nodeRef,
                  force: true
                }
              ]
            ])
          );
        }
      });
    }

    prevType = type;
    prevSourcePosition = sourcePosition;
    prevTargetPosition = targetPosition;
  });

  // TODO: extract this part!
  $effect(() => {
    // TODO: HOLY MOLY! changing the order of the initialized breaks effect subscriptions
    if (resizeObserver && (!initialized || nodeRef !== prevNodeRef)) {
      prevNodeRef && resizeObserver.unobserve(prevNodeRef);
      nodeRef && resizeObserver.observe(nodeRef);
      prevNodeRef = nodeRef;
    }
  });

  onDestroy(() => {
    if (prevNodeRef) {
      resizeObserver?.unobserve(prevNodeRef);
    }
  });

  function onSelectNodeHandler(event: MouseEvent | TouchEvent) {
    if (selectable && (!get(selectNodesOnDrag) || !draggable || get(nodeDragThreshold) > 0)) {
      // this handler gets called by XYDrag on drag start when selectNodesOnDrag=true
      // here we only need to call it when selectNodesOnDrag=false
      handleNodeSelection(id);
    }

    onnodeclick?.({ node: node.internals.userNode, event });
  }
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
{#if !hidden}
  <div
    use:drag={{
      nodeId: id,
      isSelectable: selectable,
      disabled: false,
      handleSelector: dragHandle,
      noDragClass: 'nodrag',
      nodeClickDistance,
      onNodeMouseDown: handleNodeSelection,
      onDrag: (event, _, targetNode, nodes) => {
        onnodedrag?.({ event, targetNode, nodes });
      },
      onDragStart: (event, _, targetNode, nodes) => {
        onnodedragstart?.({ event, targetNode, nodes });
      },
      onDragStop: (event, _, targetNode, nodes) => {
        onnodedragstop?.({ event, targetNode, nodes });
      },
      store
    }}
    bind:this={nodeRef}
    data-id={id}
    class={cc(['svelte-flow__node', `svelte-flow__node-${type}`, className])}
    class:dragging
    class:selected
    class:draggable
    class:connectable
    class:selectable
    class:nopan={draggable}
    class:parent={isParent}
    style:z-index={zIndex}
    style:transform="translate({positionX}px, {positionY}px)"
    style:visibility={initialized ? 'visible' : 'hidden'}
    style="{style ?? ''};{inlineStyleDimensions.width}{inlineStyleDimensions.height}"
    onclick={onSelectNodeHandler}
    onmouseenter={onnodemouseenter ? (event) => onnodemouseenter({ node, event }) : undefined}
    onmouseleave={onnodemouseleave ? (event) => onnodemouseleave({ node, event }) : undefined}
    onmousemove={onnodemousemove ? (event) => onnodemousemove({ node, event }) : undefined}
    oncontextmenu={onnodecontextmenu ? (event) => onnodecontextmenu({ node, event }) : undefined}
  >
    <NodeComponent
      {data}
      {id}
      {selected}
      {selectable}
      {deletable}
      {sourcePosition}
      {targetPosition}
      {zIndex}
      {dragging}
      {draggable}
      {dragHandle}
      {parentId}
      {type}
      isConnectable={connectable}
      positionAbsoluteX={positionX}
      positionAbsoluteY={positionY}
      {width}
      {height}
    />
  </div>
{/if}
