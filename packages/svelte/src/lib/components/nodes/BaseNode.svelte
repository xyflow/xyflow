<script lang="ts">
	import { onMount, setContext, SvelteComponentTyped } from 'svelte';
  import cc from 'classcat';
  import { type XYPosition, Position } from '@reactflow/system';
  
  import drag  from '$lib/actions/drag'
	import { useStore } from '$lib/store';
	import DefaultNode from './DefaultNode.svelte';
	import type { WrapNodeProps, NodeProps } from '$lib/types';

  interface $$Props extends WrapNodeProps {}

  export let id: WrapNodeProps['id'];
  export let data: WrapNodeProps['data'] = {};
  export let selected: WrapNodeProps['selected'] = false;
  export let positionAbsolute: XYPosition = { x: 0, y: 0 };
  export let position: XYPosition = { x: 0, y: 0 };
  export let dragging: boolean = false;
  export let resizeObserver: WrapNodeProps['resizeObserver'] = null;
  export let style: WrapNodeProps['style'] = undefined;
  export let width: WrapNodeProps['width'] = undefined;
  export let height: WrapNodeProps['height'] = undefined;
  export let type: WrapNodeProps['type'] = 'default';
  export let sourcePosition: WrapNodeProps['sourcePosition'] = Position.Bottom;
  export let targetPosition: WrapNodeProps['targetPosition'] = Position.Top;

  let className: string = '';
  export { className as class };

  let nodeRef: HTMLDivElement;
  
  const { nodesStore, transformStore, updateNodePositions, nodeTypesStore } = useStore();
  const nodeComponent: typeof SvelteComponentTyped<Partial<NodeProps>> = $nodeTypesStore[type] || DefaultNode;

  setContext('rf_nodeid', id);

  onMount(() => {
    resizeObserver?.observe(nodeRef);

    return () => {
      resizeObserver?.unobserve(nodeRef);
    }
  });
</script>

<div
  use:drag={{ nodeId: id, nodesStore, transformStore, updateNodePositions }}
  class={cc(['react-flow__node', `react-flow__node-${type}`, className])}
  class:initializing={!width && !height}
  class:dragging={dragging}
  bind:this={nodeRef}
  style:transform={`translate(${positionAbsolute.x}px, ${positionAbsolute.y}px)`}
  {style}
  data-id={id}
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
  />
</div>

<style>
  .react-flow__node {
    border-radius: 3px;
    font-size: 12px;
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

  .dragging {
    cursor: grabbing;
  }

  .initializing {
    visibility: hidden;
  }
</style>