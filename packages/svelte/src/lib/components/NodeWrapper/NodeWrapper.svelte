<script lang="ts">
  import { setContext, onDestroy } from 'svelte';
  import cc from 'classcat';
  import { errorMessages, Position } from '@xyflow/system';

  import drag from '$lib/actions/drag';
  import { useStore } from '$lib/store';
  import DefaultNode from '$lib/components/nodes/DefaultNode.svelte';
  import { getNodeInlineStyleDimensions } from './utils';

  import type { ConnectableContext, NodeWrapperProps } from './types';
  import type { NodeEvents } from '$lib/types';

  let {
    node,
    id,
    data = {},
    selected = false,
    draggable,
    selectable,
    connectable = true,
    hidden = false,
    dragging = false,
    resizeObserver = null,
    style,
    class: className,
    type = 'default',
    isParent = false,
    positionX,
    positionY,
    positionOriginX,
    positionOriginY,
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

  let nodeRef: HTMLDivElement | null = $state(null);
  let prevNodeRef: HTMLDivElement | null = null;

  let prevType: string | undefined;
  let prevSourcePosition: Position | undefined;
  let prevTargetPosition: Position | undefined;

  if (process.env.NODE_ENV === 'development') {
    $effect(() => {
      const valid = !!store.nodeTypes[type];
      if (!valid) {
        console.warn('003', errorMessages['error003'](type!));
      }
    });
  }

  let nodeComponent = $derived(store.nodeTypes[type] || DefaultNode);

  let connectableContext: ConnectableContext = {
    get value() {
      return connectable;
    }
  };

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

  setContext('svelteflow__node_id', id);
  setContext('svelteflow__node_connectable', connectableContext);

  // TODO: extract this part!
  $effect(() => {
    // console.log(initialized);
    // TODO: HOLY MOLY! changing the order of the initialized breaks effect subscriptions
    if (resizeObserver && (!initialized || nodeRef !== prevNodeRef)) {
      prevNodeRef && resizeObserver.unobserve(prevNodeRef);
      nodeRef && resizeObserver.observe(nodeRef);
      prevNodeRef = nodeRef;
    }
  });

  $effect(() => {
    // if type, sourcePosition or targetPosition changes,
    // we need to re-calculate the handle positions
    if (!nodeRef) return;

    if (
      (prevType && type !== prevType) ||
      (prevSourcePosition && sourcePosition !== prevSourcePosition) ||
      (prevTargetPosition && targetPosition !== prevTargetPosition)
    ) {
      requestAnimationFrame(() =>
        store.updateNodeInternals(
          new Map([
            [
              id,
              {
                id,
                nodeElement: nodeRef!,
                forceUpdate: true
              }
            ]
          ])
        )
      );
    }

    prevType = type;
    prevSourcePosition = sourcePosition;
    prevTargetPosition = targetPosition;
  });

  onDestroy(() => {
    if (prevNodeRef) {
      resizeObserver?.unobserve(prevNodeRef);
    }
  });

  function onSelectNodeHandler(event: MouseEvent | TouchEvent) {
    if (selectable && (!store.selectNodesOnDrag || !draggable || store.nodeDragThreshold > 0)) {
      // this handler gets called by XYDrag on drag start when selectNodesOnDrag=true
      // here we only need to call it when selectNodesOnDrag=false
      store.handleNodeSelection(id);
    }

    onnodeclick?.({ node, event });
  }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
{#if !hidden}
  <div
    use:drag={{
      nodeId: id,
      isSelectable: selectable,
      disabled: false,
      handleSelector: dragHandle,
      noDragClass: 'nodrag',
      onNodeMouseDown: store.handleNodeSelection,
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
    style:transform="translate({positionOriginX}px, {positionOriginY}px)"
    style:visibility={initialized ? 'visible' : 'hidden'}
    style="{style ?? ''};{inlineStyleDimensions.width}{inlineStyleDimensions.height}"
    onclick={onSelectNodeHandler}
    onmouseenter={(event) => {
      onnodemouseenter?.({ node, event });
    }}
    onmouseleave={(event) => {
      onnodemouseleave?.({ node, event });
    }}
    onmousemove={(event) => {
      onnodemousemove?.({ node, event });
    }}
    oncontextmenu={(event) => {
      onnodecontextmenu?.({ node, event });
    }}
  >
    <svelte:component
      this={nodeComponent}
      {data}
      {id}
      {selected}
      {sourcePosition}
      {targetPosition}
      {zIndex}
      {dragging}
      {dragHandle}
      {type}
      isConnectable={connectable}
      positionAbsoluteX={positionX}
      positionAbsoluteY={positionY}
      {width}
      {height}
    />
  </div>
{/if}
