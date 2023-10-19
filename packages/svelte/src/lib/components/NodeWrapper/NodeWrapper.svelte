<svelte:options immutable />

<script lang="ts">
  import {
    createEventDispatcher,
    onMount,
    setContext,
    SvelteComponent,
    type ComponentType
  } from 'svelte';
  import cc from 'classcat';
  import { get, writable } from 'svelte/store';
  import { errorMessages, Position, type NodeProps } from '@xyflow/system';

  import drag from '$lib/actions/drag';
  import { useStore } from '$lib/store';
  import DefaultNode from '$lib/components/nodes/DefaultNode.svelte';
  import type { NodeWrapperProps } from './types';
  import type { Node } from '$lib/types';

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
  export let positionAbsolute: NodeWrapperProps['positionAbsolute'] = undefined;
  export let positionOrigin: NodeWrapperProps['positionOrigin'] = undefined;
  export let sourcePosition: NodeWrapperProps['sourcePosition'] = undefined;
  export let targetPosition: NodeWrapperProps['targetPosition'] = undefined;
  export let zIndex: NodeWrapperProps['zIndex'];
  export let dragHandle: NodeWrapperProps['dragHandle'] = undefined;
  let className: string = '';
  export { className as class };

  const store = useStore();
  const { nodeTypes, nodeDragThreshold, addSelectedNodes, updateNodeDimensions } = store;
  const nodeType = type || 'default';

  let nodeRef: HTMLDivElement;
  const nodeTypeValid = !!$nodeTypes[nodeType];

  if (!nodeTypeValid) {
    console.warn('003', errorMessages['error003'](type!));
  }

  const nodeComponent: ComponentType<SvelteComponent<NodeProps>> =
    $nodeTypes[nodeType] || DefaultNode;
  const selectNodesOnDrag = false;
  const dispatch = createEventDispatcher<{
    nodeclick: { node: Node; event: MouseEvent | TouchEvent };
    nodecontextmenu: { node: Node; event: MouseEvent | TouchEvent };
    nodedrag: { node: Node; nodes: Node[]; event: MouseEvent | TouchEvent };
    nodedragstart: { node: Node; nodes: Node[]; event: MouseEvent | TouchEvent };
    nodedragstop: { node: Node; nodes: Node[]; event: MouseEvent | TouchEvent };
    nodemouseenter: { node: Node; event: MouseEvent | TouchEvent };
    nodemouseleave: { node: Node; event: MouseEvent | TouchEvent };
    nodemousemove: { node: Node; event: MouseEvent | TouchEvent };
  }>();
  const connectableStore = writable(connectable);
  let prevType: string | undefined = undefined;
  let prevSourcePosition: Position | undefined = undefined;
  let prevTargetPosition: Position | undefined = undefined;

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
        updateNodeDimensions([
          {
            id,
            nodeElement: nodeRef,
            forceUpdate: true
          }
        ])
      );
    }

    prevType = nodeType;
    prevSourcePosition = sourcePosition;
    prevTargetPosition = targetPosition;
  }

  setContext('svelteflow__node_id', id);
  setContext('svelteflow__node_connectable', connectableStore);

  onMount(() => {
    resizeObserver?.observe(nodeRef);

    return () => {
      resizeObserver?.unobserve(nodeRef);
    };
  });

  function onSelectNodeHandler(event: MouseEvent | TouchEvent) {
    if (selectable && (!selectNodesOnDrag || !draggable || get(nodeDragThreshold) > 0)) {
      // this handler gets called within the drag start event when selectNodesOnDrag=true
      addSelectedNodes([id]);
    }

    // @todo: support multiselection
    dispatch('nodeclick', { node, event });
  }

  // @todo: add selectable state
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
      onDrag: (event, _, node, nodes) => {
        dispatch('nodedrag', { event, node, nodes });
      },
      onDragStart: (event, _, node, nodes) => {
        dispatch('nodedragstart', { event, node, nodes });
      },
      onDragStop: (event, _, node, nodes) => {
        dispatch('nodedragstop', { event, node, nodes });
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
    style:transform="translate({positionOrigin?.x ?? 0}px, {positionOrigin?.y ?? 0}px)"
    {style}
    on:click={onSelectNodeHandler}
    on:mouseenter={(event) => dispatch('nodemouseenter', { node, event })}
    on:mouseleave={(event) => dispatch('nodemouseleave', { node, event })}
    on:mousemove={(event) => dispatch('nodemousemove', { node, event })}
    on:contextmenu={(event) => dispatch('nodecontextmenu', { node, event })}
  >
    <svelte:component
      this={nodeComponent}
      {data}
      {id}
      {selected}
      {sourcePosition}
      {targetPosition}
      {type}
      {zIndex}
      {dragging}
      {dragHandle}
      isConnectable={connectable}
      xPos={positionAbsolute?.x ?? 0}
      yPos={positionAbsolute?.y ?? 0}
      on:connectstart
      on:connect
      on:connectend
    />
  </div>
{/if}
