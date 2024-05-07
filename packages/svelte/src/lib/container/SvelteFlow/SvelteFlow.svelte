<script lang="ts">
  import { onMount, hasContext } from 'svelte';
  import cc from 'classcat';
  import {
    ConnectionMode,
    PanOnScrollMode,
    getNodesBounds,
    getViewportForBounds
  } from '@xyflow/system';

  import { key, useStore, createStoreContext } from '$lib/store';

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

  import { useColorModeClass } from '$lib/hooks/useColorModeClass';

  import type { SvelteFlowProps } from './types';
  import { StoreUpdater } from '$lib/components/StoreUpdater';
  import NodeUpdate from './NodeUpdate.svelte';

  let {
    nodes = $bindable([]),
    edges = $bindable([]),
    attributionPosition,
    autoPanOnConnect = true,
    autoPanOnNodeDrag = true,
    children,
    class: className,
    colorMode = 'light',
    connectionLine,
    connectionLineContainerStyle = '',
    connectionLineStyle = '',
    connectionLineType,
    connectionMode = ConnectionMode.Strict,
    connectionRadius,
    defaultEdgeOptions,
    defaultMarkerColor = '#b1b1b7',
    deleteKey,
    edgeTypes,
    elementsSelectable,
    fitView,
    fitViewOptions,
    height,
    id = '1',
    initialViewport = { x: 0, y: 0, zoom: 1 },
    isValidConnection,
    maxZoom,
    minZoom,
    multiSelectionKey,
    nodeDragThreshold,
    nodesConnectable,
    nodesDraggable,
    nodeTypes,
    onbeforedelete,
    onconnect,
    onconnectend,
    onconnectstart,
    ondelete,
    onedgeclick,
    onedgecontextmenu,
    onedgecreate,
    onerror,
    oninit,
    onlyRenderVisibleElements,
    onMove,
    onMoveEnd,
    onMoveStart,
    onnodeclick,
    onnodecontextmenu,
    onnodedrag,
    onnodedragstart,
    onnodedragstop,
    onnodemouseenter,
    onnodemouseleave,
    onnodemousemove,
    onpaneclick,
    onpanecontextmenu,
    onselectionclick,
    onselectioncontextmenu,
    panActivationKey,
    panOnDrag = true,
    panOnScroll = false,
    panOnScrollMode = PanOnScrollMode.Free,
    preventScrolling = true,
    proOptions,
    selectionKey,
    selectionMode,
    selectionOnDrag,
    snapGrid,
    style,
    translateExtent,
    viewport,
    width,
    zoomActivationKey,
    zoomOnDoubleClick = true,
    zoomOnPinch = true,
    zoomOnScroll = true,
    nodeOrigin = [0, 0],
    ...restProps
  }: SvelteFlowProps = $props();

  let domNode = $state<HTMLDivElement>();
  let clientWidth = $state<number>();
  let clientHeight = $state<number>();

  const store = hasContext(key) ? useStore() : createStoreContext();

  if (fitView && width && height) {
    const nodesWithDimensions = nodes.filter(
      (node) => (node.width && node.height) || (node.initialWidth && node.initialHeight)
    );
    const bounds = getNodesBounds(nodesWithDimensions, { nodeOrigin });
    store.viewport = getViewportForBounds(bounds, width, height, 0.5, 2, 0.1);
  }

  onMount(() => {
    store.domNode = domNode!;

    if (fitView !== undefined) {
      store.fitViewOnInit = fitView;
    }

    if (fitViewOptions) {
      store.fitViewOptions = fitViewOptions;
    }

    return () => {
      store.reset();
    };
  });

  // Update width & height on resize
  $effect.pre(() => {
    if (clientWidth !== undefined && clientHeight !== undefined) {
      store.width = clientWidth;
      store.height = clientHeight;
    }
  });

  // Call oninit once when flow is intialized
  let onInitCalled = false;
  $effect(() => {
    if (!onInitCalled && store.initialized) {
      oninit?.();
      onInitCalled = true;
    }
  });

  let colorModeClass = useColorModeClass(colorMode);
</script>

<StoreUpdater
  {nodes}
  {edges}
  {store}
  {viewport}
  {edgeTypes}
  {nodeTypes}
  {minZoom}
  {maxZoom}
  {translateExtent}
  {id}
  {connectionLineType}
  {connectionRadius}
  {selectionMode}
  {snapGrid}
  {defaultMarkerColor}
  {nodesDraggable}
  {nodesConnectable}
  {elementsSelectable}
  {onlyRenderVisibleElements}
  {isValidConnection}
  {autoPanOnConnect}
  {autoPanOnNodeDrag}
  {onerror}
  {ondelete}
  {onedgecreate}
  {connectionMode}
  {nodeDragThreshold}
  {onconnect}
  {onconnectstart}
  {onconnectend}
  {onbeforedelete}
/>

{#each nodes as node (node.id)}
  <NodeUpdate id={node.id} userNode={node} />
{/each}

<div
  bind:this={domNode}
  bind:clientWidth
  bind:clientHeight
  {style}
  class={cc(['svelte-flow', className, $colorModeClass])}
  data-testid="svelte-flow__wrapper"
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
      bind:nodes
      bind:edges
      panOnDrag={panOnDrag === undefined ? true : panOnDrag}
      {selectionOnDrag}
      {onpaneclick}
      {onpanecontextmenu}
    >
      <ViewportComponent>
        <EdgeRenderer {edges} {onedgeclick} {onedgecontextmenu} {defaultEdgeOptions} />
        <ConnectionLine
          {connectionLine}
          containerStyle={connectionLineContainerStyle}
          style={connectionLineStyle}
        ></ConnectionLine>
        <div class="svelte-flow__edgelabel-renderer"></div>
        <div class="svelte-flow__viewport-portal"></div>
        <NodeRenderer
          {nodes}
          {onnodeclick}
          {onnodecontextmenu}
          {onnodemouseenter}
          {onnodemousemove}
          {onnodemouseleave}
          {onnodedrag}
          {onnodedragstart}
          {onnodedragstop}
        />
        <NodeSelection
          {onselectionclick}
          {onselectioncontextmenu}
          {onnodedrag}
          {onnodedragstart}
          {onnodedragstop}
        />
      </ViewportComponent>
      <UserSelection />
    </Pane>
  </Zoom>
  <Attribution {proOptions} position={attributionPosition} />
  {#if children}
    {@render children()}
  {/if}
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
