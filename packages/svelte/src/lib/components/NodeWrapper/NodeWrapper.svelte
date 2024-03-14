<svelte:options immutable />

<script lang="ts">
  import { createEventDispatcher, setContext, onDestroy } from 'svelte';
  import { get, writable } from 'svelte/store';
  import cc from 'classcat';
  import { errorMessages, Position } from '@xyflow/system';

  import drag from '$lib/actions/drag';
  import { useStore } from '$lib/store';
  import DefaultNode from '$lib/components/nodes/DefaultNode.svelte';
  import type { NodeWrapperProps } from './types';
  import type { Node } from '$lib/types';
  import { getNodeInlineStyleDimensions } from './utils';
  import { createNodeEventDispatcher } from '$lib';

  interface $$Props extends NodeWrapperProps {}

  export let node: NodeWrapperProps['node'];
  export let id: NodeWrapperProps['id'];
  export let data: NodeWrapperProps['data'] = {};
  export let selected: NodeWrapperProps['selected'] = false;
  export let draggable: NodeWrapperProps['draggable'] = undefined;
  export let selectable: NodeWrapperProps['selectable'] = undefined;
  export let connectable: NodeWrapperProps['connectable'] = true;
  export let hidden: NodeWrapperProps['hidden'] = false;
  export let dragging: boolean = false;
  export let resizeObserver: NodeWrapperProps['resizeObserver'] = null;
  export let style: NodeWrapperProps['style'] = undefined;
  export let type: NodeWrapperProps['type'] = 'default';
  export let isParent: NodeWrapperProps['isParent'] = false;
  export let positionX: NodeWrapperProps['positionX'];
  export let positionY: NodeWrapperProps['positionY'];
  export let positionOriginX: NodeWrapperProps['positionOriginX'];
  export let positionOriginY: NodeWrapperProps['positionOriginY'];
  export let sourcePosition: NodeWrapperProps['sourcePosition'] = undefined;
  export let targetPosition: NodeWrapperProps['targetPosition'] = undefined;
  export let zIndex: NodeWrapperProps['zIndex'];
  export let computedWidth: NodeWrapperProps['computedWidth'] = undefined;
  export let computedHeight: NodeWrapperProps['computedHeight'] = undefined;
  export let initialWidth: NodeWrapperProps['initialWidth'] = undefined;
  export let initialHeight: NodeWrapperProps['initialHeight'] = undefined;
  export let width: NodeWrapperProps['width'] = undefined;
  export let height: NodeWrapperProps['height'] = undefined;
  export let dragHandle: NodeWrapperProps['dragHandle'] = undefined;
  export let initialized: NodeWrapperProps['initialized'] = false;
  let className: string = '';
  export { className as class };

  const store = useStore();
  const {
    nodeTypes,
    nodeDragThreshold,
    selectNodesOnDrag,
    handleNodeSelection,
    updateNodeDimensions
  } = store;
  const nodeType = type || 'default';

  let nodeRef: HTMLDivElement;
  let prevNodeRef: HTMLDivElement;

  const nodeTypeValid = !!$nodeTypes[nodeType];

  if (!nodeTypeValid) {
    console.warn('003', errorMessages['error003'](type!));
  }

  const nodeComponent = $nodeTypes[nodeType] || DefaultNode;
  const dispatchNodeEvent = createNodeEventDispatcher();
  const connectableStore = writable(connectable);
  let prevType: string | undefined = undefined;
  let prevSourcePosition: Position | undefined = undefined;
  let prevTargetPosition: Position | undefined = undefined;

  $: inlineStyleDimensions = getNodeInlineStyleDimensions({
    width,
    height,
    initialWidth,
    initialHeight,
    computedWidth,
    computedHeight
  });

  $: {
    connectableStore.set(!!connectable);
  }

  $: {
    // if type, sourcePosition or targetPosition changes,
    // we need to re-calculate the handle positions
    const doUpdate =
      (prevType && nodeType !== prevType) ||
      (prevSourcePosition && sourcePosition !== prevSourcePosition) ||
      (prevTargetPosition && targetPosition !== prevTargetPosition);

    if (doUpdate) {
      requestAnimationFrame(() =>
        updateNodeDimensions(
          new Map([
            [
              id,
              {
                id,
                nodeElement: nodeRef,
                forceUpdate: true
              }
            ]
          ])
        )
      );
    }

    prevType = nodeType;
    prevSourcePosition = sourcePosition;
    prevTargetPosition = targetPosition;
  }

  setContext('svelteflow__node_id', id);
  setContext('svelteflow__node_connectable', connectableStore);

  $: {
    if (nodeRef) {
      if (!prevNodeRef) {
        resizeObserver?.observe(nodeRef);
        prevNodeRef = nodeRef;
      } else if (prevNodeRef !== nodeRef || (!computedWidth && !computedHeight)) {
        resizeObserver?.unobserve(prevNodeRef);
        resizeObserver?.observe(nodeRef);
        prevNodeRef = nodeRef;
      }
    }
  }

  onDestroy(() => {
    resizeObserver?.unobserve(nodeRef);
  });

  function onSelectNodeHandler(event: MouseEvent | TouchEvent) {
    if (selectable && (!get(selectNodesOnDrag) || !draggable || get(nodeDragThreshold) > 0)) {
      // this handler gets called by XYDrag on drag start when selectNodesOnDrag=true
      // here we only need to call it when selectNodesOnDrag=false
      handleNodeSelection(id);
    }

    dispatchNodeEvent('nodeclick', { node, event });
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
      onNodeMouseDown: handleNodeSelection,
      onDrag: (event, _, targetNode, nodes) => {
        dispatchNodeEvent('nodedrag', { event, targetNode, nodes });
      },
      onDragStart: (event, _, targetNode, nodes) => {
        dispatchNodeEvent('nodedragstart', { event, targetNode, nodes });
      },
      onDragStop: (event, _, targetNode, nodes) => {
        dispatchNodeEvent('nodedragstop', { event, targetNode, nodes });
      },
      store
    }}
    bind:this={nodeRef}
    data-id={id}
    class={cc(['svelte-flow__node', `svelte-flow__node-${nodeType}`, className])}
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
    on:click={onSelectNodeHandler}
    on:mouseenter={(event) => dispatchNodeEvent('nodemouseenter', { node, event })}
    on:mouseleave={(event) => dispatchNodeEvent('nodemouseleave', { node, event })}
    on:mousemove={(event) => dispatchNodeEvent('nodemousemove', { node, event })}
    on:contextmenu={(event) => dispatchNodeEvent('nodecontextmenu', { node, event })}
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
      type={nodeType}
      isConnectable={$connectableStore}
      positionAbsoluteX={positionX}
      positionAbsoluteY={positionY}
      {width}
      {height}
    />
  </div>
{/if}
