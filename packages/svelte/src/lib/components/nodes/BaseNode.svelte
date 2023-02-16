<script lang="ts">
	import { onMount, setContext } from 'svelte';
  import type { XYPosition } from '@reactflow/system';

  import drag  from '$lib/hooks/drag'
	import { useStore } from '$lib/store';
	import DefaultNode from './DefaultNode.svelte';

  export let id: string;
  export let positionAbsolute: XYPosition = { x: 0, y: 0 };
  export let dragging: boolean = false;
  export let data: any = {};
  export let resizeObserver: ResizeObserver | null = null;
  export let style: any = {};

  let nodeRef: HTMLDivElement;

  const { nodesStore, transformStore, updateNodePositions } = useStore();

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
  class:dragging={dragging}
  bind:this={nodeRef}
  style="transform: translate({positionAbsolute.x}px, {positionAbsolute.y}px);"
  data-id={id}
>
  <svelte:component this={DefaultNode} data={data} />
</div>

<style>
  .react-flow__node {
    padding: 10px;
    border-radius: 3px;
    width: 50px;
    font-size: 12px;
    color: #222;
    text-align: center;
    border-width: 1px;
    border-style: solid;
    border-color: #1a192b;
    background-color: white;
    position: absolute;
    cursor: grab; 
  }

  .dragging {
    cursor: grabbing;
  }
</style>