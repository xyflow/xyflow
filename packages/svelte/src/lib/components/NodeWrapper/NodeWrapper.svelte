<script lang="ts">
  import { createEventDispatcher, onMount, setContext, SvelteComponentTyped } from 'svelte';
  import cc from 'classcat';
  import { type XYPosition, Position, errorMessages } from '@reactflow/system';

  import drag from '$lib/actions/drag';
  import { useStore } from '$lib/store';
  import DefaultNode from '$lib/components/nodes/DefaultNode.svelte';
  import type { NodeProps } from '$lib/types';
  import type { NodeWrapperProps } from './types';

  interface $$Props extends NodeWrapperProps {}

  export let id: NodeWrapperProps['id'];
  export let data: NodeWrapperProps['data'] = {};
  export let selected: NodeWrapperProps['selected'] = false;
  export let positionAbsolute: XYPosition = { x: 0, y: 0 };
  export let position: XYPosition = { x: 0, y: 0 };
  export let dragging: boolean = false;
  export let resizeObserver: NodeWrapperProps['resizeObserver'] = null;
  export let style: NodeWrapperProps['style'] = undefined;
  export let width: NodeWrapperProps['width'] = undefined;
  export let height: NodeWrapperProps['height'] = undefined;
  export let type: NodeWrapperProps['type'] = 'default';
  export let sourcePosition: NodeWrapperProps['sourcePosition'] = Position.Bottom
  export let targetPosition: NodeWrapperProps['targetPosition'] = Position.Top;

  let className: string = '';
  export { className as class };

  const { nodes, transform, nodeTypes, updateNodePositions, addSelectedNodes } = useStore();

  let nodeRef: HTMLDivElement;
  const nodeTypeValid = !!$nodeTypes[type!];

  if (!nodeTypeValid) {
    console.warn('003', errorMessages['003'](type!));
    type = 'default';
  }

  const nodeComponent: typeof SvelteComponentTyped<Partial<NodeProps>> =
    $nodeTypes[type!] || DefaultNode;
  const isSelectable = true;
  const selectNodesOnDrag = false;
  const isDraggable = true;
  const dispatch = createEventDispatcher();

  setContext('rf_nodeid', id);

  onMount(() => {
    resizeObserver?.observe(nodeRef);

    return () => {
      resizeObserver?.unobserve(nodeRef);
    };
  });

  function dispatchEvent(eventName: string) {
    const node = $nodes.find(n => n.id === id);
    dispatch(eventName, node);
  }

  function onSelectNodeHandler(event: MouseEvent) {
    if (isSelectable && (!selectNodesOnDrag || !isDraggable)) {
      // this handler gets called within the drag start event when selectNodesOnDrag=true
      addSelectedNodes([id]);
    }

    dispatchEvent('node:click')
  }
</script>

<div
  use:drag={{ nodeId: id, nodes, transform, updateNodePositions }}
  data-id={id}
  class={cc(['svelte-flow__node', `svelte-flow__node-${type}`, className])}
  class:initializing={!width && !height}
  class:dragging
  class:selected
  bind:this={nodeRef}
  style:transform={`translate(${positionAbsolute.x}px, ${positionAbsolute.y}px)`}
  {style}
  on:click={onSelectNodeHandler}
  on:mouseenter={() => dispatchEvent('node:mouseenter')}
  on:mouseleave={() => dispatchEvent('node:mouseleave')}
  on:mousemove={() => dispatchEvent('node:mousemove')}
>
  <svelte:component
    this={nodeComponent}
    {data}
    {id}
    {selected}
    {sourcePosition}
    {targetPosition}
    isConnectable={true}
    xPos={positionAbsolute.x}
    yPos={positionAbsolute.y}
    on:connect:start
    on:connect
    on:connect:end
  />
</div>

<style>
  .svelte-flow__node {
    border-radius: 3px;
    color: #222;
    text-align: center;
    border-width: 1px;
    border-style: solid;
    border-color: #1a192b;
    background-color: white;
    position: absolute;
    cursor: grab;
    pointer-events: all;
    user-select: none;
  }

  .selected {
    outline: none;
    box-shadow: 0 0 0 0.5px #1a192b;
  }

  .dragging {
    cursor: grabbing;
  }

  .initializing {
    visibility: hidden;
  }
</style>
