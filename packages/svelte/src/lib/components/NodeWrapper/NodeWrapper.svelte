<script lang="ts">
  import {
    createEventDispatcher,
    onMount,
    setContext,
    SvelteComponent,
    type ComponentType
  } from 'svelte';
  import cc from 'classcat';
  import { errorMessages, type NodeProps } from '@xyflow/system';

  import drag from '$lib/actions/drag';
  import { useStore } from '$lib/store';
  import DefaultNode from '$lib/components/nodes/DefaultNode.svelte';
  import type { NodeWrapperProps } from './types';
  import { writable } from 'svelte/store';

  interface $$Props extends NodeWrapperProps {}

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
  const { nodes, nodeTypes, addSelectedNodes } = store;

  let nodeRef: HTMLDivElement;
  const nodeTypeValid = !!$nodeTypes[type!];

  if (!nodeTypeValid) {
    console.warn('003', errorMessages['error003'](type!));
    type = 'default';
  }

  const nodeComponent: ComponentType<SvelteComponent<NodeProps>> = $nodeTypes[type!] || DefaultNode;
  const selectNodesOnDrag = false;
  const dispatch = createEventDispatcher();
  const connectableStore = writable(connectable);

  $: {
    connectableStore.set(!!connectable);
  }

  setContext('svelteflow__node_id', id);
  setContext('svelteflow__node_connectable', connectableStore);

  onMount(() => {
    resizeObserver?.observe(nodeRef);

    return () => {
      resizeObserver?.unobserve(nodeRef);
    };
  });

  function dispatchEvent(eventName: string, event?: MouseEvent | TouchEvent) {
    const node = $nodes.find((n) => n.id === id);
    dispatch(eventName, { node, event });
  }

  function onSelectNodeHandler(event: MouseEvent | TouchEvent) {
    if (selectable && (!selectNodesOnDrag || !draggable)) {
      // this handler gets called within the drag start event when selectNodesOnDrag=true
      addSelectedNodes([id]);
    }

    // @todo: support multiselection
    dispatchEvent('nodeclick', event);
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
      store
    }}
    bind:this={nodeRef}
    data-id={id}
    class={cc(['svelte-flow__node', `svelte-flow__node-${type || 'default'}`, className])}
    class:dragging
    class:selected
    class:draggable
    class:connectable
    class:selectable
    class:parent={isParent}
    style:z-index={zIndex}
    style:transform="translate({positionOrigin?.x ?? 0}px, {positionOrigin?.y ?? 0}px)"
    {style}
    on:click={onSelectNodeHandler}
    on:mouseenter={(event) => dispatchEvent('nodemouseenter', event)}
    on:mouseleave={(event) => dispatchEvent('nodemouseleave', event)}
    on:mousemove={(event) => dispatchEvent('nodemousemove', event)}
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
