<script lang="ts">
  import { onMount } from 'svelte';
  import cc from 'classcat';
  import { PanOnScrollMode, type CoordinateExtent, type Viewport } from '@reactflow/system';

  import { Zoom } from '$lib/container/Zoom';
  import { Pane } from '$lib/container/Pane';
  import { Viewport as ViewportComponent } from '$lib/container/Viewport';
  import { NodeRenderer } from '$lib/container/NodeRenderer';
  import { EdgeRenderer } from '$lib/container/EdgeRenderer';
  import { UserSelection } from '$lib/components/UserSelection';
  import { NodeSelection } from '$lib/components/NodeSelection';
  import { KeyHandler } from '$lib/components/KeyHandler';
  import { ConnectionLine } from '$lib/components/ConnectionLine';
  import { Attribution } from '$lib/components/Attribution';
  import { useStore } from '$lib/store';
  import type { SvelteFlowProps } from './types';
    import type { EdgeTypes, NodeTypes } from '$lib/types';

  type $$Props = SvelteFlowProps;

  export let id = '1';
  export let fitView: $$Props['fitView'] = undefined;
  export let minZoom: $$Props['minZoom'] = undefined;
  export let maxZoom: $$Props['maxZoom'] = undefined;
  export let initialViewport: Viewport = { x:0, y: 0, zoom: 1 };
  export let nodeTypes: $$Props['nodeTypes'] = undefined;
  export let edgeTypes: $$Props['edgeTypes'] = undefined;
  export let selectionKey: $$Props['selectionKey'] = undefined;
  export let selectionMode: $$Props['selectionMode'] = undefined;
  export let nodesDraggable: $$Props['nodesDraggable'] = undefined;
  export let nodesConnectable: $$Props['nodesConnectable'] = undefined;
  export let elementsSelectable: $$Props['elementsSelectable'] = undefined;
  export let snapGrid: $$Props['snapGrid'] = undefined;
  export let deleteKey: $$Props['deleteKey'] = undefined;
  export let connectionRadius: $$Props['connectionRadius'] = undefined;
  export let connectionLineType: $$Props['connectionLineType'] = undefined;
  export let onMoveStart: $$Props['onMoveStart'] = undefined;
  export let onMove: $$Props['onMove'] = undefined;
  export let onMoveEnd: $$Props['onMoveEnd'] = undefined;
  export let isValidConnection: $$Props['isValidConnection'] = undefined;
  export let translateExtent: $$Props['translateExtent'] = undefined;
  export let panOnScrollMode: PanOnScrollMode = PanOnScrollMode.Free;
  export let preventScrolling: boolean = true;
  export let zoomOnScroll: boolean = true;
  export let zoomOnDoubleClick: boolean = true;
  export let zoomOnPinch: boolean = true;
  export let panOnScroll: boolean = false;
  export let panOnDrag: boolean | number[] = true;

  export let defaultMarkerColor = '#b1b1b7';

  export let style: $$Props['style'] = undefined;
  let className: $$Props['class'] = undefined;
  export { className as class };
  let domNode: HTMLDivElement;
  
  $: flowId = id;
  const store = useStore();

  onMount(() => {
    const { width, height } = domNode.getBoundingClientRect();
    store.width.set(width);
    store.height.set(height);
    store.domNode.set(domNode);

    updateStore({
      nodeTypes,
      edgeTypes,
      minZoom,
      maxZoom,
      translateExtent,
      fitView
    });

    return () => {
      store.reset();
    }
  });

  $: {
    const updatableProps = {
      flowId,
      connectionLineType,
      connectionRadius,
      selectionMode,
      snapGrid,
      isValidConnection,
      defaultMarkerColor,
      nodesDraggable,
      nodesConnectable,
      elementsSelectable,
    };

    Object.keys(updatableProps).forEach(prop => {
      // @ts-ignore
      if (updatableProps[prop] !== undefined) {
        // @ts-ignore
        store[prop].set(updatableProps[prop]);
      }
    })
  }

  function updateStore({ nodeTypes, edgeTypes, minZoom, maxZoom, translateExtent, fitView }: {
    nodeTypes?: NodeTypes,
    edgeTypes?: EdgeTypes,
    minZoom?: number,
    maxZoom?: number,
    translateExtent?: CoordinateExtent,
    fitView?: boolean
  }) {
    if (nodeTypes !== undefined) {
     store.setNodeTypes(nodeTypes);
    }

    if (edgeTypes !== undefined) {
      store.setEdgeTypes(edgeTypes);
    }

    if (minZoom !== undefined) {
      store.setMinZoom(minZoom);
    }

    if (maxZoom !== undefined) {
      store.setMaxZoom(maxZoom);
    }

    if (translateExtent !== undefined) {
      store.setTranslateExtent(translateExtent)
    }

    if (fitView !== undefined) {
      store.fitViewOnInit.set(fitView);
    }
  }

  $: updateStore({
    nodeTypes,
    edgeTypes,
    minZoom,
    maxZoom,
    translateExtent,
    fitView
  })
</script>

<div
  bind:this={domNode}
  {style}
  class={cc(['svelte-flow', className])}
  data-testid="svelte-flow__wrapper"
  on:dragover
  on:drop
  {...$$restProps}
>
  <KeyHandler {selectionKey} {deleteKey} />
  <Zoom
    {initialViewport}
    {onMoveStart}
    {onMove}
    {onMoveEnd}
    {panOnScrollMode}
    {preventScrolling}
    {zoomOnScroll}
    {zoomOnDoubleClick}
    {zoomOnPinch}
    {panOnScroll}
    {panOnDrag}
  >
    <Pane on:pane:click {panOnDrag}>
      <ViewportComponent>
        <EdgeRenderer on:edge:click />
        <ConnectionLine />
        <div class="svelte-flow__edgelabel-renderer" />
        <NodeRenderer
          on:node:click
          on:node:mouseenter
          on:node:mousemove
          on:node:mouseleave
          on:connect:start
          on:connect
          on:connect:end
        />
        <NodeSelection />
      </ViewportComponent>
      <UserSelection />
    </Pane>
  </Zoom>
  <Attribution />
  <slot />
</div>

<style>
  .svelte-flow {
    width: 100%;
    height: 100%;
    overflow: hidden;
    position: relative;
    z-index: 0;
  }

  .svelte-flow :global(.svelte-flow__node-default),
  .svelte-flow :global(.svelte-flow__node-input),
  .svelte-flow :global(.svelte-flow__node-output) {
    padding: 10px;
  }

  .svelte-flow__edgelabel-renderer {
    position: absolute;
    width: 100%;
    height: 100%;
    pointer-events: none;
    user-select: none;
  }
</style>
