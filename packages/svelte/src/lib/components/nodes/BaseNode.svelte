<script lang="ts">
	import { onMount, setContext, SvelteComponentTyped } from 'svelte';
  import { type XYPosition, Position } from '@reactflow/system';
  
  import drag  from '$lib/actions/drag'
	import { useStore } from '$lib/store';
	import DefaultNode from './DefaultNode.svelte';
	import type { NodeProps } from '$lib/types';

  export let id: NodeProps['id'];
  export let data: NodeProps['data'] = {};
  export let selected: NodeProps['selected'] = false;
  export let positionAbsolute: XYPosition = { x: 0, y: 0 };
  export let position: XYPosition = { x: 0, y: 0 };
  export let dragging: boolean = false;
  export let resizeObserver: ResizeObserver | null = null;
  export let style: any = {};
  export let width: number = 0;
  export let height: number = 0;
  export let type: string = 'default';
  export let sourcePosition: Position = Position.Bottom;
  export let targetPosition: Position = Position.Top;

  let nodeRef: HTMLDivElement;
  
  const { nodesStore, transformStore, updateNodePositions, nodeTypesStore } = useStore();
  const nodeComponent: typeof SvelteComponentTyped<NodeProps> = $nodeTypesStore[type] || DefaultNode;

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
  class="react-flow__node"
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