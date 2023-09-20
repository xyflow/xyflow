<script lang="ts">
  import { onMount, hasContext } from 'svelte';
  import cc from 'classcat';
  import { PanOnScrollMode, type Viewport } from '@xyflow/system';

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
  import { key, useStore, createStoreContext } from '$lib/store';
  import type { SvelteFlowProps } from './types';
  import { updateStore, updateStoreByKeys, type UpdatableStoreProps } from './utils';

  type $$Props = SvelteFlowProps;

  export let id = '1';
  export let nodes: $$Props['nodes'];
  export let edges: $$Props['edges'];
  export let fitView: $$Props['fitView'] = undefined;
  export let minZoom: $$Props['minZoom'] = undefined;
  export let maxZoom: $$Props['maxZoom'] = undefined;
  export let initialViewport: Viewport = { x: 0, y: 0, zoom: 1 };
  export let nodeTypes: $$Props['nodeTypes'] = undefined;
  export let edgeTypes: $$Props['edgeTypes'] = undefined;
  export let selectionKey: $$Props['selectionKey'] = undefined;
  export let selectionMode: $$Props['selectionMode'] = undefined;
  export let panActivationKey: $$Props['panActivationKey'] = undefined;
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
  export let onlyRenderVisibleElements: $$Props['onlyRenderVisibleElements'] = undefined;
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

  const store = hasContext(key) ? useStore() : createStoreContext();

  onMount(() => {
    const { width, height } = domNode.getBoundingClientRect();
    store.width.set(width);
    store.height.set(height);
    store.domNode.set(domNode);

    store.syncNodeStores(nodes);
    store.syncEdgeStores(edges);

    if (fitView !== undefined) {
      store.fitViewOnInit.set(fitView);
    }

    updateStore(store, {
      nodeTypes,
      edgeTypes,
      minZoom,
      maxZoom,
      translateExtent
    });

    return () => {
      store.reset();
    };
  });

  // this updates the store for simple changes
  // where the prop names equals the store name
  $: {
    const updatableProps: UpdatableStoreProps = {
      flowId: id,
      connectionLineType,
      connectionRadius,
      selectionMode,
      snapGrid,
      defaultMarkerColor,
      nodesDraggable,
      nodesConnectable,
      elementsSelectable,
      onlyRenderVisibleElements,
      isValidConnection
    };

    updateStoreByKeys(store, updatableProps);
  }

  $: updateStore(store, {
    nodeTypes,
    edgeTypes,
    minZoom,
    maxZoom,
    translateExtent
  });
</script>

<div
  bind:this={domNode}
  {style}
  class={cc(['svelte-flow', className])}
  data-testid="svelte-flow__wrapper"
  on:dragover
  on:drop
  {...$$restProps}
  role="application"
>
  <KeyHandler {selectionKey} {deleteKey} {panActivationKey} />
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
    <Pane on:paneclick {panOnDrag}>
      <ViewportComponent>
        <EdgeRenderer on:edgeclick />
        <ConnectionLine />
        <div class="svelte-flow__edgelabel-renderer" />
        <NodeRenderer
          on:nodeclick
          on:nodemouseenter
          on:nodemousemove
          on:nodemouseleave
          on:connectstart
          on:connect
          on:connectend
          on:nodedrag
          on:nodedragstart
          on:nodedragstop
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

    background-color: var(--background-color, var(--background-color-default));
  }

  :root {
    --background-color-default: #fff;
    --background-pattern-color-default: #ddd;

    --minimap-mask-color-default: rgb(240, 240, 240, 0.6);
    --minimap-mask-stroke-color-default: none;
    --minimap-mask-stroke-width-default: 1;

    --controls-button-background-color-default: #fefefe;
    --controls-button-background-color-hover-default: #f4f4f4;
    --controls-button-color-default: inherit;
    --controls-button-color-hover-default: inherit;
    --controls-button-border-color-default: #eee;
  }
</style>
