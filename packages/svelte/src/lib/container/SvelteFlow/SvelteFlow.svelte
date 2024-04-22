<script lang="ts">
  import { onMount, hasContext } from 'svelte';
  import { get } from 'svelte/store';
  import cc from 'classcat';
  import { ConnectionMode, PanOnScrollMode, type Viewport } from '@xyflow/system';

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
  import { useColorModeClass } from '$lib/hooks/useColorModeClass';

  let {
    id = '1',
    style,
    class: className,
    nodes,
    edges,
    nodeTypes,
    edgeTypes,
    fitView,
    fitViewOptions,
    minZoom,
    maxZoom,
    initialViewport = { x: 0, y: 0, zoom: 1 },
    viewport,
    selectionKey,
    selectionMode,
    panActivationKey,
    multiSelectionKey,
    zoomActivationKey,
    nodesDraggable,
    nodesConnectable,
    nodeDragThreshold,
    elementsSelectable,
    snapGrid,
    deleteKey,
    connectionRadius,
    connectionLineType,
    connectionMode = ConnectionMode.Strict,
    connectionLineStyle = '',
    connectionLineContainerStyle = '',
    onMoveStart,
    onMove,
    onMoveEnd,
    isValidConnection,
    translateExtent,
    onlyRenderVisibleElements,
    panOnScrollMode = PanOnScrollMode.Free,
    preventScrolling = true,
    zoomOnScroll = true,
    zoomOnDoubleClick = true,
    zoomOnPinch = true,
    panOnScroll = false,
    panOnDrag = true,
    selectionOnDrag,
    autoPanOnConnect = true,
    autoPanOnNodeDrag = true,
    onerror,
    ondelete,
    onedgecreate,
    attributionPosition,
    proOptions,
    defaultEdgeOptions,
    width,
    height,
    colorMode = 'light',
    onconnect,
    onconnectstart,
    onconnectend,
    onbeforedelete,
    oninit,
    defaultMarkerColor = '#b1b1b7',
    ...restProps
  }: SvelteFlowProps = $props();

  let domNode = $state<HTMLDivElement>();
  let clientWidth = $state<number>();
  let clientHeight = $state<number>();

  const store = hasContext(key)
    ? useStore()
    : createStoreContext({ nodes: get(nodes), edges: get(edges), width, height, fitView });

  onMount(() => {
    store.domNode.set(domNode!);

    store.syncNodeStores(nodes);
    store.syncEdgeStores(edges);
    store.syncViewport(viewport);

    if (fitView !== undefined) {
      store.fitViewOnInit.set(fitView);
    }

    if (fitViewOptions) {
      store.fitViewOptions.set(fitViewOptions);
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

  // Update width & height on resize
  $effect.pre(() => {
    if (clientWidth !== undefined && clientHeight !== undefined) {
      store.width.set(clientWidth);
      store.height.set(clientHeight);
    }
  });

  // Call oninit once when flow is intialized
  const { initialized } = store;
  let onInitCalled = false;
  $effect(() => {
    if (!onInitCalled && $initialized) {
      oninit?.();
      onInitCalled = true;
    }
  });

  // TODO: this is hacky use of derived.by
  // this updates the store for simple changes
  // where the prop names equals the store name
  let storeKeyUpdater = $derived.by(() => {
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
      isValidConnection,
      autoPanOnConnect,
      autoPanOnNodeDrag,
      onerror,
      ondelete,
      onedgecreate,
      connectionMode,
      nodeDragThreshold,
      onconnect,
      onconnectstart,
      onconnectend,
      onbeforedelete
    };

    updateStoreByKeys(store, updatableProps);
  });
  storeKeyUpdater;

  let storeUpdater = $derived.by(() => {
    updateStore(store, {
      nodeTypes,
      edgeTypes,
      minZoom,
      maxZoom,
      translateExtent
    });
  });
  storeUpdater;

  let colorModeClass = useColorModeClass(colorMode);
</script>

<div
  bind:this={domNode}
  bind:clientWidth
  bind:clientHeight
  {style}
  class={cc(['svelte-flow', className, $colorModeClass])}
  data-testid="svelte-flow__wrapper"
  on:dragover
  on:drop
  {...restProps}
  role="application"
>
  <KeyHandler
    {selectionKey}
    {deleteKey}
    {panActivationKey}
    {multiSelectionKey}
    {zoomActivationKey}
  />
  <Zoom
    {initialViewport}
    {onMoveStart}
    {onMove}
    {onMoveEnd}
    panOnScrollMode={panOnScrollMode === undefined ? PanOnScrollMode.Free : panOnScrollMode}
    preventScrolling={preventScrolling === undefined ? true : preventScrolling}
    zoomOnScroll={zoomOnScroll === undefined ? true : zoomOnScroll}
    zoomOnDoubleClick={zoomOnDoubleClick === undefined ? true : zoomOnDoubleClick}
    zoomOnPinch={zoomOnPinch === undefined ? true : zoomOnPinch}
    panOnScroll={panOnScroll === undefined ? false : panOnScroll}
    panOnDrag={panOnDrag === undefined ? true : panOnDrag}
  >
    <Pane
      on:paneclick
      on:panecontextmenu
      panOnDrag={panOnDrag === undefined ? true : panOnDrag}
      {selectionOnDrag}
    >
      <ViewportComponent>
        <EdgeRenderer on:edgeclick on:edgecontextmenu {defaultEdgeOptions} />
        <ConnectionLine
          containerStyle={connectionLineContainerStyle}
          style={connectionLineStyle}
          isCustomComponent={$$slots.connectionLine}
        >
          <slot name="connectionLine" slot="connectionLine" />
        </ConnectionLine>
        <div class="svelte-flow__edgelabel-renderer" />
        <div class="svelte-flow__viewport-portal" />
        <NodeRenderer
          on:nodeclick
          on:nodemouseenter
          on:nodemousemove
          on:nodemouseleave
          on:nodedragstart
          on:nodedrag
          on:nodedragstop
          on:nodecontextmenu
        />
        <NodeSelection
          on:selectionclick
          on:selectioncontextmenu
          on:nodedragstart
          on:nodedrag
          on:nodedragstop
        />
      </ViewportComponent>
      <UserSelection />
    </Pane>
  </Zoom>
  <Attribution {proOptions} position={attributionPosition} />
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
